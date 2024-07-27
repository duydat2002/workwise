<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { ILabel } from "@/types";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const labels = ref<ILabel[]>(props.params.value);
</script>

<template>
  <div class="flex items-center h-full">
    <div class="flex items-center flex-wrap gap-1">
      <span
        v-for="label in labels"
        :key="label.id"
        class="text-sm font-semibold px-1 py-[1px] text-[#44546f] rounded cursor-pointer"
        :style="{ background: label.color }"
        >{{ label.name }}</span
      >
    </div>
  </div>
</template>
