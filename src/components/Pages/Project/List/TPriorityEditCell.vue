<script setup lang="ts">
import PriorityLowestIcon from "@icons/priority-lowest.svg";
import PriorityLowIcon from "@icons/priority-low.svg";
import PriorityMediumIcon from "@icons/priority-medium.svg";
import PriorityHighIcon from "@icons/priority-high.svg";
import { ref, computed, shallowRef } from "vue";
import { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const priority = ref(props.params.value);
const priorities = shallowRef([
  { key: "high", name: "Cao", icon: PriorityHighIcon },
  { key: "medium", name: "Trung bình", icon: PriorityMediumIcon },
  { key: "low", name: "Thấp", icon: PriorityLowIcon },
  { key: "none", name: "Không", icon: PriorityLowestIcon },
]);

const getValue = () => {
  return priority.value;
};

const setPriority = (prioritySelected: string) => {
  priority.value = prioritySelected;
  props.params.api.stopEditing();
};
</script>

<template>
  <div class="flex flex-col w-[150px] bg-bgColor-primary rounded">
    <div
      v-for="priority in priorities"
      :key="priority.key"
      class="flex items-center px-3 py-2 rounded hover:bg-hover active:bg-hover cursor-pointer"
      @click="setPriority(priority.key)"
    >
      <component :is="priority.icon" class="w-4 mr-2" />
      <span class="text-textColor-primary">{{ priority.name }}</span>
    </div>
  </div>
</template>
