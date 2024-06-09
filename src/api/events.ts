import { onMounted, onUnmounted } from "vue";
import { Signal } from "./signal";

type ServerEvent = {
    id         : string,
    type       : "message",
    senderId   : string | null,
    senderName : string,
    chatId     : string,
    created    : Date,
    text       : string,
} | {
    type       : "anon-chat-enter" | "anon-chat-finished",
    chatId     : string,
};

export const onNewEvent   = new Signal<ServerEvent>();
export const onDisconnect = new Signal();
export const onConnect    = new Signal();

export function useEvents(hanlder: (event: ServerEvent)=> void) {
    onMounted(()=> onNewEvent.on(hanlder));
    onUnmounted(()=> onNewEvent.off(hanlder));
}

const evSrc = new EventSource("/api/event");

evSrc.onerror = () => {
    onDisconnect.emit();
}
evSrc.onopen = () => {
    onConnect.emit();
}
evSrc.onmessage = (event) => {
    const eventData = JSON.parse(event.data);
    // map date from str
    if (eventData.type === "message") {
        eventData.created = new Date(eventData.created);
    }
    onNewEvent.emit(eventData);
}
window.addEventListener("beforeunload", () => {
    evSrc.close();   
})