<script setup lang="ts">
import Maincont from "@/components/Maincont.vue";

import { useAppStore } from '@stores/app';
import { useRouter } from "vue-router";
import { onResponse } from "./api/sendRequest";
import { useProfilesStore } from "@stores/profiles";

const app      = useAppStore();
const profiles = useProfilesStore();
const router   = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}

onResponse.on(res => {
    if (res.status === 401) {
        app.setLoggedIn(false);
        router.replace("/auth");
    }
    if (res.status === 400 && res.data.error === "Profile not found") {
        profiles.setCurrentProfile(null);
        router.replace("/profiles");
    }
});

</script>

<template>
<Maincont>
    <RouterView></RouterView>
</Maincont>
</template>

<style scoped>
</style>
