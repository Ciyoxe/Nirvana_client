<script setup lang="ts">
import { loadMessages, sendMessage } from '@/api/chats';
import { useEvents } from '@/api/events';
import { Message } from '@/api/types';
import { mdiBackspace, mdiSend } from '@mdi/js';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import Messagelist from '@components/Messagelist.vue';

const route = useRoute();
const state = reactive({
    messages: [] as Message[],
    text    : "",

    error    : false,
    errorText: "",
});

const error = (text: string)=> {
    state.error     = true;
    state.errorText = text;
}
const send = ()=> {
    if (state.text.length === 0) {
        error("Сообщение не может быть пустым");
        return;
    }
    sendMessage({ chatId: route.params.id as any, text: state.text }, {
        200: ()=> clear(),
        '_': ()=> error("Произошла ошибка отправки сообщения, повторите попытку позже")
    })
}
const clear = ()=> {
    state.text = "";
}

loadMessages({ chatId: route.params.id as any, count: 100, offset: 0 }, {
    200: (data)=> {
        state.messages = data.messages;
    },
    '_': ()=> {
        error("Произошла ошибка получения списка сообщений, повторите попытку позже");
    }
});

useEvents((event)=> {
    if (event.type === "message" && event.chatId === route.params.id) {
        state.messages.push({
            id         : event.id,
            text       : event.text,
            sender     : event.senderId,
            created    : event.created,
            senderName : event.senderName,
        });
    }
});
</script>

<template>
<div class="flex-col cont">
    <Messagelist :messages="state.messages"/>
    <div class="flex-row text">
        <VTextarea no-resize label="Сообщение" density="compact" rounded="lg" v-model="state.text"></VTextarea>
        <div class="flex-col btns">
            <VBtn @click="send()" :icon="mdiSend"></VBtn>
            <VBtn @click="clear()" :icon="mdiBackspace"></VBtn>
        </div>
    </div>
</div>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.cont {
    height: 100%;
    overflow: hidden;
}
.text {
    padding-top: 10px;
}
.btns {
    gap: 5px;
    padding-left: 10px;
}
</style>