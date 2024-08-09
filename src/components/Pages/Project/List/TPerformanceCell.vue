<script setup lang="ts">
import { computed, ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { IUserInfo } from "@/types";

interface IData {
  user: IUserInfo | null;
  completed: {
    total: number;
    beforeDueDate: number;
    afterDueDate: number;
  };
  inprogress: {
    total: number;
    outOfDate: number;
  };
  todo: {
    total: number;
    outOfDate: number;
  };
}

const props = defineProps<{
  params: ICellRendererParams;
}>();

const field = ref((props.params as any).field || "total");
const color = ref((props.params as any).color || "#000");
const data = computed(() => {
  return props.params.data as IData;
});

const count = computed(() => {
  switch (field.value) {
    case "completed-total":
      return data.value.completed.total;
      break;
    case "completed-beforeDueDate":
      return data.value.completed.beforeDueDate;
      break;
    case "completed-afterDueDate":
      return data.value.completed.afterDueDate;
      break;
    case "inprogress-total":
      return data.value.inprogress.total;
      break;
    case "inprogress-outOfDate":
      return data.value.inprogress.outOfDate;
      break;
    case "todo-total":
      return data.value.todo.total;
      break;
    case "todo-outOfDate":
      return data.value.todo.outOfDate;
      break;
    case "total":
    default:
      return (
        data.value.completed.total +
        data.value.inprogress.total +
        data.value.todo.total
      );
      break;
  }
});

const total = computed(() => {
  return (
    data.value.completed.total +
    data.value.inprogress.total +
    data.value.todo.total
  );
});
</script>

<template>
  <span>
    <span class="font-medium text-textColor-primary mr-1">{{ count }}</span>
    <span class="text-xs" :style="{ color: color }"
      >({{ ((count / total) * 100).toFixed(1) }})%</span
    >
  </span>
</template>
