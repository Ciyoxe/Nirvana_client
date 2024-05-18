<script setup lang="ts">
defineProps<{
    dimmed: number,
}>();
</script>

<template>
<div class="popup-back flex-col" :style="{ background: `rgba(0,0,0,${dimmed})` }">
    <div class="popup-block panel-3">
        <slot></slot>
    </div>
</div>
</template>

<style scoped lang="scss">
.popup-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(0, 0, 0);
    z-index: 10;

    align-items: center;
    justify-content: center;
}
.popup-block {
    background-color: var(--back-col-1);
    border-radius: 10px;
    padding: 10px;
}
</style>