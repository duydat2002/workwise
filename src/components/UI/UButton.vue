<script setup lang="ts">
import LoadingIcon from "@icons/loading.svg";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "text" | "contained" | "outlined" | "link";
    variantType?:
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "white"
      | "none";
    size?: "small" | "medium" | "large" | "none";
    isLoading?: boolean;
    isDisabled?: boolean;
    loadingClass?: string;
  }>(),
  {
    variant: "contained",
    variantType: "none",
    size: "medium",
    isLoading: false,
    isDisabled: false,
  }
);

const sizeClass = computed(() => {
  switch (props.size) {
    case "small":
      return "text-xs py-1 px-3 rounded-md";
    case "medium":
      return "text-sm py-[6px] px-4 rounded-lg";
    case "large":
      return "text-base leading-5 py-2 px-5 rounded-lg";
    case "none":
      return "";
    default:
      return "";
  }
});

const variantTypeClass = computed(() => {
  switch (props.variantType) {
    case "primary":
      return "bg-primary text-white";
    case "secondary":
      return "bg-bgColor-secondary text-textColor-primary";
    case "success":
      return "bg-[#22c55e] text-white";
    case "error":
      return "bg-[#ef4444] text-white border-[#ef4444]";
    case "white":
      return "bg-white text-textColor-primary";
    case "none":
      return "";
    default:
      return "";
  }
});

const variantClass = computed(() => {
  switch (props.variant) {
    case "contained":
      return "";
    case "outlined":
      return "bg-transparent text-current border-solid border border-borderColor";
    case "text":
      return "bg-transparent";
    case "link":
      return "text-link underline bg-transparent";
    default:
      return "";
  }
});
</script>

<template>
  <button
    :class="[
      'relative group disabled:opacity-60 disabled:pointer-events-none overflow-hidden ',
      sizeClass,
      variantTypeClass,
      variantClass,
    ]"
    :disabled="isDisabled || isLoading"
  >
    <div
      class="absolute top-0 left-0 right-0 bottom-0 bg-[#383838] opacity-0 group-hover:opacity-5 group-active:opacity-5 pointer-events-none"
    ></div>
    <div v-if="isLoading" class="absolute-center">
      <LoadingIcon :class="['animate-spin fill-current w-4', loadingClass]" />
    </div>

    <div :class="['flex flex-center', { 'opacity-0': isLoading }]">
      <slot />
    </div>
  </button>
</template>
