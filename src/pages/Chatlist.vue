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
<main class="flex-col panel-2 main-cont">
    <h1>Диалоги</h1>
    <div class="flex-col chat-list">
        <div v-for="chat in personalChats" class="flex-row chat-item" @click="$router.push(`/chat/${chat.id}`)">
            <div class="flex-col">
                <span class="chat-name">
                    {{ chat.name }}
                </span>
                {{ chat.preview }}
            </div>
            <div class="flex-row chat-right-block">
                {{ chat.lastDate }}
                <button role="button" class="delete-btn" title="Удалить диалог" @click="deleteChat(chat.id)"></button>
            </div>
        </div>
    </div>
</main>
</template>

<style scoped lang="scss">
.chat-list {
    gap: 10px;
    overflow-y: scroll;

    box-shadow: inset 0 0 20px 1px #0002;
    border-radius: 10px 0 0 10px;
}
.chat-item {
    align-items: center;
    justify-content: space-between;

    border: 2px solid var(--back-col-2);
    border-radius: 10px 0 0 10px;

    padding: 5px;
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
.delete-btn {
    background-image: url('/assets/delete.svg');
    background-size: 100% 100%;
    background-repeat: no-repeat;

    width: 40px;
    height: 40px;
}
.chat-name {
    font-weight: bold;
    font-size: 1.3rem;
}
.chat-right-block {
    gap: 15px;
    align-items: center;
}
</style>