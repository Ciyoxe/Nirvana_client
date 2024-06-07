import { onBeforeUnmount } from "vue";


export function useInterval(time: number, fn: ()=> void) {
    const interval = setInterval(fn, time);
    onBeforeUnmount(() => clearInterval(interval));
}