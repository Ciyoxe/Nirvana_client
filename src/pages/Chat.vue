<script setup lang="ts">

import { reactive, toRef } from 'vue';
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
const nameOfUser = (profileId: string | null) => {
    if (profileId === null) 
        return toRef("Cобеседник");
    return toRef(() => {
        const profile = cache.loadProfile(profileId);
        return profile.value === null ? null : profile.value.name;
    });
};
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
        state.messages = [];
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
<main class="flex-col">
    <h1>Чат</h1>
    <div class="chat-list">
        <div v-for="message in state.messages">
            {{ nameOfUser(message.sender) }}
            {{ message.text }}
        </div>
        <input type="text" @keydown.enter="sendMessage(($event as any).target.value); ($event as any).target.value = ''"/>
    </div>
</main>
</template>

<style scoped lang="scss">

</style>