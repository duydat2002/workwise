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

const priority = ref<"none" | "low" | "medium" | "high">(props.params.value);
const priorities = shallowRef([
  { key: "high", name: "Cao", icon: PriorityHighIcon },
  { key: "medium", name: "Trung bình", icon: PriorityMediumIcon },
  { key: "low", name: "Thấp", icon: PriorityLowIcon },
  { key: "none", name: "Không", icon: PriorityLowestIcon },
]);

const prioritySelected = computed(() => {
  return (
    priorities.value.find((p) => p.key == priority.value ?? "none") ||
    priorities.value[0]
  );
});
</script>

<template>
  <div class="flex items-center cursor-pointer">
    <component :is="prioritySelected.icon" class="w-4 mr-2" />
    <span class="text-textColor-primary">{{ prioritySelected.name }}</span>
  </div>
</template>
