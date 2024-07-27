<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores";
import VueDatePicker, { type DatePickerInstance } from "@vuepic/vue-datepicker";

const { theme } = storeToRefs(useThemeStore());

const props = defineProps<{
  params: ICellRendererParams;
}>();

const datepicker = ref<DatePickerInstance>();
const date = ref(props.params.value);

const getValue = () => {
  return date.value;
};

const onClose = () => {
  props.params.api.stopEditing();
};

onMounted(() => {
  nextTick(() => {
    datepicker.value?.openMenu();
  });
});
</script>

<template>
  <div class="w-[150px]">
    <VueDatePicker
      ref="datepicker"
      v-model="date"
      auto-apply
      :enable-time-picker="false"
      placeholder="mm/dd/yyyy"
      format="dd/MM/yyyy"
      :dark="theme == 'dark'"
      teleport-center
      @closed="onClose"
    ></VueDatePicker>
  </div>
</template>
