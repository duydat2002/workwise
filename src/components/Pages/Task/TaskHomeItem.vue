<script setup lang="ts">
import RightIcon from "@icons/right.svg";
import ClockIcon from "@icons/clock-o.svg";
import UCircular from "@/components/UI/UCircular.vue";
import Popper from "vue3-popper";
import { computed, ref } from "vue";
import { ITask } from "@/types";
import { endOfDay, isAfter } from "date-fns";
import { formatDate } from "@/helpers";

const props = defineProps<{
  task: ITask;
}>();

const outOfDate = computed(() => {
  const endToday = endOfDay(new Date());

  if (props.task.dueDate) return isAfter(props.task.dueDate, endToday);
  else return false;
});

const dateComp = computed(() => {
  const startDate = props.task.startDate;
  const dueDate = props.task.dueDate;
  if (startDate && dueDate) {
    return `${formatDate(startDate, "dd/MM")} - ${formatDate(
      dueDate,
      "dd/MM"
    )}`;
  } else if (dueDate) {
    return `${formatDate(dueDate, "dd/MM")}`;
  } else if (startDate) {
    return `Bắt đầu: ${formatDate(startDate, "dd/MM")}`;
  } else {
    return null;
  }
});
</script>

<template>
  <div
    class="flex px-3 py-2 items-center justify-between bg-bgColor-primary rounded shadow-item cursor-pointer"
  >
    <div class="flex flex-col">
      <span class="font-medium text-textColor-primary">{{ task.name }}</span>
      <div class="flex items-center">
        <Popper
          hover
          offsetDistance="8"
          :content="outOfDate ? 'Công việc đã quá hạn' : 'Công việc còn hạn'"
        >
          <div
            v-if="dateComp"
            class="px-1 py-[2px] flex items-center rounded"
            :class="
              outOfDate
                ? 'bg-red-200 text-red-500 fill-red-500'
                : 'fill-textColor-primary text-textColor-secondary'
            "
          >
            <ClockIcon class="w-3 mr-1" />
            <span class="text-xs">{{ dateComp }}</span>
          </div>
        </Popper>
      </div>
    </div>
    <RightIcon class="w-4" />
  </div>
</template>
