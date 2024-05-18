import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
    state: () => ({
        loading  : false,
        loggedIn : localStorage.getItem("loggedIn") === "true",
    }),
    actions: {
        setLoading(loading: boolean) {
            this.loading = loading;
        },
        setLoggedIn(status: boolean) {
            this.loggedIn = status;
            localStorage.setItem("loggedIn", status.toString());
        },
    },
});