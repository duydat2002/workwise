<script setup lang="ts">
import CheckIcon from "@icons/check.svg";
import ClockIcon from "@icons/clock-o.svg";
import Avatar from "@/components/Common/Avatar.vue";
import { useProjectStore } from "@/stores";
import { IProject } from "@/types";
import { storeToRefs } from "pinia";
import Popper from "vue3-popper";
import { formatDate } from "@/helpers";
import { computed, watchEffect } from "vue";
import { ref } from "vue";

const props = defineProps<{
  project: IProject;
}>();

const { showProjectLabel } = storeToRefs(useProjectStore());
const taskCount = ref(0);
const taskDoneCount = ref(0);
const process = ref(0);

const outOfDate = computed(() => {
  if (props.project.dueDate)
    return new Date() > new Date(props.project.dueDate);
  else return false;
});

const membersShow = computed(() => {
  return props.project.members.slice(0, 3);
});

watchEffect(() => {
  const tasks = props.project.taskGroups.flatMap((g) => g.tasks);
  const taskDone = tasks.filter((t) => t.status == "completed");

  taskCount.value = tasks.length;
  taskDoneCount.value = taskDone.length;

  if (taskDoneCount.value == 0) process.value = 0;
  else process.value = Math.round((taskDone.length / tasks.length) * 100);
});

const toggleShowLabel = () => {
  showProjectLabel.value = !showProjectLabel.value;
};
</script>

<template>
  <RouterLink
    :to="{ name: 'Project', params: { projectId: project.id } }"
    class="w-full px-3 py-2 bg-bgColor-primary flex flex-col justify-between rounded-lg shadow"
  >
    <img
      :src="project.background"
      :alt="project.name"
      class="h-[100px] object-cover"
    />
    <div class="mt-2 flex flex-col">
      <span class="text-base font-bold text-textColor-primary text-dots">{{
        project.name
      }}</span>
    </div>
    <div class="mt-1 flex items-center gap-1">
      <template v-for="label in project.labels" :key="label.id">
        <Popper hover offsetDistance="4" :content="label.name">
          <div
            class="min-w-10 px-1 rounded cursor-pointer text-xs text-[#44546f] transition-all duration-200"
            :style="{
              background: label.color,
              height: showProjectLabel ? '16px' : '8px',
            }"
            @click.prevent="toggleShowLabel"
          >
            <span v-if="showProjectLabel">
              {{ label.name }}
            </span>
          </div>
        </Popper>
      </template>
      <div
        v-if="project.labels.length == 0"
        class="w-10 px-1 transition-all duration-200 opacity-0 pointer-events-none"
        :style="{
          height: showProjectLabel ? '16px' : '8px',
        }"
      >
        <template v-if="showProjectLabel"> blank </template>
      </div>
    </div>
    <div class="mt-1">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-textColor-primary"
          >Tiến trình</span
        >
        <Popper
          hover
          placement="top"
          offsetDistance="4"
          :content="`${taskDoneCount}/${taskCount}`"
        >
          <span class="text-sm text-primary-light">{{ process }}%</span>
        </Popper>
      </div>
      <div class="relative w-full h-2 bg-[#c6d3ff] rounded">
        <div
          class="absolute left-0 top-0 bottom-0 bg-primary rounded"
          :style="{ width: process + '%' }"
        ></div>
        <div
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1 w-3 h-3 border-[2px] border-white rounded-full bg-primary box-content"
          :style="{ left: process + '%' }"
        ></div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <Popper
          hover
          :content="
            project.finishDate
              ? 'Công việc đã hoàn thành'
              : outOfDate
              ? 'Công việc đã quá hạn'
              : 'Công việc còn hạn'
          "
        >
          <div
            v-if="project.finishDate"
            class="px-1 py-[2px] flex items-center rounded bg-green-200 text-green-500 fill-green-500"
          >
            <CheckIcon class="w-3 mr-1" />
            <span class="text-xs">{{
              formatDate(project.finishDate, "dd/MM/yyyy")
            }}</span>
          </div>
          <div
            v-else-if="project.dueDate"
            class="px-1 py-[2px] flex items-center rounded"
            :class="
              outOfDate
                ? 'bg-red-200 text-red-500 fill-red-500'
                : 'fill-textColor-primary text-textColor-secondary'
            "
          >
            <ClockIcon class="w-3 mr-1" />
            <span class="text-xs">{{
              project.dueDate
                ? formatDate(project.dueDate, "dd/MM/yyyy")
                : "--/--/----"
            }}</span>
          </div>
        </Popper>
        <div class="flex items-center not-firstchild:-ml-[6px]">
          <div v-for="member in membersShow">
            <Avatar
              class="w-5"
              :avatarUrl="member.user.avatar"
              :title="member.user.fullname"
            />
          </div>
          <div
            v-if="project.members.length - membersShow.length > 0"
            class="w-5 h-5 flex flex-center rounded-full bg-bgColor-secondary"
          >
            <span class="text-xs text-textColor-secondary">
              +{{ project.members.length - membersShow.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
