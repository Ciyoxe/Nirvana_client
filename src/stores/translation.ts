import { defineStore } from "pinia";

export const useTranslationStore = defineStore("translation", {
    state: () => ({
        username : "Имя пользователя",
        password : "Пароль",
        login    : "Вход в аккаунт",
        register : "Зарегистрироваться",
        logout   : "Выйти из аккаунта",

        error     : "Произошла ошибка, повторите попытку позже.",
        loading   : "Загрузка...",
        regSuccess: "Вы успешно зарегистрировались!",
        logSuccess: "Вы вошли в аккаунт!",
        authError : "Неверное имя пользователя или пароль.",
        error429  : "Слишком много попыток входа. Повторите попытку позже.",
        userExists: "Пользователь с таким именем уже существует.",
    }),
    actions: {
        setLocale(_locale: string) {
            // TODO: load locale from server
        },
    },
});