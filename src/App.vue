<script setup lang="ts">
import Loading from '@components/Loading.vue';

import { useAppStore } from '@stores/app';
import { onMounted, watchEffect } from 'vue';
import { useRouter   } from "vue-router";
import { sendRequest } from './utils';

const app    = useAppStore();
const router = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}
else {
    router.replace("/profiles");
}


let eventsRunning = false;
const subscribeToEvents = () => {
    sendRequest("post", "/api/event/subscribe", {}, {
        200 : () => eventsRunning = true,
    });
};
watchEffect(() => {
    if (app.loggedIn)
        subscribeToEvents();
    else 
        eventsRunning = false;
});

onMounted(async ()=> {
    while (eventsRunning) {
        await sendRequest("get", "/api/event/", {}, {
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
