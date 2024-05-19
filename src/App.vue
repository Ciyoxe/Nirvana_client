<script setup lang="ts">
import Loading from '@components/Loading.vue';

import { useAppStore } from '@stores/app';
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { sendRequest } from './utils';

const app    = useAppStore();
const route  = useRoute();
const router = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}
else
if (app.profile === null) {
    router.replace("/profiles");
}
else
if (route.path === "/") {
    router.replace("/profiles");
}

let eventsRunning = ref(false);
const subscribeToEvents = () => {
    sendRequest("post", "/api/event/subscribe", {}, {
        200 : () => {
            console.log("Subscribed to events");
            eventsRunning.value = true
        },
    });
};
watchEffect(() => {
    if (app.loggedIn) {
        console.log("Logged in");
        subscribeToEvents();
    }
    else {
        eventsRunning.value = false;
    } 
});

watchEffect(async () => {
    if (!eventsRunning)
        return;
    while (eventsRunning) {
        await sendRequest("post", "/api/event/consume", {}, {
            200 : (json) => {
                for (const event of json.events) {
                    app.newEvent(event);
                }
            },
            "_" : () => setTimeout(subscribeToEvents, 5000)
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
