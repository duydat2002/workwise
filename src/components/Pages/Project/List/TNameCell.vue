<script setup lang="ts">
import EditIcon from "@icons/edit.svg";
import { ref, computed } from "vue";
import { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const name = ref(props.params?.value);
const hasLine = computed(() => {
  const isTaskCompleted = props.params?.data.status == "completed";
  return (props.params as any).hasLine && isTaskCompleted;
});

const openEdit = () => {
  if (props.params.api.getEditingCells().length > 0) {
    props.params.api.stopEditing();
  } else {
    props.params.api.startEditingCell({
      rowIndex: props.params.node.rowIndex!,
      colKey: props.params.column!.getColId(),
    });
  }
};
</script>

<template>
  <div class="flex items-center">
    <div class="flex-1 flex items-center">
      <span
        class="hover:text-primary cursor-pointer"
        :class="
          hasLine
            ? 'line-through text-textColor-secondary'
            : 'text-textColor-primary'
        "
        >{{ name }}</span
      >
    </div>
    <div
      class="w-6 h-6 rounded-full bg-bgColor-primary flex flex-center hover:bg-hover shadow-item cursor-pointer"
      @click="openEdit"
    >
      <EditIcon class="w-3 fill-textColor-primary" />
    </div>
  </div>
</template>
