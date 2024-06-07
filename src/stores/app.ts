import { defineStore } from "pinia";



export const useAppStore = defineStore("app", {
    state: () => ({
        loading     : false,
        loggedIn    : localStorage.getItem("loggedIn") === "true",
    }),
    actions: {
        setLoading(loading: boolean) {
            this.loading = loading;
        },
        setLoggedIn(status: boolean) {
            localStorage.setItem("loggedIn", status.toString());
            this.loggedIn = status;
        },
    },
});