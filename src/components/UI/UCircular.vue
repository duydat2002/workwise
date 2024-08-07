<script setup lang="ts">
import { useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    progress: number;
    size?: number;
    stroke?: number | string;
    strokeBg?: string;
    progressBg?: string;
    textClass?: string;
  }>(),
  {
    stroke: 2,
    strokeBg: "text-gray-200",
    progressBg: "text-blue-600",
    textClass: "text-2xl text-blue-600",
  }
);

const slots = useSlots();
</script>

<template>
  <div class="relative size-full">
    <svg
      class="size-full -rotate-90"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        class="stroke-current"
        :class="[strokeBg]"
        :stroke-width="stroke"
      ></circle>
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        class="stroke-current"
        :class="[progressBg]"
        :stroke-width="stroke"
        stroke-dasharray="100"
        :stroke-dashoffset="100 - progress"
        stroke-linecap="round"
      ></circle>
    </svg>

    <div
      class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2"
    >
      <span
        v-if="!slots.default"
        class="text-center font-bold"
        :class="[textClass]"
        >{{ progress }}%</span
      >
      <slot v-else />
    </div>
  </div>
</template>
