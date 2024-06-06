<script setup lang="ts">
import { mdiPlus, mdiImage, mdiPageLayoutHeader } from "@mdi/js";
import { reactive, ref, watchEffect } from "vue";

import { useProfilesStore } from "@stores/profiles";
import { createProfile } from "@/api/profiles";
import { useAppStore } from "@stores/app";
import { uploadFile } from "@/api/files";

import { VBtn } from "vuetify/components";
import Profilelist from "@/uiblocks/Profilelist.vue";


const profiles = useProfilesStore();
const app      = useAppStore();

const form     = ref();
const state    = reactive({
    createDialog : false,
    name         : "",
    avatar       : "",
    banner       : "",
    about        : "",

    errorDialog  : false,
    errorText    : "",
});


const nameValidation = [
    (name: string)=> name.trim().length === 0 ? "Поле не может быть пустым" : true,
    (name: string)=> name.length > 64 ? "Слишком длинное имя" : true,
];
const lengthValidation = [
    (image: string)=> image.length > 4096 ? "Недопустимая длина текста" : true,
];

const submitCreation = async ()=> {
    if (!form.value)
        return;
    if (!(await form.value.validate()).valid)
        return;

    const data = {
        name  : state.name,
        about : state.about,
        avatar: state.avatar,
        banner: state.banner,
    };
    createProfile(data, {
        200: (profile) => {
            profiles.appendProfile({
                ...data,
                _id    : profile.profileId,
                active : profiles.currentProfileId === null,
                rating : 0,
            });
            if (profiles.currentProfileId === null) {
                profiles.setCurrentProfile(profile.profileId);
            }
        },
        '_': () => {
            error("Произошла ошибка создания профиля, повторите попытку позже");
        }
    })
}
const error = (text: string)=> {
    state.errorDialog = true;
    state.errorText   = text;
}
const selectProfile = (profileId: string)=> {
    profiles.userProfiles.forEach(profile => profile.active = profile._id === profileId);
    profiles.setCurrentProfile(profileId);
}
const deleteProfile = (profileId: string, activeId: string | null)=> {
    profiles.userProfiles = profiles.userProfiles.filter(profile => profile._id !== profileId);
    profiles.userProfiles.forEach(profile => profile.active = profile._id === activeId);
    profiles.setCurrentProfile(activeId);
}


const avatarUpload = ref();
const bannerUpload = ref();

watchEffect(()=> {
    if (avatarUpload.value) {
        avatarUpload.value.onchange = (e: Event)=> {
            const target = e.target as HTMLInputElement;
            const file   = target?.files?.[0];
            
            if (!file)
                return;

            app.setLoading(true);

            uploadFile(file, {
                200: (data) => {
                    app.setLoading(false);
                    state.avatar = data.url;
                },
                '_': () => {
                    app.setLoading(false);
                    error("Произошла ошибка загрузки картинки, повторите попытку позже");
                }
            });
        };
    }
});

watchEffect(()=> {
    if (bannerUpload.value) {
        bannerUpload.value.onchange = (e: Event)=> {
            const target = e.target as HTMLInputElement;
            const file   = target?.files?.[0];
            
            if (!file)
                return;

            app.setLoading(true);
            uploadFile(file, {
                200: (data) => {
                    app.setLoading(false);
                    state.banner = data.url;
                },
                '_': () => {
                    app.setLoading(false);
                    error("Произошла ошибка загрузки картинки, повторите попытку позже");
                }
            });
        };
    }
});
</script>

<template>
<VSheet class="profiles flex-col" width="100%" height="100%" rounded="lg" elevation="5">
    <div class="flex-col cont" v-if="profiles.userProfiles.length > 0">
        <h2>Ваши профили:</h2>
        <div style="flex: 1">
            <Profilelist v-model="profiles.userProfiles" @deleted="deleteProfile" @selected="selectProfile"/>
        </div>
        <VBtn :append-icon="mdiPlus" @click="state.createDialog=true">Создать</VBtn>
    </div>
    <VEmptyState v-else
        headline = "Похоже, здесь пусто"
        title = "Давайте создадим новый профиль"
    >
        <VBtn :append-icon="mdiPlus" @click="state.createDialog=true">Создать</VBtn>
    </VEmptyState>
</VSheet>
<VDialog v-model="state.createDialog" max-width="1000px">
    <input type="file" ref="avatarUpload" style="display: none">
    <input type="file" ref="bannerUpload" style="display: none">
    <VCard>
        <VCardTitle>Создание профиля</VCardTitle>
        <VCardText>
            <VForm ref="form">
                <VTextField :rules="nameValidation"   v-model="state.name"   label="Имя"/>
                <div class="flex-row" style="align-items: flex-start">
                    <VTextField :rules="lengthValidation" v-model="state.avatar" label="Аватар (введите ссылку)" title="Ссылка на изображение"/>
                    <VBtn :append-icon="mdiImage" class="upload-btn" @click="avatarUpload?.click()">Загрузить</VBtn>
                </div>
                <div class="flex-row" style="align-items: flex-start">
                    <VTextField :rules="lengthValidation" v-model="state.banner" label="Баннер (введите ссылку)" title="Ссылка на изображение"/>
                    <VBtn :append-icon="mdiPageLayoutHeader" class="upload-btn" @click="bannerUpload?.click()">Загрузить</VBtn>
                </div>
                <VTextarea :rules="lengthValidation" v-model="state.about" label="О себе (необязательно)"/>
            </VForm>
        </VCardText>
        <VCardActions>
            <VBtn color="primary" @click="state.createDialog = false">Отмена</VBtn>
            <VBtn color="primary" @click="submitCreation()" type="submit">Создать</VBtn>
        </VCardActions>
    </VCard>
</VDialog>
<VSnackbar v-model="state.errorDialog" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
</template>

<style scoped lang="scss">
.profiles {
    padding: 10px;
}
.cont {
    height: 100%;
}
.upload-btn {
    margin-left: 10px;
    height: 56px;
}
</style>