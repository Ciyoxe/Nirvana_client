<script setup lang="ts">
import { computed, reactive } from 'vue';
import { sendRequest } from "@/utils";
import Profilemetrics from "@/uiblocks/Profilemetrics.vue";
import { useRoute, useRouter } from 'vue-router';

const router    = useRouter();
const profileId = useRoute().params.id;
const props = defineProps<{
    info: {
        self        : boolean,
        name        : string,
        about       : string | null,
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
    }
}>();
const state = reactive({
    lastOnline: new Date(props.info.online),
});
const lastOnlineStatus = computed(() => {
    const diffMinutes = (Date.now() - state.lastOnline.getTime()) / 1000 / 60;
    
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
</script>

<template>
<div class="profile-data panel-2 flex-col">
    <div class="banner" :style="{ backgroundImage: `url('${info.banner}')` }">
        <div class="avatar" :style="{ backgroundImage: `url('${info.avatar}')` }"></div>
    </div>
    <div class="content">
        <div class="head flex-row">
            <div class="flex-col">
                <span class="name">{{ info.name }}</span> <br>
                <span class="status" :style="{ color: lastOnlineStatus === 'Онлайн' ? 'var(--pos-col)' : 'var(--text-col-normal)' }">{{ lastOnlineStatus }}</span>
            </div>
            <div class="controls">
                <button @click="createChat()" v-if="!info.self && !info.isBlocked">Написать</button>
                <button v-if="!info.self && !info.isBlocked">{{ info.isFollowing ? 'Отписаться' : 'Подписаться' }}</button>
                <button v-if="!info.self">{{ info.isBlocked ? 'Разблокировать' : 'Заблокировать' }}</button>
                <button v-if="info.self">Редактировать</button>
            </div>
        </div>
        
        <div class="line"></div>
        <Profilemetrics :info="info"/>
        <div class="line"></div>
        Постов еще не опубликовано
    </div>
</div>
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