<script setup lang="ts">
import Postpreview from '@components/Postpreview.vue';
import { loadPosts } from '@/api/posts';
import { PostPreview } from '@/api/types';
import { reactive, watch } from 'vue';
import { mdiPlus } from '@mdi/js';


const state = reactive({
    feed : "public" as "public" | "personal",
    posts: [] as PostPreview[],
    error: false,
});

watch(()=> state.feed, ()=> {
    loadPosts({ count: 100, offset: 0, feed: state.feed, minRating: -10, maxRating: 10 }, {
        200: (data)=> state.posts = data.posts,
        '_': ()=> state.error = true,
    });
}, 
{ immediate: true });

</script>

<template>
<div class="flex-col list">
    <VTabs density="compact">
        <VTab @click="state.feed = 'public'">Все</VTab>
        <VTab @click="state.feed = 'personal'">Личные</VTab>
        <VTab @click="$router.push('/editor')" :append-icon="mdiPlus">Написать</VTab>
    </VTabs>
    <div class="flex-col items">
        <Postpreview v-for="(post, i) of state.posts" :key="post.id" :post="post" @delete="state.posts.splice(i, 1)"/>
    </div>
</div>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    Не удалось загрузить посты
</VSnackbar>
</template>

<style scoped lang="scss">
.list {
    gap: 10px;
    height: 100%;
}
.items {
    flex: 1;
    overflow: scroll
}
</style>