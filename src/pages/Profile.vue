<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { sendRequest } from '@/utils';
import Profilemetrics from '@uiblocks/Profilemetrics.vue';

import Head from '@components/Head.vue';

const router    = useRouter();
const profileId = useRoute().params.id;
const state     = reactive({
    info: null as null | {
        self        : boolean,
        about       : string | null,
        name        : string,
        avatar      : string | null,
        banner      : string | null,
        created     : string,
        online      : string,
        role        : "user" | "admin",
        rating      : number,
        following   : number,
        followers   : number,
        isFollowing : boolean,
        isBlocked   : boolean,
    },
});

state.info = {
    self        : false,
    name        : "NAME",
    about       : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur cursus, nisl nisl aliquet nisl, eget aliquet nisl nisl",
    avatar      : "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.PYipJ_hSncugM2SwnZitvgHaEK%26pid%3DApi&sp=1715856581T14ae9d24c0f9c9e6b620ed8897fe5f67b9d5184120308c0b4ac643085ca3c28d",
    banner      : "https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?t=st=1716015376~exp=1716015976~hmac=a68ff37e270fdd34fdd6a183221d74b0b56a12fc3603b98164208d2fca69ded4",
    created     : "2023-01-15T10:30:00.000Z",
    online      : "2024-05-16T12:00:43.766Z",
    role        : "user",
    rating      : 5,
    following   : 10,
    followers   : 15,
    isFollowing : false,
    isBlocked   : false,
}
const lastOnlineStatus = computed(() => {
    if (!state.info)
        return "В сети: неизвестно";

    const diffMinutes = (Date.now() - new Date(state.info.online).getTime()) / 1000 / 60;
    
    if (diffMinutes < 1)
        return "Онлайн";
    if (diffMinutes < 20)
        return "В сети несколько минут назад"
    if (diffMinutes < 60)
        return "В сети полчаса назад"
    if (diffMinutes < 60 * 1.5)
        return "В сети час назад" 
    if (diffMinutes < 60 * 12)
        return "В сети несколько часов назад"
        if (diffMinutes < 60 * 40)
        return "В сети вчера"
    if (diffMinutes < 60 * 24 * 5)
        return "В сети несколько дней назад"
    if (diffMinutes < 60 * 24 * 7 * 1.5)
        return "В сети неделю назад"
    if (diffMinutes < 60 * 24 * 7 * 4)
        return "В сети несколько недель назад"
    return "В сети давно"
});

const createChat = () => {
    sendRequest("post", "/api/chat/personal", { profileId }, {
        200: (json) => {
            router.push(`/chat/${json.chatId}`);
        }
    });
};

sendRequest("post", "/api/profile/get-info", { profileId }, {
    200: (json) => {
        state.info = json;
    },
});
</script>

<template>
<Head/>
<main class="flex-col panel-2 main-cont">
    <div class="banner" v-if="state.info" :style="{ backgroundImage: `url('${state.info.banner}')` }">
        <div class="avatar" :style="{ backgroundImage: `url('${state.info.avatar}')` }"></div>
    </div>
    <div class="content" v-if="state.info">
        <div class="head flex-row">
            <div class="flex-col">
                <span class="name">{{ state.info.name }}</span> <br>
                <span class="status" :style="{ color: lastOnlineStatus === 'Онлайн' ? 'var(--pos-col)' : 'var(--text-col-normal)' }">{{ lastOnlineStatus }}</span>
            </div>
            <div class="controls">
                <button @click="createChat()" v-if="!state.info.self && !state.info.isBlocked">Написать</button>
                <button v-if="!state.info.self && !state.info.isBlocked">{{ state.info.isFollowing ? 'Отписаться' : 'Подписаться' }}</button>
                <button v-if="!state.info.self">{{ state.info.isBlocked ? 'Разблокировать' : 'Заблокировать' }}</button>
                <button v-if="state.info.self">Редактировать</button>
            </div>
        </div>
        
        <div class="line"></div>
        <Profilemetrics :info="state.info"/>
        <div class="line"></div>
        Постов еще не опубликовано
    </div>
</main>
</template>

<style scoped lang="scss">
.profile-data {
    border-radius: 10px;
    flex: 1;
    margin: 10px;

    width: 80%;
    max-width: 1000px;

    @media (max-width: 900px) {
        margin: 5px;
        width: 90%;
    }
    @media (max-width: 500px) {
        margin: 5px;
        width: auto;
    }
}
.avatar {
    position: absolute;

    border-radius: 10px;
    width : 150px;
    height: 150px;

    margin: 25px;

    background-size: cover;
    background-position: center;

    @media (max-width: 900px) {
        width : 120px;
        height: 120px;

        margin: 15px;
    }
    @media (max-width: 500px) {
        width : 100px;
        height: 100px;
        
        margin: 10px;
    }
}
.banner {
    position: relative;

    border-radius: 10px 10px 0 0;
    height: 200px;

    background-size: cover;
    background-position: 50% 100%;

    @media (max-width: 900px) {
        height: 160px;
    }
    @media (max-width: 500px) {
        height: 120px;
    }
}
.head {
    justify-content: space-between;
}
.content {
    padding: 10px;
}
.name {
    font-size: 1.8rem;
    font-weight: bold;
}
.status {
    font-size: 0.8rem;
    opacity: 0.8;
}
.line {
    height: 2px;
    background: var(--back-col-3);
    margin: 20px 0;
}
.controls {
    display: flex;
    flex-direction: row;
    gap: 10px;

    @media (max-width: 900px) {
        flex-direction: column;
    }
}
.controls button {
    font-size: 0.8rem;
    min-width: 125px;
    padding: 10px;
    height: min-content;
}
</style>