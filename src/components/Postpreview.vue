<script setup lang="ts">
import { deletePost, ratePost } from '@/api/posts';
import { PostPreview } from '@/api/types';
import { useProfilesStore } from '@stores/profiles';
import { reactive } from 'vue';
import Ratingsm from './Ratingsm.vue';

const profiles = useProfilesStore();

const emit = defineEmits<{
    (e: "delete", postId: string): void
}>();
const props = defineProps<{
    post: PostPreview
}>();

const state = reactive({
    error     : false,
    errorText : "",
    deletion  : false,
});

const error = (text: string)=> {
    state.error     = true;
    state.errorText = text;
}
const rate = (rating: "up" | "down")=> {
    ratePost({ postId: props.post.id, rating }, { });
}
const confirmDeletion = ()=> {
    deletePost({ postId: props.post.id }, {
        200: ()=> emit("delete", props.post.id),
        '_': ()=> error("Не удалось удалить пост"),
    });
}

</script>

<template>
<VListItem elevation="2" rounded="lg" style="padding: 10px;">
    <VListItemSubtitle>
        <div class="flex-row cont" style="margin-bottom: 10px;">
            <RouterLink :to="'/profile/' + post.author">
                {{ post.authorName }}
            </RouterLink>
            {{ post.created.toLocaleString() }}
        </div>
    </VListItemSubtitle>
    <div style="margin-bottom: 10px;">
        <h3 @click="$router.push(`/post/${post.id}`)">{{ post.header }}</h3>
        <template v-if="post.about" v-for="line of post.about.split('\n')">
            {{ line }}<br>
        </template>
    </div>
    <div class="flex-row cont" @click.stop>
        <Ratingsm 
            :editable="profiles.currentProfileId !== post.author" 
            :rating="post.rating"
            @vote-up="rate('up')"
            @vote-down="rate('down')"
        />
        <VBtn v-if="profiles.currentProfileId === post.author" 
            class="del-btn" color="error" variant="outlined" 
            @click="state.deletion = true"
        >
            Удалить
        </VBtn>
    </div>
</VListItem>

<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">
    {{ state.errorText }}
</VSnackbar>

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
h3 {
    text-decoration: underline;
    cursor: pointer;
}
.cont {
    gap: 10px;
}
.del-btn {
    height: 32px;
}
</style>