import { onMounted, onUnmounted } from "vue";

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

class Signal<T = void> {
    private handlers = new Set<(data: T) => void>();
    private onces    = new Array<(data: T) => void>();

    on(handler: (data: T)=> void) {
        this.handlers.add(handler);
    }
    off(handler: (data: T)=> void) {
        this.handlers.delete(handler);
    }
    once(handler: (data: T)=> void) {
        this.onces.push(handler);
    }
    emit(data: T) {
        for (const handler of this.handlers)
            handler(data);
        for (const handler of this.onces)
            handler(data);

        this.onces.length = 0;
    } 
}

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