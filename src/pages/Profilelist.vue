<script setup lang="ts">
import { reactive  } from 'vue';
import { useRouter } from 'vue-router';

import { sendRequest } from '@/utils';
import Userpreview from '@uiblocks/Userpreview.vue';

import Head  from '@components/Head.vue';
import Popup from '@uiblocks/Popup.vue';
import Imageupload from "@uiblocks/Imageupload.vue";
import { useAppStore } from '@stores/app';


const router = useRouter();
const app    = useAppStore();

type Profile = {
    _id     : string,
    name    : string,
    avatar  : string | null,
    rating  : number,
    active  : boolean,
};
const state = reactive({
    error   : null as string | null,
    profiles: [] as Profile[],
});

sendRequest("get", "/api/profile/list", {}, {
    200: (json) => {
        state.profiles = json.profiles;
        state.error    = null;
    },
    "_": () => {
        state.error    = "Произошла ошибка получения профилей";
    },
});
const selectProfile = (profileId: string) => {
    sendRequest("post", "/api/profile/active", { profileId }, {
        200: () => {
            app.setProfile(profileId);
            for (const profile of state.profiles) {
                profile.active = profile._id === profileId;
            };
            router.push(`/profile/${profileId}`);
        },
    });
}
const deleteProfile = (profileId: string) => {
    sendRequest("delete", "/api/profile", { profileId }, {
        200: (json) => {
            app.setProfile(json.newActive);
            state.profiles = state.profiles.filter((profile) => profile._id !== profileId);
            for (const profile of state.profiles) {
                profile.active = profile._id === json.newActive;
            };
        },
    });
}

const createProfileState = reactive({
    active  : false,
    name    : "",
    avatar  : "",
});
const createProfile = () => {
    sendRequest("post", "/api/profile", { name: createProfileState.name, avatar: createProfileState.avatar }, {
        200: (json) => {
            const newProfileActive = state.profiles.every(p => !p.active);
            state.profiles.push({
                _id    : json.profileId,
                active : newProfileActive,
                name   : createProfileState.name,
                avatar : createProfileState.avatar,
                rating : 0,
            });
            if (newProfileActive) {
                app.setProfile(json.profileId);
            }
            createProfileState.active = false;
        },
    });
}
</script>

<template>
<Head/>
<main class="flex-col panel-2 main-cont">
    <Popup :dimmed="0.5" v-if="createProfileState.active">
        <div class="flex-col" style="gap: 10px; width: 400px;">
            <h1>Создание профиля</h1>
            <label>Имя</label>
            <input v-model="createProfileState.name">
            <label>Аватар</label>
            <Imageupload @urlinput="createProfileState.avatar = $event;"/>
            <button @click="createProfile()">Создать</button>
            <button @click="createProfileState.active = false">Отмена</button>
        </div>
    </Popup>
    <h1>Профили</h1>
    <div class="flex-col list">
        <div v-for="profile in state.profiles" class="flex-row list-item" @click="selectProfile(profile._id)">
            <Userpreview
                :avatar="profile.avatar"
                :username="profile.name"
                :rating="profile.rating"
            />
            <button class="delete-btn" @click="deleteProfile(profile._id)"></button>
        </div>
    </div>
    <button @click="createProfileState.active = true">Создать</button>
</main>
</template>

<style scoped lang="scss">
img {
    width: 50px;
    height: 50px;
}
.list {
    gap: 10px;
    overflow-y: scroll;

    box-shadow: inset 0 18px 20px -20px #0003, inset 0 -18px 20px -20px #0003;
}
.list-item {
    align-items: center;
    justify-content: space-between;

    border: 2px solid var(--back-col-2);
    border-radius: 10px 0 0 10px;

    padding: 5px;
}
.create-profile-dim {
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}
.create-profile {
    border-radius: 10px;
    padding: 10px;
    background-color: var(--back-col-1);
    position: absolute;
    gap: 10px;
}
.delete-btn {
    background-image: url('/assets/delete.svg');
    background-size: 100% 100%;
    background-repeat: no-repeat;

    width: 40px;
    height: 40px;
}
</style>