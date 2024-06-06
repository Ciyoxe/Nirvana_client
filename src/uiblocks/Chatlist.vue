<script setup lang="ts">
import { reactive } from 'vue';
import { mdiDelete } from '@mdi/js';
import { useRouter } from 'vue-router';
import { deleteChat } from '@/api/chats';
import { useChatsStore } from '@stores/chats';

const chats  = useChatsStore();
const router = useRouter();
const state  = reactive({
    chatToDelete: "",
    dialogShown : false,

    errorText   : "",
    error       : false,
});

const enterChat = (chatId: string)=> {
    router.push(`/chat/${chatId}`);
};
const confirmDeletion = ()=> {
    const deletedId = state.chatToDelete;
    
    state.chatToDelete = "";
    state.dialogShown  = false;
    
    if (deletedId === "") 
        return;
    deleteChat({ chatId: deletedId }, {
        200: ()=> {
            chats.deleteChat(deletedId);
        },
        '_': ()=> {
            error("Произошла ошибка удаления чата, повторите попытку позже");
        }
    });
};
const tryDeleteChat = (chatId: string)=> {
    state.chatToDelete = chatId;
    state.dialogShown  = true;
}
const error = (text: string)=> {
    state.error     = true;
    state.errorText = text;
}
</script>

<template>
<h2>Ваши чаты:</h2>
<VList lines="one" width="100%" height="100%" class="list flex-col">
    <VListItem v-for="chat of chats.userChats" :key="chat.id" rounded="lg">
        <div class="flex-row" @click="enterChat(chat.id)">
            <div class="flex-row content">
                <VListItemTitle class="title">
                    {{ chat.name }}
                    <VListItemSubtitle>{{ chat.preview }}</VListItemSubtitle>
                </VListItemTitle>
                <VBtn :icon="mdiDelete" @click.stop="tryDeleteChat(chat.id)"></VBtn>
            </div>
        </div>
    </VListItem>
</VList>
<VDialog v-model="state.dialogShown" max-width="1000px">
    <VCard>
        <VCardTitle>Подтвердите удаление</VCardTitle>
        <VCardText>Вы уверены, что хотите удалить чат? Это действие нельзя будет отменить.</VCardText>
        <VCardActions>
            <VBtn color="primary" @click="state.dialogShown = false">Отмена</VBtn>
            <VBtn color="error"   @click="confirmDeletion()">Удалить</VBtn>
        </VCardActions>
    </VCard>
</VDialog>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.list {
    display: flex;
    gap: 10px;
}
.title {
    max-width: 50%;
}
.content {
    flex: 1;
    align-items: center;
    justify-content: space-between;
    height: 64px;
}
</style>