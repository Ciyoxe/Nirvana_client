<script setup lang="ts">
import { deleteProfile, setActiveProfile } from '@/api/profiles';
import { mdiDelete } from '@mdi/js';
import { reactive  } from 'vue';

const profiles = defineModel<{
    _id    : string,
    active : boolean,
    name   : string,
    rating : number,
    avatar : string | null,
    about  : string | null,
}[]>({
    default: [],
});
const emit = defineEmits<{
    (e: "deleted", profileId: string, activeId: string | null): void,
    (e: "selected", profileId: string): void
}>();

const state = reactive({
    dialogShown     : false,
    profileToDelete : null as string | null,
    errorShown      : false,
    errorText       : "",
});

const error = (text: string)=> {
    state.errorShown = true;
    state.errorText  = text;
}
const tryDeleteProfile = (profileId: string)=> {
    state.profileToDelete = profileId;
    state.dialogShown     = true;
}
const confirmDeletion = ()=> {
    const deletedId = state.profileToDelete;

    state.profileToDelete = null;
    state.dialogShown     = false;

    if (deletedId === null)
        return;

    deleteProfile({ profileId: deletedId }, {
        200: (data) => {
            profiles.value = profiles.value.filter((profile) => profile._id !== deletedId);
            emit("deleted", deletedId, data.activeId);
        },
        '_': ()=> {
            error("Произошла ошибка удаления профиля, повторите попытку позже");
        }
    });
}
const selectProfile = (profileId: string)=> {
    setActiveProfile({ profileId }, {
        200: () => {
            profiles.value.forEach(profile => profile.active = profile._id === profileId);
            emit("selected", profileId);
        },
        '_': ()=> {
            error("Произошла ошибка выбора профиля, повторите попытку позже");
        }
    });
}
</script>

<template>
<VList lines="one" width="100%" height="100%" class="list flex-col">
    <VListItem v-for="profile of profiles" :key="profile._id" :variant="profile.active ? 'tonal' : undefined" rounded="lg">
        <div class="flex-row" @click="selectProfile(profile._id)">
            <VAvatar size="64" rounded="lg" start :image="profile.avatar ?? ''"/>

            <div class="flex-row content">
                <VListItemTitle class="title">
                    {{ profile.name }}
                    <VListItemSubtitle>{{ profile.about }}</VListItemSubtitle>
                </VListItemTitle>
                <VBtn :icon="mdiDelete" @click.stop="tryDeleteProfile(profile._id)"></VBtn>
            </div>
        </div>
    </VListItem>
</VList>
<VDialog v-model="state.dialogShown" max-width="1000px">
    <VCard>
        <VCardTitle>Подтвердите удаление</VCardTitle>
        <VCardText>Вы уверены, что хотите удалить аккаунт? Это действие нельзя будет отменить.</VCardText>
        <VCardActions>
            <VBtn color="primary" @click="state.dialogShown = false">Отмена</VBtn>
            <VBtn color="error"   @click="confirmDeletion()">Удалить</VBtn>
        </VCardActions>
    </VCard>
</VDialog>
<VSnackbar v-model="state.errorShown" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.list {
    display: flex;
    gap: 10px;
}
.title {
    max-width: 50%;
}
.content {
    flex: 1;
    align-items: center;
    justify-content: space-between;
}
</style>