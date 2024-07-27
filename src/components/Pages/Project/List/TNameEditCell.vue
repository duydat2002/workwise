<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import UTextarea from "@/components/UI/UTextarea.vue";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const name = ref(props.params.value);
const nameTemp = ref(props.params.value);
const placeholder = ref((props.params as any).placeholder);

const getValue = () => {
  return name.value;
};

const setName = () => {
  name.value = nameTemp.value;
  props.params.api.stopEditing();
};

const cancel = () => {
  name.value = props.params.value;
  props.params.api.stopEditing();
};
</script>

<template>
  <div class="bg-bgColor-primary">
    <UTextarea
      v-model:value="nameTemp"
      :placeholder
      :minHeight="60"
      :maxHeigth="120"
      hasButtons
      @confirm="setName"
      @cancel="cancel"
    />
  </div>
</template>
