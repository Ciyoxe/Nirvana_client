<script setup lang="ts">
import { computed, reactive  } from 'vue';
import { sendRequest } from '@/utils';

import Head from '@components/Head.vue';

type Chat = {
    id      : string,
    name    : string,
    type    : "personal" | "group" | "anonymous",
    preview : string,
    lastDate: string,
};
const state = reactive({
    error: null as string | null,
    chats: [] as Chat[],
});

sendRequest("post", "/api/chat/load-chats", { count: 100, offset: 0 }, {
    200: (json) => {
        state.chats = json.chats;
        state.error = null;
    },
    "_": () => {
        state.chats = [];
        state.error = "Ошибка получения списка диалогов";
    },
});
const personalChats = computed(() => state.chats.filter((chat) => chat.type === "personal"));
const deleteChat = (chatId: string) => {
    sendRequest("delete", "/api/chat/personal", { chatId }, {
        200: () => {
            state.chats = state.chats.filter((chat) => chat.id !== chatId);
        },
    });
}


state.chats = [
    {
        id: "1",
        name: "Новый диалог",
        type: "personal",
        preview: "Тестовый диалог",
        lastDate: "2022-01-01 00:00:00",
    },
    {
        id: "2",
        name: "Новый диалог",
        type: "personal",
        preview: "Тестовый диалог",
        lastDate: "2022-01-01 00:00:00",
    },
    {
        id: "3",
        name: "Новый диалог",
        type: "personal",
        preview: "Тестовый диалог",
        lastDate: "2022-01-01 00:00:00",
    },
];
</script>

<template>
<Head/>
<main class="flex-col">
    <h1>Диалоги</h1>
    <div class="flex-col list">
        <div v-for="chat in personalChats" class="flex-row" @click="$router.push(`/chat/${chat.id}`)">
            <h3>
                {{ chat.name }}
            </h3>
            {{ chat.preview }}
            <button @click="deleteChat(chat.id)"> удалить </button>
        </div>
    </div>
</main>
</template>

<style scoped lang="scss">
main {
    align-items: center;
    justify-content: center;
    position: relative;
}
img {
    width: 50px;
    height: 50px;
}
.list {
    gap: 10px;
}
.create-profile-dim {
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}
.create-profile {
    border-radius: 10px;
    padding: 10px;
    background-color: var(--back-col-1);
    position: absolute;
    gap: 10px;
}
</style>