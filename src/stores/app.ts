import { Signal } from "@/utils";
import { defineStore } from "pinia";
import { onBeforeUnmount } from "vue";

export type ServerEvent = {
    id       : string,
    type     : "message",
    senderId : string | null,
    chatId   : string,
    created  : string,
    text     : string,
} | {
    type     : "anon-chat-enter" | "anon-chat-finished",
    chatId   : string,
};


export const useAppStore = defineStore("app", {
    state: () => ({
        loading     : false,
        loggedIn    : localStorage.getItem("loggedIn") === "true",
        profileId   : localStorage.getItem("profileId"),
        eventSignal : new Signal<ServerEvent>(),
    }),
    actions: {
        setLoading(loading: boolean) {
            this.loading = loading;
        },
        setLoggedIn(status: boolean) {
            localStorage.setItem("loggedIn", status.toString());
            this.loggedIn = status;
        },
        setProfile(profileId: string | null) {
            if (profileId)
                localStorage.setItem("profileId", profileId);
            else
                localStorage.removeItem("profileId");
            this.profileId = profileId;
        },
        newEvent(event: ServerEvent) {
            this.eventSignal.emit(event);
        },
        useEvents(handler: (event: ServerEvent)=> void) {
            this.eventSignal.add(handler);
            onBeforeUnmount(() => this.eventSignal.remove(handler));
        }
    },
});