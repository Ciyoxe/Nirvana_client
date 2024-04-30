import { defineStore } from "pinia";

export const useTranslationStore = defineStore("translation", {
    state: () => ({
        username : "Имя пользователя",
        password : "Пароль",
        login    : "Вход",
        register : "Регистрация",
        logout   : "Выход",
    }),
    actions: {
        setLocale(locale: string) {
            // TODO: load locale from server
        },
    },
});