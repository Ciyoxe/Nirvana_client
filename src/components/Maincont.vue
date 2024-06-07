<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
<VApp class="main">
    <div class="flex-col main app-cont">
        <Header/>
        <VMain class="main-cont main flex-col">
            <VSheet class="main-sheet" elevation="10" height="100%">
                <slot></slot>
            </VSheet>
        </VMain>
    </div>
</VApp>
</template>

<style scoped lang="scss">
.main {
    height : 100%;
    width  : 100%;
}
.app-cont {
    padding: 10px;
    padding-top: 0;
}
.main-cont {
    align-items : center;
}
.main-sheet {
    overflow-y: scroll;
    width: 100%;
    padding: 10px;
    max-width: 1000px;
    border-radius: 0 0 10px 10px;
}
</style>