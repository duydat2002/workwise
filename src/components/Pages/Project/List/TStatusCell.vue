<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const status = ref(props.params.value);
</script>

<template>
  <span
    class="text-sm font-semibold px-1 py-[1px] rounded"
    :class="
      status == 'completed'
        ? 'bg-green-200 text-green-600'
        : status == 'inprogress'
        ? 'bg-blue-200 text-blue-600'
        : 'bg-hover text-textColor-primary'
    "
  >
    {{
      status == "completed"
        ? "Đã hoàn thành"
        : status == "inprogress"
        ? "Đang thực hiện"
        : "Cần thực hiện"
    }}
  </span>
</template>
