import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
    state: () => ({
        loading       : false,
        authStatus    : localStorage.getItem("authStatus") === "true",
    }),
    actions: {
        setLoading(loading: boolean) {
            this.loading = loading;
        },
        setAuthStatus(status: boolean) {
            this.authStatus = status;
            localStorage.setItem("authStatus", status.toString());
        },
    },
});