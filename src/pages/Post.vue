<script setup lang="ts">
import { Post } from '@/api/types';
import { deletePost, getPost, ratePost  } from '@/api/posts';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfilesStore } from '@stores/profiles';
import { mdiDelete } from '@mdi/js';
import Textpart from '@components/Textpart.vue';
import Ratingsm from '@components/Ratingsm.vue';

const router   = useRouter();
const profiles = useProfilesStore();
const postId   = useRoute().params.id as string;
const state    = reactive({
    post     : null as Post | null,
    deletion : false,
    error    : false,
    errText  : "",
});

const error = (text: string)=> {
    state.error   = true;
    state.errText = text;
}
const confirmDeletion = ()=> {
    deletePost({ postId }, {
        200: ()=> router.back(),
        '_': ()=> error("Не удалось удалить пост"),
    });
}
const rate = (rating: "up" | "down")=> {
    ratePost({ postId, rating }, { });
}
getPost({ postId }, {
    200: (post) => state.post = post
});
</script>

<template>
<template v-if="state.post">
    <div class="flex-row" style="gap: 30px;">
        <div class="flex-col">
            <VListItemSubtitle>
                <div class="flex-row cont">
                    <RouterLink :to="'/profile/' + state.post.author">
                        {{ state.post.authorName }}
                    </RouterLink>
                    {{ state.post.created.toLocaleString() }}
                </div>
            </VListItemSubtitle>
            <h2>{{ state.post.header }}</h2>
        </div>
        <VBtn v-if="state.post.author === profiles.currentProfileId" 
            color="error" variant="outlined" 
            @click="state.deletion = true"
            :icon="mdiDelete"
        />
        <Ratingsm 
            :rating="state.post.rating" 
            :editable="state.post.author !== profiles.currentProfileId"
            @vote-up="rate('up')"
            @vote-down="rate('down')"
        />
    </div>
    <Textpart v-for="content of state.post.content.filter(x => x.type === 'text')" :content="content as any"/>
</template>
<VEmptyState v-else
    headline="Пост не найден"
    title="Возможно он был удалён"
/>
<VDialog v-model="state.deletion" max-width="1000px">
    <VCard>
        <VCardTitle>Подтвердите удаление</VCardTitle>
        <VCardText>Вы уверены, что хотите удалить запись? Это действие нельзя будет отменить.</VCardText>
        <VCardActions>
            <VBtn color="primary" @click="state.deletion = false">Отмена</VBtn>
            <VBtn color="error"   @click="confirmDeletion()">Удалить</VBtn>
        </VCardActions>
    </VCard>
</VDialog>
</template>

<style scoped lang="scss">
h2 {
    margin-bottom: 10px;
}
.cont {
    gap: 10px;
}
</style>