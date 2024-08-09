<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const progress = ref(props.params.value);
</script>

<template>
  <div class="flex flex-col">
    <span class="text-xs text-textColor-secondary">{{ progress }}%</span>
    <div class="w-full h-2 bg-hover rounded-md overflow-hidden">
      <div
        class="h-full bg-primary"
        :style="{
          width: progress.toFixed(0) + '%',
        }"
      ></div>
    </div>
  </div>
</template>
