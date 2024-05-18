<script setup lang="ts">
import Rating from '@/uiblocks/Rating.vue';

defineProps<{
    info: {
        self      : boolean,
        role      : string,
        rating    : number,
        following : number,
        followers : number,
    }
}>();

</script>

<template>
<div class="info flex-row">
    <div class="info-cell">
        <Rating :rating="info.rating" :editable="!info.self" class="info-content"/>
        Рейтинг
    </div>
    <div class="info-cell">
        <div class="info-content">
            {{ info.following }}
        </div>
        Подписки
    </div>
    <div class="info-cell">
        <div class="info-content">
            {{ info.followers }}
        </div>
        Подписчики
    </div>
</div>
</template>

<style scoped lang="scss">
.info {
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 10px;
}
.info-cell {
    height: 80px;
    aspect-ratio: 1.618;
    font-size: 0.8rem;
    align-content: center;
    text-align: center;

    border: 2px solid var(--back-col-3);
    border-radius: 10px;
}
.info-content {
    font-weight: bold;
    font-size: 2.5rem;
}
</style>