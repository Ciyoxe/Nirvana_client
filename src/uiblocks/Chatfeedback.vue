<script setup lang="ts">
import { blockAnonChat, rateAnonChat } from '@/api/chats';
import { mdiThumbUp, mdiThumbDown } from '@mdi/js';
import { useChatsStore } from '@stores/chats';
import { reactive } from 'vue';

defineEmits<{
    (e: "to-params"): void,
    (e: "next-chat"): void
}>();

const chats = useChatsStore();
const state = reactive({
    voted   : false,
    blocked : false,
});

const vote = (rate: "up" | "down")=> {
    if (chats.anonStatus !== "inChat")
        return;
    if (chats.anonChatId === null)
        return;

    state.voted = true;
    rateAnonChat({ chatId: chats.anonChatId, rate }, { });
}
const block = ()=> {
    if (chats.anonStatus !== "inChat")
        return;
    if (chats.anonChatId === null)
        return;

    state.blocked = true;
    blockAnonChat({ chatId: chats.anonChatId }, { });
}
</script>

<template>
<div class="flex-col feedback">
    Чат завершен
    <br>
    <template v-if="!state.voted">
        Оцените собеседника
        <div class="flex-row thumbs">
            <VBtn variant="tonal" @click="vote('up')" color="success" :icon="mdiThumbUp" />
            <VBtn variant="tonal" @click="vote('down')" color="error" :icon="mdiThumbDown" />
        </div>
    </template>
    <VBtn @click="$emit('next-chat')">Следующий чат</VBtn>
    <VBtn @click="$emit('to-params')">Изменить параметры</VBtn>
    <VBtn v-if="!state.blocked" @click="block()" variant="outlined" color="error">Заблокировать собеседника</VBtn>
</div>
</template>

<style scoped lang="scss">
.feedback {
    padding: 10px;
    padding-bottom: 50px;
    gap: 10px;
    text-align: center;
}
.thumbs {
    gap: 10px;
    justify-content: center;
}
</style>