<script setup lang="ts">
import { reactive  } from "vue";
import { useRouter } from "vue-router";

import Authorization from "@components/Authorization.vue";

import { useTranslationStore } from "@stores/translation";
import { useAppStore         } from "@stores/app";
import { sendRequest         } from "@/utils";

const app         = useAppStore();
const router      = useRouter();
const translation = useTranslationStore();

const state = reactive({
    usernameError : undefined as string | undefined,
    passwordError : undefined as string | undefined,
    authError     : undefined as string | undefined,
});

const signup = async (username: string, password: string) => {
    app.setLoading(true);

    let usernameValid = false;

    await sendRequest("post", "/api/auth/username-exists", {
        username,
    }, {
        200: (json) => {
            if (json.exists)
                state.usernameError = translation.userExists;
            else
                usernameValid = true;
        },
        "_": () => {
            state.authError = translation.error;
        },
    });

    if (!usernameValid) {
        app.setLoading(false);
        return;
    }

    await sendRequest("post", "/api/auth/signup", {
        username,
        password
    }, {
        200: () => {
            app.setLoggedIn(true);
            router.push("/"); // TODO: Go to self profile or profile list
        },
        429: () => {
            state.authError = translation.error429;
        },
        "_": () => {
            state.authError = translation.error;
        },
    });

    app.setLoading(false);
}
const login = async (username: string, password: string) => {
    app.setLoading(true);

    await sendRequest("post", "/api/auth/login", {
        username,
        password
    }, {
        200: () => {
            app.setLoggedIn(true);
            router.push("/"); // TODO: Go to self profile or profile list
        },
        401: () => {
            state.authError = translation.authError;
        },
        429: () => {
            state.authError = translation.error429;
        },
        "_": () => {
            state.authError = translation.error;
        },
    });

    app.setLoading(false);
}
</script>

<template>
<div class="flex-col background">
    <Authorization 
        :username-error="state.usernameError" :password-error="state.passwordError" :auth-error="state.authError"
        @login="login" @register="signup"
    />
</div>
</template>

<style scoped>
.background {
    align-items: center;
    justify-content: center;

    width : 100dvw;
    height: 100dvh;
}
</style>