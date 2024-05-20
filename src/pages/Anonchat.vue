<script setup lang="ts">

import Head from '@components/Head.vue';
import { sendRequest } from '@/utils';
import { useAppStore } from '@stores/app';
import { useRouter   } from 'vue-router';

const router = useRouter();
const app    = useAppStore();

const user = {
    gender: null as "m" | "f" | null,
    age   : null as number | null,
};
const filter = {
    gender    : null as "m" | "f" | null,
    minAge    : null as number | null,
    maxAge    : null as number | null,
    minRating : null as number | null,
    maxRating : null as number | null,
};

const getGender = (event: Event, fn: (v: "m" | "f" | null) => void)=> {
    const value  = (event.target as HTMLInputElement).value;
    const gender = value === "m" || value === "f" ? value : null;
    fn(gender);  
}
const getAge = (event: Event, fn: (v: number | null) => void)=> {
    const value = (event.target as HTMLInputElement).value;
    const age   = parseInt(value);
    fn(isNaN(age) || age < 0 || age > 99 ? null : age);
}
const getRating = (event: Event, fn: (v: number | null) => void)=> {
    const value = (event.target as HTMLInputElement).value;
    const rating = parseInt(value);
    fn(isNaN(rating) || rating < -10 || rating > 10 ? null : rating);
}
const startChat = ()=> {
    sendRequest("post", "/api/chat/anonymous/enter-queue", {
        filter,
        gender: user.gender,
        age   : user.age,
    }, { });
};
app.useEvents(event => {
    if (event.type === "anon-chat-enter") {
        router.push(`/chat/${event.chatId}`);
    }
});
</script>

<template>
<Head/>
<main class="flex-col">
    <label>
        Пол
        <select @input="getGender($event, g => user.gender = g)">
            <option value="" selected>Не указан</option>
            <option value="m">Мужской</option>
            <option value="f">Женский</option>
        </select>
    </label>
    <label>
        Возраст
        <input type="number" min="0" max="99" @input="getAge($event, a => user.age = a)">
    </label>
    <label>
        Пол собеседника
        <select @input="getGender($event, g => filter.gender = g)">
            <option value="" selected>Любой</option>
            <option value="m">Мужской</option>
            <option value="f">Женский</option>
        </select>
    </label>
    <label>
        Возраст собеседника от
        <input type="number" min="0" max="99" @input="getAge($event, a => filter.minAge = a)">
    </label>
    <label>
        Возраст собеседника до
        <input type="number" min="0" max="99" @input="getAge($event, a => filter.maxAge = a)">
    </label>
    <label>
        Рейтинг собеседника от
        <input type="number" min="-10" max="10" @input="getRating($event, r => filter.minRating = r)">
    </label>
    <label>
        Рейтинг собеседника до
        <input type="number" min="-10" max="10" @input="getRating($event, r => filter.maxRating = r)">
    </label>

    <button @click="startChat()">Начать чат</button>
</main>
</template>

<style scoped lang="scss">

</style>