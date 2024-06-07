<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { createChat } from '@/api/chats';
import Profilemetrics from '@components/Profilemetrics.vue';
import Ratingsm from '@components/Ratingsm.vue';
import { blockUser, getProfile, unblockUser, subscribe, unsubscribe } from '@/api/profiles';

const router    = useRouter();
const profileId = useRoute().params.id;
const state     = reactive({
    info: null as null | {
        self        : boolean,
        posts       : 0,
        about       : string | null,
        name        : string,
        avatar      : string | null,
        banner      : string | null,
        created     : Date,
        online      : Date,
        role        : "user" | "admin",
        rating      : number,
        following   : number,
        followers   : number,
        isFollowing : boolean,
        isBlocked   : boolean,
    },

    error    : false,
    errorText: "",
});

const error = (text: string)=> {
    state.error     = true;
    state.errorText = text;
}
const lastOnlineStatus = computed(() => {
    if (!state.info)
        return "В сети: неизвестно";

    const diffMinutes = (Date.now() - state.info.online.getTime()) / 1000 / 60;
    
    if (diffMinutes < 10)
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

const makeChat = () => {
    if (!profileId)
        return;

    createChat({ profileId: profileId as string }, {
        200: (data)=> router.push('/chat/' + data.chatId),
        '_': ()=> error("Ошибка создания чата, повторите попытку позже")
    });
};
const toggleBlock = () => {
    if (state.info!.isBlocked) {
        unblockUser({ profileId: profileId as string }, {
            200: ()=> state.info!.isBlocked = false,
            '_': ()=> error("Произошла ошибка, повторите попытку позже")
        });
    } 
    else{
        blockUser({ profileId: profileId as string }, {
            200: ()=> state.info!.isBlocked = true,
            '_': ()=> error("Произошла ошибка, повторите попытку позже")
        });
    }
}
const toggleFollowing = () => {
    if (state.info!.isFollowing) {
        unsubscribe({ profileId: profileId as string }, {
            200: ()=> state.info!.isFollowing = false,
            '_': ()=> error("Произошла ошибка, повторите попытку позже")
        });
    } 
    else{
        subscribe({ profileId: profileId as string }, {
            200: ()=> state.info!.isFollowing = true,
            '_': ()=> error("Произошла ошибка, повторите попытку позже")
        });
    }
}

getProfile({ profileId: profileId as string }, {
    200: (data)=> state.info = { ...data, posts: 0 },
});
</script>

<template>
<div class="banner" v-if="state.info" :style="{ backgroundImage: `url('${state.info.banner}')` }">
    <div class="avatar" :style="{ backgroundImage: `url('${state.info.avatar}')` }"></div>
</div>
<div class="content" v-if="state.info">
    <div class="head flex-row">
        <div class="flex-col">
            <span class="name">{{ state.info.name }}
                <Ratingsm :rating="state.info.rating" />
            </span>
            <br>
            <span class="status" :style="{ color: lastOnlineStatus === 'Онлайн' ? '' : '' }">{{ lastOnlineStatus }}</span>
        </div>
        <div class="controls">
            <VBtn v-if="!state.info.self && !state.info.isBlocked" @click="makeChat()">Написать</VBtn>
            <VBtn v-if="!state.info.self && !state.info.isBlocked" @click="toggleFollowing()">{{ state.info.isFollowing ? 'Отписаться' : 'Подписаться' }}</VBtn>
            <VBtn v-if="!state.info.self" @click="toggleBlock()">{{ state.info.isBlocked ? 'Разблокировать' : 'Заблокировать' }}</VBtn>
            <VBtn v-if="state.info.self">Редактировать</VBtn>
        </div>
    </div>
    
    <div class="line"></div>
    <Profilemetrics :info="state.info"/>
    <div class="line"></div>
    Постов еще не опубликовано
</div>
<VEmptyState v-if="!state.info"
    headline="Профиль не найден"
    title="Возможно он был удалён или заблокирован"
/>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>
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