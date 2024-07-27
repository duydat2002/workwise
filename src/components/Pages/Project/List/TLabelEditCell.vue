<script setup lang="ts">
import { ref, computed } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import LabelPopup from "@/components/Popup/LabelPopup/LabelPopup.vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const { project } = storeToRefs(useProjectStore());
const labels = ref(props.params.value);

const getValue = () => {
  return labels.value;
};

const setLabels = () => {
  props.params.api.stopEditing();
};
</script>

<template>
  <div
    v-if="project"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-center"
  >
    <LabelPopup
      class="relative"
      :labels="project!.createdTaskLabels"
      placement="top-full left-0 mt-2"
      v-model:labelSelected="labels"
      labelFor="Task"
      @close="setLabels"
    />
  </div>
</template>
