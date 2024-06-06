<script setup lang="ts">
import { login, register, userExists } from '@/api/auth';
import { useAppStore } from '@stores/app';
import { reactive, ref } from 'vue';

const app   = useAppStore();
const props = defineProps<{
    type: "login" | "register"
}>();

const state = reactive({
    username : "",
    password : "",
    code     : "", // not used for now

    error    : false,
    errorText: "",
});

const usernameValidation = [
    (v: string)=> v.trim().length === 0 ? "Логин не может быть пустым" : true,
    (v: string)=> v.length > 256 ? "Превышена длина текста" : true,
];
const passwordValidation = [
    (v: string)=> v.length === 0 ? "Пароль не может быть пустым" : true,
    (v: string)=> v.length > 2048 ? "Превышена длина пароля" : true,
    (v: string)=> v.length < 5 ? "Пароль слишком короткий" : true,
];

const error = (text: string)=> {
    state.error = true;
    state.errorText = text;
}
const form = ref();

const submit = async ()=> {
    if (!form.value)
        return;
    if (!(await form.value.validate()).valid)
        return;

    const data = {
        username: state.username,
        password: state.password,
        code    : state.code,
    };

    app.setLoading(true);
    if (props.type === "register") {
        let canRegister = false;
        await userExists(data, {
            200: (exists) => {
                if (exists)
                    error("Такой пользователь уже существует");
                else
                    canRegister = true;
            },
            '_': () => error("Произошла ошибка, повторите попытку позже")
        });
        if (canRegister) {
            await register(data, {
                '_': () => error("Произошла ошибка регистрации, повторите попытку позже")
            });
        }
    }
    // type == login
    else {
        await login(data, {
            '_': () => error("Произошла ошибка входа, повторите попытку позже")
        });
    }
    app.setLoading(false);
}

</script>

<template>
<div class="flex-col auth-back">
    <VCardTitle>{{ type === 'login' ? 'Вход в аккаунт' : 'Регистрация' }}</VCardTitle>
    <VForm ref="form" style="margin-top: 30px;">
        <VTextField :rules="usernameValidation" v-model="state.username" label="Логин"/>
        <VTextField :rules="passwordValidation" v-model="state.password" label="Пароль" type="password"/>
        <VTextField v-if="type === 'register'" v-model="state.code" label="Код регистрации"/>
    </VForm>
    <VBtn @click="submit()">{{ type === 'login' ? 'Войти' : 'Зарегистрироваться' }}</VBtn>
    <RouterLink v-if="type==='register'" to="/auth/login">Уже регистрировались? Войдите в аккаунт</RouterLink>
    <RouterLink v-else to="/auth/signup">Нет аккаунта? Зарегистируйтесь</RouterLink>
</div>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.auth-back {
    width : 100%;
    height: 100%;
    justify-content: center;
    padding: 0 10px;

    @media (max-width: 500px) {
        padding: 0;
    }
}
a {
    margin-top: 20px;
}
</style>