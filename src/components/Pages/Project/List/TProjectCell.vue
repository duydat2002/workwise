<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { IProject } from "@/types";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const projectRef = ref<IProject>(props.params.value);
</script>

<template>
  <div class="w-full h-full flex items-center">
    <div
      class="w-8 h-6 bg-cover bg-center aspect-video flex-shrink-0 mr-2"
      :style="{
        backgroundImage: `url(${projectRef.background})`,
      }"
    ></div>
    <span class="text-sm font-semibold text-textColor-primary text-dots mr-2">{{
      projectRef.name
    }}</span>
  </div>
</template>
