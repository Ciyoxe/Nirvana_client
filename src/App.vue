<script setup lang="ts">
import { useAppStore } from '@stores/app';
import { useRouter } from "vue-router";

const app    = useAppStore();
const router = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}

const events = new EventSource("/api/event");
events.onmessage = (event) => {
    app.newEvent(JSON.parse(event.data));
}
window.onbeforeunload = () => {
    events.close();
}

import Maincont from "@/uiblocks/Maincont.vue";
</script>

<template>
<Maincont>
    <RouterView></RouterView>
</Maincont>
</template>

<style scoped>
</style>
