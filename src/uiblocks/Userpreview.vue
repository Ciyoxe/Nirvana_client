<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    username  : string,
    avatar?   : string  | null,
    link?     : string
    rating?   : number,
    online?   : boolean,
}>();

const isRatingShown = computed(()=> props.rating && isFinite(props.rating));
const ratingValue = computed(()=> {
    if (!props.rating || isNaN(props.rating)) 
        return '';
    const rounded = Math.round(props.rating);
    const sign    = rounded < 0 ? '-' : rounded > 0 ? '+' : '';

    return sign + Math.abs(rounded);
});
const ratingClass = computed(()=> {
    if (!props.rating || isNaN(props.rating)) 
        return '';
    const rounded = Math.round(props.rating);
    return rounded < 0 ? 'neg' : rounded > 0 ? 'pos' : '';
})
</script>

<template>
<div class="user-preview flex-row">
    <img v-if="avatar && avatar.length > 0" class="avatar" :src="avatar">
    <a :href="link">{{ username }}</a>
    <div v-if="isRatingShown" class="rating" title="Рейтинг пользователя">
        [ 
        <span :class="ratingClass">
            {{ ratingValue }}
        </span>
        ]
    </div>
    <div v-if="online" class="online" title="Пользователь онлайн"></div>
</div>
</template>

<style scoped lang="scss">
a {
    color: var(--text-col-accent);
}
img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    object-fit: cover;
    border: 2px solid var(--back-col-2);
}
.user-preview {
    gap: 10px;
    align-items: center;
}
.pos {
    color: var(--pos-col);
}
.neg {
    color: var(--neg-col);
}
.rating {
    user-select: none;
}
.online {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--pos-col);
}
</style>