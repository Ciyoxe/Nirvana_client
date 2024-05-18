<script setup lang="ts">

</script>

<template>
<header class="panel-1 flex-row">
    <nav class="flex-row">
        <div @click="$router.push('/profiles')">
            Профили
        </div>
        <div @click="$router.push('/chats')">
            Диалоги
        </div>
        <div @click="$router.push('/anon-chat')">
            Чат
        </div>
        <div @click="$router.push('/settings')">
            Настройки
        </div>
    </nav>
</header>
</template>

<style scoped lang="scss">
header {
    background-color: var(--back-col-2);
    height: 50px;
    align-items: center;
    justify-content: center;
}
nav {
    gap: 10px;
}
</style>