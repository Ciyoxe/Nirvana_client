<script setup lang="ts">
import Authorization from '@components/Authorization.vue';
</script>

<template>
<Authorization :type="$route.name === 'login' ? 'login' : 'register'"/>
</template>