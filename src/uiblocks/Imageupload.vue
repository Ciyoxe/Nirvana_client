<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits<{
    (e: "urlinput", url: string): void
}>();

const state = reactive({
    status   : "Загрузите картинку или введите ссылку",
    active   : true,
    error    : false,
});

const uploadFile = (e: Event) => {
    if (!state.active)
        return;

    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) 
        return;
    
    const data = new FormData();
    data.append("file", file);

    // block new file upload when old one is uploading
    state.active = false;
    state.status = "Загрузка...";

    fetch("/api/file", {
        method: "post",
        body: data
    })
    .then(res  => {
        if (res.status === 200)
            return res.json();
        throw new Error();
    })
    .then(json => {
        state.active = true;
        state.status = "Картинка загружена - " + file.name;
        emit("urlinput", json.url)
    })
    .catch(() => {
        state.active = true;
        state.status = "Произошла ошибка при загрузке картинки";
    });
}
const inputUrl = (url: string) => {
    state.error  = false;

    if (url.trim() === "") {
        state.status = "Загрузите картинку или введите ссылку";
        state.active = true;
    }
    else {
        state.status = "Вы ввели ссылку на картинку";
        state.active = false;
        emit("urlinput", url);
    }
}
</script>

<template>
<div class="flex-row upload-container">
    <label class="upload flex-col" for="fileup">
        <div class="icon"></div>
        {{ state.status }}
        <input type="text" @input="inputUrl(($event as any).target.value)">
    </label>
    <input type="file" id="fileup" @change="uploadFile($event)" :disabled="!state.active" accept="image/*">
</div>
</template>

<style scoped lang="scss">
.upload-container {
    gap: 10px;
}
.upload {
    border: 2px solid var(--back-col-3);
    background-color: var(--back-col-2);
    border-radius: 10px;

    align-items: center;
    justify-content: center;
    padding: 10px;
    cursor: pointer;

    width: 100%;
    height: 100px;
}
.icon {
    background-image: url('/assets/upload-image.svg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    opacity: 0.5;


    height: 50px;
    width: 50px;
}
input[type="file"] {
    display: none;
}
input[type="text"] {
    border-radius: 0;
    background-color: transparent;
    border: 0;
    border-bottom: 2px solid var(--back-col-3);
    width: calc(100% - 50px);
}
</style>