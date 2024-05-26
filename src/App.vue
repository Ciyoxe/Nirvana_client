<script setup lang="ts">
import Loading from '@components/Loading.vue';

import { useAppStore } from '@stores/app';
import { useRouter } from "vue-router";

const app    = useAppStore();
const router = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}
else
if (app.profile === null) {
    router.replace("/profiles");
}

const events = new EventSource("/api/event");
events.onmessage = (event) => {
    app.newEvent(JSON.parse(event.data));
}
window.onbeforeunload = () => {
    events.close();
}
</script>

<template>
    <Loading/>
    <RouterView/>
</template>

<style scoped>
</style>
