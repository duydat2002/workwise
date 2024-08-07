<script setup lang="ts">
import ExportIcon from "@icons/export.svg";
import PerformancePage from "@/components/Pages/Statistic/PerformancePage.vue";
import ProgressPage from "@/components/Pages/Statistic/ProgressPage.vue";
import QuantityPage from "@/components/Pages/Statistic/QuantityPage.vue";
import USelect from "@/components/UI/USelect.vue";
import { useProjectStore } from "@/stores";
import { IOption } from "@/types";
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
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import Popper from "vue3-popper";

const { project, statisticTab } = storeToRefs(useProjectStore());

const rangeSelected = ref<string>("week");
const rangeOptions = ref<IOption[]>([
  { key: "week", value: "Tuần này" },
  { key: "month", value: "Tháng này" },
  { key: "year", value: "Năm này" },
  { key: "all", value: "Tất cả" },
]);

const tasks = computed(() => {
  return (
    project.value?.taskGroups
      .flatMap((g) => g.tasks)
      .filter((t) => !t.isArchived) ?? []
  );
});

const members = computed(() => {
  return project.value?.members ?? [];
});

const dates = computed(() => {
  switch (rangeSelected.value) {
    case "week":
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
      break;
    case "month":
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
      break;
    case "year":
      const yearStart = startOfYear(new Date());
      const yearEnd = endOfYear(new Date());
      return eachMonthOfInterval({ start: yearStart, end: yearEnd });
      break;
    case "all":
    default:
      const sortedDates = tasks.value
        .map((t) => t.updatedAt)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const minDate = sortedDates[0];
      const maxDate = sortedDates[sortedDates.length - 1];
      const daysDiff = differenceInDays(maxDate, minDate);

      return eachDayOfInterval({ start: minDate, end: maxDate });
      if (daysDiff <= 30) {
        return eachDayOfInterval({ start: minDate, end: maxDate });
      } else if (daysDiff <= 180) {
        return eachWeekOfInterval({ start: minDate, end: maxDate });
      } else {
        return eachMonthOfInterval({ start: minDate, end: maxDate });
      }
      break;
  }
});
</script>

<template>
  <div class="relative h-full w-full">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 px-5 my-4 overflow-y-scroll scroll-vert"
    >
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold text-textColor-primary">{{
          statisticTab == "progress"
            ? "Tiến độ dự án"
            : statisticTab == "performance"
            ? "Hiệu suất làm việc"
            : "Số lượng công việc"
        }}</span>
        <div class="flex items-center">
          <USelect
            v-model:selected="rangeSelected"
            :options="rangeOptions"
            placeholder="Chọn sắp xếp theo"
            placement="right-0 w-max min-w-full top-full pt-1"
          />
          <Popper hover content="Xuất file excel">
            <div
              class="ml-2 flex-shrink-0 w-8 h-8 rounded hover:bg-hover flex flex-center cursor-pointer"
            >
              <ExportIcon class="w-6 fill-textColor-secondary" />
            </div>
          </Popper>
        </div>
      </div>
      <div class="mt-3">
        <QuantityPage
          v-if="statisticTab == 'quantity'"
          :tasks
          :dates
          :range="rangeSelected"
        />
        <PerformancePage
          v-if="statisticTab == 'performance'"
          :tasks
          :members
          :range="rangeSelected"
        />
        <ProgressPage
          v-if="statisticTab == 'progress'"
          :tasks
          :dates
          :range="rangeSelected"
        />
      </div>
    </div>
  </div>
</template>
