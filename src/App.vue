<script setup lang="ts">
import Loading from '@components/Loading.vue';

import { useAppStore } from '@stores/app';
import { useRouter   } from "vue-router"

const app    = useAppStore();
const router = useRouter(); 

if (!app.loggedIn) {
    router.replace("/auth");
}
</script>

<template>
    <Loading/>
    <RouterView/>
</template>

<style scoped>
</style>
