<script setup lang="ts">
import { useAppStore } from '@stores/app';

const app = useAppStore();
</script>

<template>
<div class="loading-background" v-show="app.loading">
    <img :src="'../assets/loading.svg'" />
</div>
</template>

<style scoped lang="scss">
.loading-background {
    position  : absolute;
    inset     : 0;
    background: #0003; 

    display         : flex;
    align-items     : center;
    justify-content : center;
}
img {
    width : 64px;
    height: 64px;
}
</style>