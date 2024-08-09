<script setup lang="ts">
import USelect from "@/components/UI/USelect.vue";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { computed, ref, watch } from "vue";
import { IOption, ITask } from "@/types";

const emit = defineEmits(["update:selected", "choose"]);

const props = defineProps<{
  selected: string;
  minDate?: Date | string;
  maxDate?: Date | string;
}>();

const rangeOptions = ref<IOption[]>([
  { key: "week", value: "Tuần này" },
  { key: "month", value: "Tháng này" },
  { key: "year", value: "Năm này" },
  { key: "all", value: "Tất cả" },
]);

const rangeSelectedComp = computed({
  get: () => props.selected,
  set: (value) => {
    emit("update:selected", value);
  },
});

watch(
  rangeSelectedComp,
  () => {
    let dates = [];

    switch (rangeSelectedComp.value) {
      case "week":
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        dates = eachDayOfInterval({ start: weekStart, end: weekEnd });
        break;
      case "month":
        const monthStart = startOfMonth(new Date());
        const monthEnd = endOfMonth(new Date());
        dates = eachDayOfInterval({ start: monthStart, end: monthEnd });
        break;
      case "year":
        const yearStart = startOfYear(new Date());
        const yearEnd = endOfYear(new Date());
        dates = eachDayOfInterval({ start: yearStart, end: yearEnd });
        break;
      case "all":
      default:
        if (props.minDate && props.maxDate)
          dates = eachDayOfInterval({
            start: props.minDate,
            end: props.maxDate,
          });
        else {
          const monthStart = startOfMonth(new Date());
          const monthEnd = endOfMonth(new Date());
          dates = eachDayOfInterval({ start: monthStart, end: monthEnd });
        }
        break;
    }

    emit("choose", dates);
  },
  { immediate: true }
);
</script>

<template>
  <USelect
    v-model:selected="rangeSelectedComp"
    :options="rangeOptions"
    placement="right-0 w-max min-w-full top-full pt-1"
  />
</template>
