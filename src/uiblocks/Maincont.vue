<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
<VApp class="main">
    <VLayout width="100%" full-height>
        <Header></Header>
        <VMain class="main-cont flex-col">
            <VSheet class="main-sheet" elevation="10" height="100%">
                <slot></slot>
            </VSheet>
        </VMain>
    </VLayout>
</VApp>
</template>

<style scoped lang="scss">
.main {
    height : 100%;
    width  : 100%;
}
.main-cont {
    margin      : 10px;
    margin-top  : 0;
    align-items : center;
}
.main-sheet {
    width: 100%;
    padding: 10px;
    max-width: 1000px;
    border-radius: 0 0 10px 10px;
}
</style>