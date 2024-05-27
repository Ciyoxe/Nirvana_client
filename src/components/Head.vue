<script setup lang="ts">
import { RouterLink } from 'vue-router';


</script>

<template>
<header class="panel-1 flex-row">
    <nav class="flex-row">
        <RouterLink to="/profiles">Профили</RouterLink>
        <RouterLink to="/chats">Диалоги</RouterLink>
        <RouterLink to="/anonchat">Чат</RouterLink>
        <RouterLink to="/settings">Настройки</RouterLink>
    </nav>
</header>
</template>

<style scoped lang="scss">
header {
    width: 100%;
    background-color: var(--back-col-2);
    height: 50px;
    align-items: center;
    justify-content: center;
}
nav {
    gap: 10px;
}
a {
    color: var(--text-col-accent);
}
</style>