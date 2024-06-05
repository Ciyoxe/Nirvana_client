<script setup lang="ts">

import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import Head from '@components/Head.vue';
import { sendRequest  } from '@/utils';
import { useAppStore } from '@stores/app';
import { useCacheStore } from '@stores/cache';

const app    = useAppStore();
const cache  = useCacheStore();
const chatId = useRoute().params.id;


type message = {
    id      : string,
    text    : string,
    sender  : string | null,
    created : string,
};
const state = reactive({
    error      : null as string | null,
    messages   : [] as message[],
});
const sendMessage = (text: string) => {
    sendRequest("post", "/api/chat/send-message", { chatId, text }, {
        200: () => { },
        "_": () => {
            state.error = "Произошла ошибка отправки сообщения";
        }
    })
}
sendRequest("post", "/api/chat/load-messages", { chatId, count: 100, offset: 0 }, {
    200: (json) => {
        state.messages = json.messages;
        state.error = null;
    },
    "_": () => {
        state.error = "Произошла ошибка получения списка сообщений";
    }
});

app.useEvents(event => {
    if (event.type === "message" && event.chatId === chatId) {
        state.messages.push({
            id     : event.id,
            created: event.created,
            sender : event.senderId,
            text   : event.text,
        });
    }
});
</script>

<template>
<Head/>
<main class="flex-col panel-2 main-cont">
    <h1>Чат</h1>
    <div class="message-list flex-col">
        <div v-for="message in state.messages" class="message-cont" :class="app.profileId && message.sender === app.profileId ? 'self-cont' : 'chat-cont'">
            <div class="message flex-col" :class="app.profileId && message.sender === app.profileId ? 'self-msg' : 'chat-msg'">
                <a :href="message.sender === null ? undefined : `/profile/${message.sender}`">
                    {{ message.sender === null ? "Собеседник" : cache.loadProfile(message.sender).value?.name }}:
                </a>
                <span>
                    {{ message.text }}
                </span>
            </div>
        </div>
    </div>
    <div class="chat-controls flex-row">
        <input type="text" @keydown.enter="sendMessage(($event as any).target.value); ($event as any).target.value = ''"/>
    </div>
</main>
</template>

<style scoped lang="scss">
a {
    color: var(--text-col-accent)
}
.message-list {
    box-shadow: inset 0 18px 20px -20px #0003, inset 0 -18px 20px -20px #0003;
    flex: 1;
    gap: 5px;
    overflow-y: scroll;
}
.message-cont {
    display: flex;
    flex-direction: row;
}
.self-cont {
    padding-inline-end: 5px;
    flex-direction: row-reverse;
}
.chat-cont {
    flex-direction: row;
}
.message {
    padding: 10px;
    border-radius: 10px;
    background-color: var(--back-col-2);
    max-width: 80%;
}
.chat-controls {
    padding-top: 20px;
}
</style>