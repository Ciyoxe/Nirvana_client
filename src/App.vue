<script setup lang="ts">
import Loading from '@components/Loading.vue';

import { useAppStore } from '@stores/app';
import { ref, watchEffect } from 'vue';
import { useRouter } from "vue-router";
import { sendRequest } from './utils';

const app    = useAppStore();
const router = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}
else
if (app.profile === null) {
    router.replace("/profiles");
}

const eventsRunning = ref(false);

setInterval(() => {
    if (eventsRunning.value || !app.loggedIn || app.profile === null)
        return;
    sendRequest("post", "/api/event/subscribe", {}, {
        200 : () => {
            eventsRunning.value = true
        },
    });
}, 5000);

watchEffect(()=> {
    if (!app.loggedIn || app.profile === null)
        eventsRunning.value = false;
});

watchEffect(async () => {
    if (!eventsRunning.value || !app.loggedIn || app.profile === null)
        return;
    while (eventsRunning.value && app.loggedIn && app.profile !== null) {
        await sendRequest("post", "/api/event/consume", {}, {
            200 : (json) => {
                for (const event of json.events) {
                    app.newEvent(event);
                }
            },
            "_" : () => eventsRunning.value = false
        });
    }
});
</script>

<template>
    <Loading/>
    <RouterView/>
</template>

<style scoped>
</style>
