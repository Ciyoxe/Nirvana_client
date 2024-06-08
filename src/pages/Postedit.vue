<script setup lang="ts">
import { publishPost } from '@/api/posts';
import { ContentText } from '@/api/types';
import Textpart from '@components/Textpart.vue';
import { mdiDelete, mdiFormatAlignCenter, mdiFormatAlignLeft, mdiFormatAlignRight, mdiFormatBold, mdiFormatItalic, mdiFormatLetterCase, mdiFormatStrikethrough, mdiFormatUnderline, mdiPlus } from '@mdi/js';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form  = ref();
const head  = ref();
const state = reactive({
    error  : false,
    errText: "",

    title  : "",
    about  : "",
    public : true,

    activePart : 0,
    parts      : [
        {
            type : "text",
            align: "left",
            color: null,
            size : 1,
            style: "normal",
            text : "",
        }
    ] as ContentText[], 
});
const validation = [
    (text: string) => text.length > 0 || "Текст не может быть пустым",
];

const error = (text: string)=> {
    state.error   = true;
    state.errText = text;
}
const addPart = ()=> {
    state.parts.push({
        type : "text",
        align: "left",
        color: null,
        size : 1,
        style: "normal",
        text : "",
    });
    state.activePart = state.parts.length - 1;
}
const delPart = ()=> {
    state.parts.splice(state.activePart, 1);
}
const publish = async ()=> {
    if (!form.value)
        return;
    if (!(await form.value.validate()).valid) {
        if (head.value)
            head.value.scrollIntoView({ behavior: "smooth" });
        return;
    }

    publishPost({
        about   : state.about,
        header  : state.title,
        public  : state.public,
        content : state.parts,
    }, {
        200: (data)=> router.push('post/' + data.postId),
        '_': ()=> error("Произошла ошибка публикации поста, повторите попытку позже"),
    });
}
</script>

<template>
<VForm ref="form">
    <VTextarea no-resize ref="head" label="Заголовок" rows="1" density="compact" :rules="validation" rounded="lg" v-model="state.title"></VTextarea>
    <VTextarea no-resize label="Описание"  rows="2" density="compact" :rules="validation" rounded="lg" v-model="state.about"></VTextarea>
    <VSwitch v-model="state.public" :color="state.public ? 'primary' : ''" label="Виден в общей ленте" />

    <h2>Текст поста:</h2>
    <div class="flex-row settings" v-if="state.parts[state.activePart] !== undefined">
        <VBtnGroup variant="outlined">
            <VBtn :icon="mdiFormatAlignLeft" 
                @click="state.parts[state.activePart].align = 'left'" 
                :variant="state.parts[state.activePart].align === 'left' ? 'tonal' : 'outlined'"
            />
            <VBtn :icon="mdiFormatAlignCenter" 
                @click="state.parts[state.activePart].align = 'center'"
                :variant="state.parts[state.activePart].align === 'center' ? 'tonal' : 'outlined'"
            />
            <VBtn :icon="mdiFormatAlignRight" 
                @click="state.parts[state.activePart].align = 'right'"
                :variant="state.parts[state.activePart].align === 'right' ? 'tonal' : 'outlined'"
            />
        </VBtnGroup>
        <VBtnGroup variant="outlined">
            <VBtn :icon="mdiFormatLetterCase" 
                @click="state.parts[state.activePart].style = 'normal'" 
                :variant="state.parts[state.activePart].style === 'normal' ? 'tonal' : 'outlined'"
            />
            <VBtn :icon="mdiFormatBold" 
                @click="state.parts[state.activePart].style = 'bold'" 
                :variant="state.parts[state.activePart].style === 'bold' ? 'tonal' : 'outlined'"
            />
            <VBtn :icon="mdiFormatItalic" 
                @click="state.parts[state.activePart].style = 'italic'" 
                :variant="state.parts[state.activePart].style === 'italic' ? 'tonal' : 'outlined'"
            />
            <VBtn :icon="mdiFormatUnderline" 
                @click="state.parts[state.activePart].style = 'underline'" 
                :variant="state.parts[state.activePart].style === 'underline' ? 'tonal' : 'outlined'"
            />
            <VBtn :icon="mdiFormatStrikethrough" 
                @click="state.parts[state.activePart].style = 'strikethrough'" 
                :variant="state.parts[state.activePart].style === 'strikethrough' ? 'tonal' : 'outlined'"
            />
        </VBtnGroup>
    </div>
    <div class="flex-row settings">
        <VBtn :append-icon="mdiPlus" @click="addPart()">Добавить текст</VBtn>
        <VBtn v-if="state.parts[state.activePart] !== undefined" :append-icon="mdiDelete" @click="delPart()">Удалить текст</VBtn>
    </div>
    <div class="flex-col list">
        <Textpart v-for="(part, i) in state.parts" editable :content="part" @click="state.activePart = i"/>
    </div>
</VForm>

<div class="flex-row settings">
    <VBtn variant="outlined" color="primary" @click="publish()">Опубликовать</VBtn>
    <VBtn variant="outlined" @click="$router.back()">Отмена</VBtn>
</div>

<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.list {
    gap: 10px;
    padding: 10px 0;
}
.settings {
    flex-wrap: wrap;
    margin-bottom: 20px;
    gap: 10px;
}
</style>