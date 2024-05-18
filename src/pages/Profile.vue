<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import { sendRequest } from '@/utils';

import Profiledata from '@components/Profiledata.vue';
import Head from '@components/Head.vue';

const profileId = useRoute().params.id;
const state     = reactive({
    info: null as null | {
        self        : boolean,
        about       : string | null,
        name        : string,
        avatar      : string | null,
        banner      : string | null,
        created     : string,
        online      : string,
        role        : "user" | "admin",
        rating      : number,
        following   : number,
        followers   : number,
        isFollowing : boolean,
        isBlocked   : boolean,
    },
});

state.info = {
    self        : true,
    name        : "NAME",
    about       : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur cursus, nisl nisl aliquet nisl, eget aliquet nisl nisl",
    avatar      : "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.PYipJ_hSncugM2SwnZitvgHaEK%26pid%3DApi&sp=1715856581T14ae9d24c0f9c9e6b620ed8897fe5f67b9d5184120308c0b4ac643085ca3c28d",
    banner      : "https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?t=st=1716015376~exp=1716015976~hmac=a68ff37e270fdd34fdd6a183221d74b0b56a12fc3603b98164208d2fca69ded4",
    created     : "2023-01-15T10:30:00.000Z",
    online      : "2024-05-16T12:00:43.766Z",
    role        : "user",
    rating      : 5,
    following   : 10,
    followers   : 15,
    isFollowing : false,
    isBlocked   : false,
}

sendRequest("post", "/api/profile/get-info", { profileId }, {
    200: (json) => {
        state.info = json;
    },
});
</script>

<template>
<Head/>
<main class="flex-col">
    <Profiledata :info="state.info" v-if="state.info"/>
</main>
</template>

<style scoped lang="scss">
main {
    align-items: center;
}
</style>