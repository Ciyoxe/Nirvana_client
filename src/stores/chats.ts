import { ChatPreview, AnonSettings } from "@/api/types";
import { defineStore } from "pinia";

export const useChatsStore = defineStore("chats", {
    state: () => ({
        anonChatId  : null as string | null,
        anonParams  : null as AnonSettings | null,
        anonStatus  : "inParams" as "inQueue" | "inChat" | "inParams",
        userChats   : [] as ChatPreview[],
    }),
    actions: {
        deleteChat(id: string) {
            this.userChats = this.userChats.filter(chat => chat.id !== id);
        }
    },
});