<script setup lang="ts">
defineProps<{
    rating   : number,
    editable?: boolean,
}>();
defineEmits<{
    (e: "vote-up"): void
    (e: "vote-down"): void
}>();
</script>

<template>
<div class="flex-row rating">
    <div class="info-content" :style="{ color: rating < 0 ? 'var(--neg-col)' : rating > 0 ? 'var(--pos-col)' : 'var(--text-col-normal)' }">
        {{ rating < 0 ? "-" : "+" }}{{ Math.abs(rating).toFixed(0) }}
    </div>
    <div role="button" class="vote up" @click="$emit('vote-up')" v-if="editable"></div>
    <div role="button" class="vote down" @click="$emit('vote-down')" v-if="editable"></div>
</div>
</template>

<style scoped lang="scss">
.rating {
    justify-content: left;
    align-items: center;
}
.vote {
    width: 30px;
    height: 20px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: var(--text-col-normal);
}
.up {
    margin-left: 5px;

    -webkit-mask-image: url('/assets/up.svg');
    mask-image: url('/assets/up.svg');

    &:hover, &:active {
        background-color: var(--pos-col);
    }
}
.down {
    -webkit-mask-image: url('/assets/down.svg');
    mask-image: url('/assets/down.svg');

    &:hover, &:active {
        background-color: var(--neg-col);
    }
}
</style>