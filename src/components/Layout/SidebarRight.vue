<script setup lang="ts">
import XIcon from "@icons/x.svg";

const emit = defineEmits(["close"]);

defineProps<{
  title: string;
}>();

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <div
    class="flex-shrink-0 w-[350px] h-full flex flex-col shadow border-l border-borderColor"
  >
    <div class="relative flex flex-center py-3 border-b border-borderColor">
      <span class="text-base font-semibold text-textColor-primary">{{
        title
      }}</span>
      <div
        class="absolute w-8 h-8 top-1/2 right-2 -translate-y-1/2 flex flex-center group cursor-pointer"
        @click="handleClose"
      >
        <XIcon class="w-3 fill-textColor-primary group-hover:fill-error" />
      </div>
    </div>
    <div class="flex flex-col">
      <slot />
    </div>
  </div>
</template>
