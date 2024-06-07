<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useChatsStore } from '@stores/chats';
import Chatlist from '@uiblocks/Chatlist.vue';
import { loadChats } from '@/api/chats';
import { useAppStore } from '@stores/app';

const app    = useAppStore();
const chats  = useChatsStore();
const state  = reactive({
    error: false,
});

app.setLoading(true);
loadChats({ count: 100, offset: 0 }, {
    200: (data)=> {
        chats.userChats = data.chats;
        app.setLoading(false);
    },
    '_': ()=> {
        app.setLoading(false);
        state.error = true;
    }
});

watchEffect(()=> {
    const anonChat = chats.userChats.find(c => c.type === "anonymous");
    if (anonChat) {
        chats.anonChatId = anonChat.id;
        chats.anonStatus = 'inChat';
    }
    else {
        chats.anonChatId = null;
        if (chats.anonStatus === 'inChat')
            chats.anonStatus = 'inParams';
    }
});
</script>

<template>
<Chatlist/>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    Ошибка получения списка чатов. Повторите попытку позже
</VSnackbar>
</template>
