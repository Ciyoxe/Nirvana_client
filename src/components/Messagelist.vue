<script setup lang="ts">
import { Message } from '@/api/types';
import { useProfilesStore } from '@stores/profiles';
import { onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const profiles = useProfilesStore();
const router   = useRouter();
const list     = ref();

defineProps<{
    messages: Message[]
}>();

const goToProfile = (senderId: string | null)=> {
    if (senderId === null)
        return;
    router.push(`/profile/${senderId}`);
}
const scrollToLast = ()=> {
    if (!list.value)
        return;
    const el = list.value.querySelector(".msg:last-child");
    if (el)
        el.scrollIntoView({ behavior: "smooth", block: "end" });
}
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList") {
            scrollToLast();
        }
    }
});
watch(() => list.value, () => observer.observe(list.value, { childList: true }));
onUnmounted(()=> observer.disconnect());
</script>

<template>
<div class="list" ref="list">
    <div class="flex-row msg" v-for="message in messages" :key="message.id"
        :class="message.sender && message.sender === profiles.currentProfileId ? 'msg-own' : 'msg-user'"
    >
        <VSheet class="msg-block" rounded="lg" color="primary" elevation="5">
            <h3 @click="goToProfile(message.sender)">{{ message.senderName }}</h3>
            {{ message.text }}
        </VSheet>
    </div>
</div>
</template>

<style scoped lang="scss">
.msg {
    margin-bottom: 10px;
}
h3 {
    cursor: pointer;
}
.msg-user {
    justify-content: flex-start;
}
.msg-own {
    justify-content: flex-end;
    h3 {
        text-align: end;
    }
}
.msg-block {
    padding: 10px;
    max-width: calc(100% - 40px);
}
.list {
    height: 100%;
    width : 100%;
    overflow-y: scroll;
}
</style>