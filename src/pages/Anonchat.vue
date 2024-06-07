<script setup lang="ts">
import { enterAnonQueue, leaveAnonChat, leaveAnonQueue, loadMessages, sendMessage } from '@/api/chats';
import { Message } from '@/api/types';
import { useChatsStore } from '@stores/chats';
import { onMounted, reactive } from 'vue';
import Anonsettings from '@/uiblocks/Anonsettings.vue';
import { useEvents } from '@/api/events';
import Messagelist from '@uiblocks/Messagelist.vue';
import { mdiSend, mdiBackspace } from '@mdi/js';
import Chatfeedback from '@/uiblocks/Chatfeedback.vue';

const chats = useChatsStore();
const state = reactive({
    messages     : [] as Message[],
    chatFinished : false,
    messageText  : "",

    error        : false,
    errorText    : "",
});

const error = (text: string)=> {
    state.error     = true;
    state.errorText = text;
}
const enterQueue = ()=> {
    if (chats.anonParams === null)
        return;
    chats.anonStatus = "inQueue"
    enterAnonQueue(chats.anonParams, {
        '_': ()=> {
            error("Произошла ошибка входа в очередь, повторите попытку позже");
            chats.anonStatus = "inParams";
        }
    });
}
const exitQueue = ()=> {
    leaveAnonQueue({
        '_': ()=> error("Произошла ошибка сервера")
    });
    chats.anonStatus = "inParams";
}
const exitChat = ()=> {
    if (chats.anonStatus !== "inChat")
        return;
    if (chats.anonChatId === null)
        return;
    
    leaveAnonChat({ chatId: chats.anonChatId }, {
        200: ()=> state.chatFinished = true,
        '_': ()=> error("Произошла ошибка, повторите попытку позже")
    });
}
const goParams = ()=> {
    chats.anonStatus = "inParams";
}
const send = ()=> {
    if (chats.anonStatus !== "inChat")
        return;
    if (chats.anonChatId === null)
        return;
    
    sendMessage({ chatId: chats.anonChatId, text: state.messageText }, {
        200: ()=> state.messageText = "",
        '_': ()=> error("Произошла ошибка, повторите попытку позже")
    });
}

useEvents((event)=> {
    if (event.type == 'anon-chat-enter') {
        chats.anonChatId   = event.chatId;
        chats.anonStatus   = "inChat";
        state.chatFinished = false;
        state.messages     = [];
    }
    if (event.type == 'anon-chat-finished' && event.chatId === chats.anonChatId) {
        state.chatFinished = true;
        // not setting chats.anonStatus cause feedback will be displayed
    }
    if (event.type == 'message' && event.chatId === chats.anonChatId) {
        state.messages.push({
            id         : event.id,
            text       : event.text,
            sender     : event.senderId,
            created    : event.created,
            senderName : event.senderName,
        });
    }
});
// load messages if we are returning in old one chat
onMounted(()=> {
    if (chats.anonStatus !== "inChat" || chats.anonChatId === null)
        return;
    loadMessages({ chatId: chats.anonChatId as any, count: 100, offset: 0 }, {
        200: (data)=> state.messages = data.messages,
        '_': ()=> error("Произошла ошибка загрузки сообщений, повторите попытку позже")
    });
});
</script>

<template>
<Anonsettings v-if="chats.anonStatus === 'inParams'" @start="enterQueue()"/>

<VEmptyState v-if="chats.anonStatus === 'inQueue'" headline="Поиск собеседника ...">
    <VBtn @click="exitQueue()">Отмена</VBtn>
</VEmptyState>

<div class="flex-col anonchat-cont" v-if="chats.anonStatus === 'inChat'">
    <div class="flex-row anonchat-header elevation-5" v-if="!state.chatFinished">
        Чат найден! Общайтесь
        <VBtn @click="exitChat()" color="error">Завершить</VBtn>
    </div>
    <Messagelist :messages="state.messages"/>

    <div class="flex-row text" v-if="!state.chatFinished">
        <VTextarea no-resize label="Сообщение" density="compact" rounded="lg" v-model="state.messageText"></VTextarea>
        <div class="flex-col btns">
            <VBtn @click="send()" :icon="mdiSend"></VBtn>
            <VBtn @click="state.messageText = ''" :icon="mdiBackspace"></VBtn>
        </div>
    </div>
    <Chatfeedback @next-chat="enterQueue()" @to-params="goParams()" v-else/>
</div>


<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.anonchat-header {
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}
.anonchat-cont {
    height: 100%;
}
.text {
    padding-top: 10px;
}
.btns {
    gap: 5px;
    padding-left: 10px;
}
</style>