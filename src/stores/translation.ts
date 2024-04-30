import { defineStore } from "pinia";

export const useTranslationStore = defineStore("translation", {
    state: () => ({
        username : "Имя пользователя",
        password : "Пароль",
        login    : "Вход в аккаунт",
        register : "Зарегистрироваться",
        logout   : "Выйти из аккаунта",
    }),
    actions: {
        setLocale(locale: string) {
            // TODO: load locale from server
        },
    },
});