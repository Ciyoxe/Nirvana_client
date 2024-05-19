<script setup lang="ts">

import { reactive, toRef } from 'vue';
import { useRoute } from 'vue-router';

import Head from '@components/Head.vue';
import { sendRequest  } from '@/utils';
import { useAppStore } from '@stores/app';

const app    = useAppStore();
const chatId = useRoute().params.id;


type message = {
    id      : string,
    text    : string,
    sender  : string,
    created : string,
};
const state = reactive({
    namesCache : {} as { [key: string]: string | null },
    error      : null as string | null,
    messages   : [] as message[],
});
const nameOfUser = (profileId: string) => {
    if (state.namesCache[profileId] === undefined) {
        state.namesCache[profileId] = null;
        sendRequest("post", "/api/profile/get-info", { profileId }, {
            200: (json) => {
                state.namesCache[profileId] = json.name;
            },
        });
    }
    return toRef(state.namesCache, profileId);
};
const sendMessage = (text: string) => {
    sendRequest("post", "/api/chat/send-message", { chatId, text }, {
        200: (json) => {
            state.messages.push({
                id     : json.message,
                created: new Date().toISOString(),
                sender : app.profile!,
                text   : text,
            })
        },
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