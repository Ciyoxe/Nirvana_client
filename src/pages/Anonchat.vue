<script setup lang="ts">

import Head from '@components/Head.vue';
import Rating from '@uiblocks/Rating.vue';

import { sendRequest } from '@/utils';
import { useAppStore } from '@stores/app';
import { useRouter   } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const app    = useAppStore();

const state = reactive({
    searching: false,
});
const user = reactive({
    rating: null as number | null,
    gender: null as "m" | "f" | null,
    age   : null as number | null,
});
const filter = reactive({
    gender    : null as "m" | "f" | null,
    minAge    : null as number | null,
    maxAge    : null as number | null,
    minRating : null as number | null,
    maxRating : null as number | null,
});

app.setLoading(true);
sendRequest("get", "/api/profile/" + app.profileId, {}, {
    200: (json) => {
        app.setLoading(false);
        user.rating = json.rating;
    },
    '_': () => {
        
    }
})

const getAge = (event: Event, fn: (v: number | null) => void)=> {
    const value = (event.target as HTMLInputElement).value;
    const age   = parseInt(value);
    fn(isNaN(age) || age < 0 || age > 99 ? null : age);
}
const getRating = (event: Event, fn: (v: number | null) => void)=> {
    const value = (event.target as HTMLInputElement).value;
    const rating = parseInt(value);
    fn(isNaN(rating) || rating < -10 || rating > 10 ? null : rating);
}
const startChat = ()=> {
    state.searching = true;
    sendRequest("post", "/api/chat/anonymous/enter-queue", {
        filter,
        gender: user.gender,
        age   : user.age,
    }, { });
};
const cancelChat = ()=> {
    sendRequest("post", "/api/chat/anonymous/leave-queue", {}, {
        200: () => {
            state.searching = false;
        }
    });
};
app.useEvents(event => {
    if (event.type === "anon-chat-enter") {
        state.searching = false;
        router.push(`/chat/${event.chatId}`);
    }
});
</script>

<template>
<Head/>
<main class="flex-col panel-2 main-cont">
    <h1>
        Анонимный чат
    </h1>
    <div class="flex-col" style="gap: 10px" v-if="!state.searching">
        <h3>
            Ваши параметры
        </h3>
        <span>
            Рейтинг:
            <Rating :rating="user.rating ?? -10"></Rating>
        </span>
        Пол:
        <div class="buttons">
            <button :class="{ active: user.gender === null }" @click="user.gender = null; filter.gender = null">Не указан</button>
            <button :class="{ active: user.gender === 'm'  }" @click="user.gender = 'm' ">М</button>
            <button :class="{ active: user.gender === 'f'  }" @click="user.gender = 'f' ">Ж</button>
        </div>
        Возраст:
        <input type="number" min="0" max="99" 
            @input="getAge($event, a => { user.age = a; if (a === null) { filter.minAge = null; filter.maxAge = null; } })"
        >

        <h3>
            Параметры собеседника
        </h3>
        Пол:
        <div class="buttons">
            <button :disabled="user.gender === null" :class="{ active: filter.gender === null }" @click="filter.gender = null">Любой</button>
            <button :disabled="user.gender === null" :class="{ active: filter.gender === 'm'  }" @click="filter.gender = 'm' ">М</button>
            <button :disabled="user.gender === null" :class="{ active: filter.gender === 'f'  }" @click="filter.gender = 'f' ">Ж</button>
        </div>

        Возраст:
        <div class="flex-row" style="align-items: center; gap: 10px;">
            от
            <input 
                type="number" min="0" max="99" style="flex: 1; min-width: 0;" 
                @input="getAge($event, a => filter.minAge = a)" 
                :value="filter.minAge"
                :disabled="user.age === null"
            >
            до
            <input type="number" min="0" max="99" style="flex: 1; min-width: 0;"
                @input="getAge($event, a => filter.maxAge = a)" 
                :value="filter.maxAge"
                :disabled="user.age === null"
            >
        </div>

        Рейтинг:
        <div class="flex-row" style="align-items: center; gap: 10px;">
            от
            <input type="number" min="-10" max="10" @input="getRating($event, a => filter.minRating = a)" style="flex: 1; min-width: 0;" :value="filter.minRating">
            до
            <input type="number" min="-10" max="10" @input="getRating($event, a => filter.maxRating = a)" style="flex: 1; min-width: 0;" :value="filter.maxRating">
        </div>
        <div style="height: 20px;"></div>

        <button @click="startChat()">Начать чат</button>
    </div>
    <div v-else class="flex-col" style="gap: 20px">
        <h2>
            Поиск собеседника ...
        </h2>
        <button @click="cancelChat()">Отмена</button>
    </div>
</main>
</template>

<style scoped lang="scss">
main {
   gap: 20px; 
}
h2 {
    text-align: center;
}
.buttons > button {
    border-radius: 0;
    min-width: 100px;

    &:first-child {
        border-radius: 10px 0 0 10px;
        border-right: 0;
    }
    &:last-child {
        border-radius: 0 10px 10px 0;
        border-left: 0;
    }
    &.active {
        background-color: var(--accent-col-2);
    }
}
</style>