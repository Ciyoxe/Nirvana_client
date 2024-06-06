import { ChatPreview } from "@/api/types";
import { defineStore } from "pinia";

export const useChatsStore = defineStore("chats", {
    state: () => ({
        inAnonChat: false as false | string,
        userChats : [] as ChatPreview[],
    }),
    actions: {
        enterAnonChat(chatId: string) {
            this.inAnonChat = chatId;
        },
        exitAnonChat() {
            this.inAnonChat = false;
        },
        deleteChat(id: string) {
            this.userChats = this.userChats.filter(chat => chat.id !== id);
        }
    },
});