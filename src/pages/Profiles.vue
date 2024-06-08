<script setup lang="ts">
import { getProfilesList } from '@/api/profiles';
import Profilescontrol from '@components/Profilescontrol.vue';
import { useAppStore } from '@stores/app';
import { useProfilesStore } from '@stores/profiles';
import { reactive } from 'vue';

const app      = useAppStore();
const profiles = useProfilesStore();
const state    = reactive({
    error: false,
});

app.setLoading(true);
getProfilesList({
    200: (data)=> {
        profiles.userProfiles = data.profiles;
        app.setLoading(false);
    },
    '_': ()=> {
        app.setLoading(false);
        state.error = true;
    }
});
</script>

<template>
<Profilescontrol/>
<VSnackbar v-model="state.error" color="error" timeout="3000" rounded="lg">"Произошла ошибка получения списка профилей, повторите попытку позже"</VSnackbar>
</template>
