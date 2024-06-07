<script setup lang="ts">
import { mdiPlus, mdiMinus } from '@mdi/js';
import { reactive } from 'vue';

defineProps<{
    rating   : number,
    editable?: boolean,
}>();


const emit = defineEmits<{
    (e: "vote-up"): void
    (e: "vote-down"): void
}>();
const state = reactive({
    voted: false,
});
const vote = (dir: "up" | "down")=> {
    state.voted = true;
    if (dir === "up")
        emit("vote-up");
    else
        emit("vote-down");
}
</script>

<template>
<div class="flex-row rating">
    <VChip tile
        variant="outlined"
        :color="rating < 0 ? 'error' : 'success'"
    >
        {{ Math.round(rating) < 0 ? "-" : (Math.round(rating) === 0 ? "" : "+") }}
        {{ Math.round(Math.abs(rating)) }}
    </VChip>
    
    <VBtn small tile v-if="editable" :icon="mdiPlus"  color="success" class="btn" @click="vote('up')" />
    <VBtn small tile v-if="editable" :icon="mdiMinus" color="error"   class="btn" @click="vote('down')" />
</div>
<VSnackbar v-model="state.voted" color="success" timeout="3000" rounded="lg">
    Вы успешно проголосовали
</VSnackbar>
</template>

<style scoped lang="scss">
.rating {
    display: inline-flex;
}
.btn {
    width : 42px;
    height: 32px;
}
</style>