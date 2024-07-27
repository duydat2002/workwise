<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const status = ref(props.params.value);

const getValue = () => {
  return status.value;
};

const setStatus = (statusSelected: "todo" | "inprogress" | "completed") => {
  console.log(statusSelected);
  status.value = statusSelected;
  props.params.api.stopEditing();
};
</script>

<template>
  <div class="flex flex-col w-[150px] bg-bgColor-primary rounded">
    <div
      class="px-3 py-2 cursor-pointer hover:bg-primary-extraLight"
      @click="setStatus('todo')"
    >
      <span
        class="text-sm font-semibold px-1 py-[1px] bg-bgColor-secondary text-textColor-primary rounded"
        >Cần thực hiện</span
      >
    </div>
    <div
      class="px-3 py-2 cursor-pointer hover:bg-primary-extraLight"
      @click="setStatus('inprogress')"
    >
      <span
        class="text-sm font-semibold px-1 py-[1px] bg-blue-200 text-blue-600 rounded"
        >Đang thực hiện</span
      >
    </div>
    <div
      class="px-3 py-2 cursor-pointer hover:bg-primary-extraLight"
      @click="setStatus('completed')"
    >
      <span
        class="text-sm font-semibold px-1 py-[1px] bg-green-200 text-green-600 rounded"
        >Đã hoàn thành</span
      >
    </div>
  </div>
</template>
