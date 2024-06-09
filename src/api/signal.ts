
export class Signal<T = void> {
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