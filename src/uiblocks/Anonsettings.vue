<script setup lang="ts">
import Ratingsm from '@uiblocks/Ratingsm.vue';

import { onMounted, reactive, watchEffect } from 'vue';
import { getProfile  } from '@/api/profiles';
import { useProfilesStore } from '@stores/profiles';
import { mdiClose } from '@mdi/js';
import { useChatsStore } from '@stores/chats';

const emit = defineEmits<{
    (e: "start"): void
}>();

const chats    = useChatsStore();
const profiles = useProfilesStore();

const minAge    = 10;
const maxAge    = 50;
const minRating = -10;
const maxRating = 10;

const state = reactive({
    error     : false,
    errorText : "",
});
const user = reactive({
    rating: null as number | null,
    gender: null as "m" | "f" | null,
    age   : minAge,
});
const filter = reactive({
    gender    : null as "m" | "f" | null,
    age       : [minAge, maxAge],
    rating    : [minRating, maxRating],
});

const error = (text: string)=> {
    state.error     = true;
    state.errorText = text;
}
const startChat = ()=> {
    chats.anonParams = {
        gender : user.gender,
        age    : user.age === minAge ? null : user.age,
        filter : {
            gender : filter.gender,
            minAge : filter.age[0] === minAge ? null : filter.age[0],
            maxAge : filter.age[1] === maxAge ? null : filter.age[1],
            minRating : filter.rating[0] === minRating ? null : filter.rating[0],
            maxRating : filter.rating[1] === maxRating ? null : filter.rating[1],
        }
    };
    emit("start");
}

onMounted(()=> {
    if (profiles.currentProfileId === null) {
        error("Произошла ошибка, войдите в профиль еще раз");
    }
    else {
        getProfile({ profileId: profiles.currentProfileId }, {
            200: (profile) => {
                if (profile.self)
                    user.rating = profile.rating;
                else
                    error("Произошла ошибка, обновите страницу");
            },
            '_': () => error("Произошла ошибка, повторите попытку позже")
        });
    }
})
// restore saved settings
onMounted(()=> {
    if (chats.anonParams === null)
        return;
    user.age         = chats.anonParams.age ?? minAge;
    user.gender      = chats.anonParams.gender;
    filter.age[0]    = chats.anonParams.filter.minAge ?? minAge;
    filter.age[1]    = chats.anonParams.filter.maxAge ?? maxAge;
    filter.rating[0] = chats.anonParams.filter.minRating ?? minRating;
    filter.rating[1] = chats.anonParams.filter.maxRating ?? maxRating;
});
watchEffect(()=> {
    if (user.rating === null)
        return;
    if (filter.rating[0] > Math.round(user.rating) - 2)
        filter.rating[0] = Math.max(minRating, user.rating - 2);
})
</script>

<template>
<p>Ваш рейтинг: <Ratingsm :rating="user.rating ?? 0"/></p>
<p>Минимальный рейтинг собеседников не может быть больше вашего</p>

<h2>Ваши параметры:</h2>

<div class="flex-col setting">
    Пол:
    <VBtnGroup>
        <VBtn :variant="user.gender === 'm'  ? 'tonal' : 'outlined'" @click="user.gender = 'm'">М</VBtn>
        <VBtn :variant="user.gender === 'f'  ? 'tonal' : 'outlined'" @click="user.gender = 'f'">Ж</VBtn>
        <VBtn :variant="user.gender === null ? 'tonal' : 'outlined'" @click="user.gender = null">Не указан</VBtn>
    </VBtnGroup>
</div>

<div class="flex-col setting">
    Возраст: {{ user.age === minAge ? "не указан" : user.age === maxAge ? "больше " + maxAge : user.age }}
    <VSlider
        v-model="user.age"
        :min="minAge"
        :max="maxAge"
        :step="1"
        thumb-label
    >
        <template v-slot:append>
            <VBtn :icon="mdiClose" @click="user.age = minAge"/>
        </template>
    </VSlider>
</div>

<h2>Параметры собеседника:</h2>
<div class="flex-col setting" v-if="user.gender !== null">
    Пол:
    <VBtnGroup>
        <VBtn :variant="filter.gender === 'm'  ? 'tonal' : 'outlined'" @click="filter.gender = 'm'">М</VBtn>
        <VBtn :variant="filter.gender === 'f'  ? 'tonal' : 'outlined'" @click="filter.gender = 'f'">Ж</VBtn>
        <VBtn :variant="filter.gender === null ? 'tonal' : 'outlined'" @click="filter.gender = null">Любой</VBtn>
    </VBtnGroup>
</div>

<div class="flex-col setting" v-if="user.age !== minAge">
    Возраст: {{ 
        filter.age[0] === minAge && filter.age[1] === maxAge ? "Любой" :
        filter.age[0] === filter.age[1] ? (filter.age[0] === maxAge ? "больше " + maxAge : filter.age[0]) :
        filter.age[0] === minAge ? 'до ' + filter.age[1] :
        filter.age[1] === maxAge ? 'от ' + filter.age[0] :
        'от ' + filter.age[0] + ' до ' + filter.age[1]
    }}
    <VRangeSlider
        v-model="filter.age"
        :min="10"
        :max="50"
        :step="1"
        thumb-label
    >
        <template v-slot:append>
            <VBtn :icon="mdiClose" @click="filter.age = [minAge, maxAge]"/>
        </template>
    </VRangeSlider>
</div>

<div class="flex-col setting">
    Рейтинг: {{ 
        filter.rating[0] === minRating && filter.rating[1] === maxRating ? "Любой" :
        filter.rating[0] === filter.rating[1] ? filter.rating[0] :
        filter.rating[0] === minRating ? 'до ' + filter.rating[1] :
        filter.rating[1] === maxRating ? 'от ' + filter.rating[0] :
        'от ' + filter.rating[0] + ' до ' + filter.rating[1]
    }}
    <VRangeSlider
        v-model="filter.rating"
        :min="-10"
        :max="10"
        :step="1"
        thumb-label
    >
        <template v-slot:append>
            <VBtn :icon="mdiClose" @click="filter.rating = [minRating, maxRating]"/>
        </template>
    </VRangeSlider>
</div>

<VBtn variant="tonal" width="100%" @click="startChat()">Начать чат</VBtn>

<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
h2 {
    margin-bottom: 20px;
    margin-top:    20px;
}
p:first-child > * {
    margin-left: 10px;
}
.setting {
    gap: 10px;
    padding: 10px;
    padding-left: 0;
    margin-bottom: 10px;
}
</style>