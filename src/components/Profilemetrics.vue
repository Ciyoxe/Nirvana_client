<script setup lang="ts">
defineProps<{
    info: {
        self      : boolean,
        role      : string,
        posts     : number,
        rating    : number,
        following : number,
        followers : number,
    }
}>();

</script>

<template>
<div class="info flex-row">
    <VCard variant="outlined" class="info-cell">
        <div class="info-content">
           {{ Math.round(info.rating) < 0 ? "-" : (Math.round(info.rating) === 0 ? "" : "+") }}
           {{ Math.round(Math.abs(info.rating)) }}
        </div>
        Рейтинг
    </VCard>
    <VCard variant="outlined" class="info-cell">
        <div class="info-content">
            {{ info.posts }}
        </div>
        Посты
    </VCard>
    <VCard variant="outlined" class="info-cell">
        <div class="info-content">
            {{ info.following }}
        </div>
        Подписки
    </VCard>
    <VCard variant="outlined" class="info-cell">
        <div class="info-content">
            {{ info.followers }}
        </div>
        Подписчики
    </VCard>
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
    border-radius: 10px;
}
.info-content {
    font-weight: bold;
    font-size: 2.5rem;
}
</style>