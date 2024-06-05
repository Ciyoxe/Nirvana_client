type ServerEvent = {
    id       : string,
    type     : "message",
    senderId : string | null,
    chatId   : string,
    text     : string,
} | {
    type     : "anon-chat-enter" | "anon-chat-finished",
    chatId   : string,
};

class Signal<T = void> {
    private handlers = new Set<(data: T) => void>();
    private onces    = new Array<(data: T) => void>();

    add(handler: (data: T)=> void) {
        this.handlers.add(handler);
    }
    remove(handler: (data: T)=> void) {
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

const evSrc = new EventSource("/api/event");

evSrc.onerror = () => {
    onDisconnect.emit();
}
evSrc.onopen = () => {
    onConnect.emit();
}
evSrc.onmessage = (event) => {
    onNewEvent.emit(JSON.parse(event.data));
}
window.addEventListener("beforeunload", () => {
    evSrc.close();   
})