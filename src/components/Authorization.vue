<script setup lang="ts">
import { useTranslationStore } from '@stores/translation';
import { reactive, ref } from 'vue';

defineProps<{
    username_error? : string,
    password_error? : string
}>();
const emit = defineEmits<{
    (e: "login", username: string, password: string): void
    (e: "register", username: string, password: string): void
}>();

const translation = useTranslationStore();

const state = reactive({
    username: "",
    password: "",
});

const usernameElement = ref<HTMLInputElement>();
const passwordElement = ref<HTMLInputElement>();

const submit = (action: "login" | "register") => {
    let error = false;

    if (state.username.trim().length === 0 && usernameElement.value) {
        error = true;
        usernameElement.value.classList.add("errored");
        setTimeout(() => usernameElement.value?.classList.remove("errored"), 3000);
    }
    if (state.password.trim().length === 0 && passwordElement.value) {
        error = true;
        passwordElement.value.classList.add("errored");
        setTimeout(() => passwordElement.value?.classList.remove("errored"), 3000);
    }

    if (!error) emit(action as any, state.username, state.password);
}
</script>

<template>
<div class="flex-col panel-3 auth-background">
    <label for="username">{{ translation.username }}<span class="err-text" v-if="username_error">{{ username_error }}</span></label>
    <input id="username" ref="usernameElement" type="text"     v-model="state.username">
    <label for="password">{{ translation.password }}<span class="err-text" v-if="password_error">{{ password_error }}</span></label>
    <input id="password" ref="passwordElement" type="password" v-model="state.password">
    <button @click="submit('login')">{{ translation.login    }}</button>
    <button @click="submit('register')">{{ translation.register }}</button>
</div>
</template>

<style scoped lang="scss">
.err-text {
    color: var(--error-col-2);
}
.auth-background {
    padding: 30px;
    width: 40%; 
    border-radius: 10px;

    @media (max-width: 900px) {
        width: 60%;
    }
    @media (max-width: 500px) {
        width: 90%;
        padding: 20px;
    }
}
input, button {
    margin-bottom: 15px;
}
button:nth-of-type(1) {
    margin-top: 30px;
}
label {
    margin-bottom: 5px;
}
span {
    margin-left: 10px;
}
</style>