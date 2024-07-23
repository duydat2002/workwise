<script setup lang="ts">
import DescIcon from "@icons/list.svg";
import AttachIcon from "@icons/attach.svg";
import CommentIcon from "@icons/chat.svg";
import ClockIcon from "@icons/clock-o.svg";
import CheckIcon from "@icons/check.svg";
import PriorityLowestIcon from "@icons/priority-lowest.svg";
import PriorityLowIcon from "@icons/priority-low.svg";
import PriorityMediumIcon from "@icons/priority-medium.svg";
import PriorityHighIcon from "@icons/priority-high.svg";
import { useProjectStore } from "@/stores";
import { ITask } from "@/types";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import Popper from "vue3-popper";
import Avatar from "@/components/Common/Avatar.vue";
import { computed } from "vue";
import { formatDate } from "@/helpers";

const route = useRoute();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    task: ITask;
    showTaskGroup?: boolean;
  }>(),
  {
    showTaskGroup: false,
  }
);

const { showTaskLabel } = storeToRefs(useProjectStore());

const priority = computed(() => {
  switch (props.task.priority) {
    case "high":
      return { name: "Cao", icon: PriorityHighIcon };
    case "medium":
      return { name: "Trung bình", icon: PriorityMediumIcon };
    case "low":
      return { name: "Thấp", icon: PriorityLowIcon };
    case "none":
    default:
      return { name: "Không", icon: PriorityLowestIcon };
  }
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

const outOfDate = computed(() => {
  if (props.task.dueDate) return new Date() > new Date(props.task.dueDate);
  else return false;
});

const toggleShowLabel = () => {
  showTaskLabel.value = !showTaskLabel.value;
};

const hanldeClickTask = () => {
  router.push({ query: { ...route.query, taskSelected: props.task.id } });
};
</script>

<template>
  <div
    class="relative group w-full flex flex-col rounded-md bg-bgColor-primary border border-borderColor cursor-pointer shadow-md"
    :class="task.isHidden ? 'h-0 overflow-hidden border-none ' : 'mb-2'"
    @click="hanldeClickTask"
  >
    <div class="flex flex-col px-3 py-2">
      <div class="flex items-center gap-1 mb-1">
        <template v-for="label in task.labels" :key="label.id">
          <Popper
            hover
            :disabled="showTaskLabel"
            openDelay="300"
            offsetDistance="4"
            :content="label.name"
          >
            <div
              class="min-w-10 px-1 rounded cursor-pointer text-xs text-[#44546f] transition-all duration-200"
              :style="{
                background: label.color,
                height: showTaskLabel ? '16px' : '8px',
              }"
              @click.prevent.stop="toggleShowLabel"
            >
              <span v-if="showTaskLabel" class="font-medium">
                {{ label.name }}
              </span>
            </div>
          </Popper>
        </template>
      </div>
      <span
        class="text-sm mb-1"
        :class="
          task.status == 'completed'
            ? 'line-through text-textColor-secondary'
            : 'text-textColor-primary'
        "
        >{{ task.name }}</span
      >
      <!-- <span class="text-xs font-semibold bg-hover px-1 py-[1px] rounded">
        {{ task.id }}
      </span> -->
      <div v-if="showTaskGroup" class="mb-1">
        <span class="text-xs font-semibold bg-hover px-1 py-[1px] rounded">
          {{ task.taskGroup.name }}
        </span>
      </div>
      <div v-else class="mb-1">
        <span
          class="text-xs font-semibold px-1 py-[1px] rounded"
          :class="
            task.status == 'completed'
              ? 'bg-green-200 text-green-600'
              : task.status == 'inprogress'
              ? 'bg-blue-200 text-blue-600'
              : 'bg-hover text-textColor-primary'
          "
        >
          {{
            task.status == "completed"
              ? "Đã hoàn thành"
              : task.status == "inprogress"
              ? "Đang thực hiện"
              : "Cần thực hiện"
          }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Popper
            hover
            offsetDistance="8"
            :content="outOfDate ? 'Công việc đã quá hạn' : 'Công việc còn hạn'"
          >
            <div
              v-if="dateComp"
              class="px-1 py-[2px] flex items-center rounded mr-2"
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
          <Popper hover offsetDistance="8" content="Công việc có mô tả">
            <div v-if="task.description" class="h-6 flex flex-center mr-2">
              <DescIcon class="w-3 fill-textColor-primary" />
            </div>
          </Popper>
          <Popper hover offsetDistance="8" content="Bình luận">
            <div
              v-if="task.comments.length > 0"
              class="h-6 flex flex-center mr-2"
            >
              <CommentIcon class="w-[13px] fill-textColor-primary mr-1" />
              <span class="text-xs text-textColor-secondary">{{
                task.comments.length
              }}</span>
            </div>
          </Popper>
          <Popper hover offsetDistance="8" content="Tài liệu">
            <div
              v-if="task.attachments.length > 0"
              class="h-6 flex flex-center mr-2"
            >
              <AttachIcon class="w-[13px] fill-textColor-primary" />
              <span class="text-xs text-textColor-secondary">{{
                task.attachments.length
              }}</span>
            </div>
          </Popper>
        </div>
        <div class="flex items-center">
          <div v-if="task.priority != 'none'" class="">
            <Popper
              hover
              offsetDistance="8"
              :content="`Độ ưu tiên: ${priority.name}`"
            >
              <component :is="priority.icon" class="w-4" />
            </Popper>
          </div>
          <div
            v-if="task.assignee"
            class="ml-2"
            :title="`${task.assignee.fullname} (${task.assignee.email})`"
          >
            <Avatar class="w-6" :avatarUrl="task.assignee.avatar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
