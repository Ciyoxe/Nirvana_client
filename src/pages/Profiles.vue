<script setup lang="ts">
import { getProfilesList } from '@/api/profiles';
import Profilescontrol from '@components/Profilescontrol.vue';
import { useProfilesStore } from '@stores/profiles';
import { reactive } from 'vue';

const profiles = useProfilesStore();
const state    = reactive({
    error: false,
});

getProfilesList({
    200: (data)=> {
        profiles.userProfiles = data.profiles;
    },
    '_': ()=> {
        state.error = true;
    }
});
</script>

<template>
<Profilescontrol/>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">"Произошла ошибка получения списка профилей, повторите попытку позже"</VSnackbar>
</template>

<style scoped lang="scss">

</style>