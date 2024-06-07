<script setup lang="ts">

</script>

<template>
<VAppBar title="Nirvana" floating>
    <VTabs show-arrows center-active v-model="$route.name">
        <VTab @click="$router.push('/profiles')" value="profiles">Профили</VTab>
        <VTab @click="$router.push('/posts')"    value="posts"   >Посты</VTab>
        <VTab @click="$router.push('/chats')"    value="chats"   >Диалоги</VTab>
        <VTab @click="$router.push('/anonchat')" value="anonchat">Чат</VTab>
        <VTab @click="$router.push('/settings')" value="settings">Настройки</VTab>
    </VTabs>
</VAppBar>
</template>

<style scoped lang="scss">
.header {
    display: block;
    position: static;
}
</style>