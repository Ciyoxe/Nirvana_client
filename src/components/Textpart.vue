<script setup lang="ts">
import { ContentText } from '@/api/types';
import { computed } from 'vue';

const emit  = defineEmits<{
    (e: "update", text: string): void
    (e: "click"): void
}>();
const props = defineProps<{
    content   : ContentText,
    editable? : boolean
}>();

const style = computed(() => ({
    fontSize       : props.content.size + "rem",
    color          : props.content.color ?? "inherit",
    textAlign      : props.content.align,
    fontWeight     : props.content.style === "bold" ? "bold" : "normal",
    fontStyle      : props.content.style === "italic" ? "italic" : "normal",
    textDecoration : props.content.style === "strikethrough" ? "line-through"  : 
                     props.content.style === "underline" ? "underline" : "none",
}));
const extractContent = (ev: Event)=> {
    if (!props.editable)
        return;

    const target  = ev.target as HTMLSpanElement;
    const content = [...target.childNodes]
        .map(node => node ? (node.nodeType === Node.TEXT_NODE ? node.textContent : '\n') : '')
        .join('');
    emit("update", content);
};
</script>

<template>
<VSheet class="text-block" rounded="lg" :color="editable ? 'surface-light' : 'transparent'" :elevation="editable ? 3 : 0"
    @click="emit('click')"
>
    <span :style="style" :contenteditable="editable"
        @input="extractContent($event)"
    >
        <template v-if="!editable" v-for="line of content.text.split('\n')">
            {{ line }}<br>
        </template>
    </span>
</VSheet>
</template>

<style scoped lang="scss">
span {
    padding       : 2px 5px;
    overflow-wrap : break-word;
    text-wrap     : balance;
    width         : 100%;
    height        : 100%;
    display       : block;
    border-radius : 10px;
}
</style>