import { onBeforeUnmount } from "vue";

type ResponseHandler =  { [key: number | string]: (json: any)=> void };

export async function sendRequest(method: string, url: string, data: object, handler: ResponseHandler) {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: method === "get" ? undefined : JSON.stringify(data)
    });

    let json = {};
    try {
        json = await res.json();
    } 
    catch (_) {};

    if (handler[res.status])
        handler[res.status](json ?? {});
    else if (handler["_"])
        handler["_"](json ?? {});
}

export function useInterval(time: number, fn: ()=> void) {
    const interval = setInterval(fn, time);
    onBeforeUnmount(() => clearInterval(interval));
}

export function useSignal<T = void>(signal: Signal<T>, handler: (data: T)=> void) {
    signal.add(handler);
    onBeforeUnmount(() => signal.remove(handler));
}

export class Signal<T = void> {
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