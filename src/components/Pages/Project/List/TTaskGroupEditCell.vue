<script setup lang="ts">
import { computed, ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { ITaskGroup } from "@/types";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const { project } = storeToRefs(useProjectStore());
const taskgroup = ref<ITaskGroup>(props.params.data.taskGroup);

const taskGroups = computed(() => {
  return project.value?.taskGroups;
});

const getValue = () => {
  return taskgroup.value;
};

const setTaskGroup = (taskGroupSelected: ITaskGroup) => {
  taskgroup.value = taskGroupSelected;
  props.params.api.stopEditing();
};
</script>

<template>
  <div class="flex flex-col min-w-[150px] bg-bgColor-primary rounded">
    <div
      v-for="item in taskGroups"
      :key="item.id"
      class="px-3 py-2 cursor-pointer hover:bg-primary-extraLight"
      @click="setTaskGroup(item)"
    >
      <span class="text-sm font-semibold text-textColor-primary rounded">{{
        item.name
      }}</span>
    </div>
  </div>
</template>
