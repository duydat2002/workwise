<script setup lang="ts">
import RightIcon from "@icons/right.svg";
import ClockIcon from "@icons/clock-o.svg";
import UCircular from "@/components/UI/UCircular.vue";
import Popper from "vue3-popper";
import { computed, onMounted, ref } from "vue";
import TaskHomeItem from "@/components/Pages/Task/TaskHomeItem.vue";
import { getActivities } from "@/services/project";
import { storeToRefs } from "pinia";
import { useProjectStore, useUserStore } from "@/stores";
import { IActivity, ITask } from "@/types";
import { addDays, compareAsc, isAfter, isToday, startOfDay } from "date-fns";
import { dateComparator } from "@/helpers";
import ActivityItem from "@/components/Pages/Activities/ActivityItem.vue";
import Avatar from "@/components/Common/Avatar.vue";
import ProjectItem from "@/components/Pages/Project/ProjectItem.vue";

const { user } = storeToRefs(useUserStore());
const { projects } = storeToRefs(useProjectStore());

const outOfDate = ref(false);
const activities = ref<IActivity[]>([]);

const tasks = computed(() => {
  return projects.value
    ?.filter((p) => !p.isArchived)
    .flatMap((p) => p.taskGroups)
    .flatMap((g) => g.tasks)
    .filter((t) => !t.isArchived);
});

const tasksForMe = computed(() => {
  return tasks.value.filter((t) => t.assignee?.id == user.value?.id);
});

const tasksByStatus = computed(() => {
  let todo: ITask[] = [];
  let inprogress: ITask[] = [];
  let completed: ITask[] = [];

  tasksForMe.value.forEach((t) => {
    if (t.status == "todo") todo.push(t);
    else if (t.status == "inprogress") inprogress.push(t);
    else completed.push(t);
  });

  return {
    todo,
    inprogress,
    completed,
  };
});

const compareDates = (
  dateA: string | null | undefined,
  dateB: string | null | undefined
) => {
  if (dateA === dateB) return 0;
  if (dateA === null || dateA === undefined) return 1;
  if (dateB === null || dateB === undefined) return -1;
  return new Date(dateA).getTime() - new Date(dateB).getTime();
};

const tasksIncomming = computed(() => {
  return tasksForMe.value
    .filter((t) => {
      const dueDate = t.dueDate ? new Date(t.dueDate) : null;
      return (
        !t.isArchived &&
        t.status != "completed" &&
        (dueDate == null || isAfter(dueDate, startOfDay(new Date())))
      );
    })
    .sort((a, b) => {
      const dueDateDiff = dateComparator(a.dueDate, b.dueDate);
      if (dueDateDiff !== 0) return dueDateDiff;

      const startDateDiff = dateComparator(a.startDate, b.startDate);
      if (startDateDiff !== 0) return startDateDiff;

      const priorityOrder = { high: 3, medium: 2, low: 1, none: 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
});

const tasksNearlyCompleted = computed(() => {
  return tasks.value
    .filter((t) => t.status != "completed")
    .slice(0, 5)
    .sort((a, b) => {
      return a.progress - b.progress;
    });
});

const projectDueDate = computed(() => {
  const todayStart = startOfDay(new Date());
  return projects.value
    .filter(
      (p) =>
        !p.isArchived &&
        !p.finishDate &&
        (isToday(p.dueDate) || isAfter(p.dueDate, todayStart))
    )
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
});

onMounted(async () => {
  const data = await getActivities();

  if (data.success) activities.value = data.result!.activities;
  console.log(data);
});
</script>

<template>
  <div class="relative h-full w-full">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 px-5 my-4 overflow-y-scroll scroll-vert"
    >
      <div class="pt-2 flex gap-3">
        <div class="w-3/5">
          <div class="flex flex-col mb-4">
            <span class="text-base font-semibold text-textColor-primary mb-3"
              >Tổng số công việc</span
            >
            <div class="flex gap-3">
              <div class="w-1/3 p-3 flex justify-between shadow rounded-lg">
                <div class="flex flex-col justify-between py-2">
                  <span class="text-base font-semibold text-textColor-primary"
                    >Việc cần làm</span
                  >
                  <span class="text-2xl font-semibold text-textColor-primary">{{
                    tasksByStatus.todo.length
                  }}</span>
                </div>
                <div class="w-[80px]">
                  <UCircular
                    :progress="
                      tasks.length != 0
                        ? Math.round(
                            (tasksByStatus.todo.length / tasksForMe.length) *
                              100
                          )
                        : 0
                    "
                    progress-bg="text-[#979797]"
                    ><span class="text-base font-bold text-[#979797]"
                      >{{
                        tasks.length != 0
                          ? Math.round(
                              (tasksByStatus.todo.length / tasksForMe.length) *
                                100
                            )
                          : 0
                      }}%</span
                    ></UCircular
                  >
                </div>
              </div>
              <div class="w-1/3 p-3 flex justify-between shadow rounded-lg">
                <div class="flex flex-col justify-between py-2">
                  <span class="text-base font-semibold text-textColor-primary"
                    >Đang thực hiện</span
                  >
                  <span class="text-2xl font-semibold text-textColor-primary">{{
                    tasksByStatus.inprogress.length
                  }}</span>
                </div>
                <div class="w-[80px]">
                  <UCircular
                    :progress="
                      tasks.length != 0
                        ? Math.round(
                            (tasksByStatus.inprogress.length /
                              tasksForMe.length) *
                              100
                          )
                        : 0
                    "
                    progress-bg="text-blue-500"
                    ><span class="text-base font-bold text-blue-500"
                      >{{
                        tasks.length != 0
                          ? Math.round(
                              (tasksByStatus.inprogress.length /
                                tasksForMe.length) *
                                100
                            )
                          : 0
                      }}%</span
                    ></UCircular
                  >
                </div>
              </div>
              <div class="w-1/3 p-3 flex justify-between shadow rounded-lg">
                <div class="flex flex-col justify-between py-2">
                  <span class="text-base font-semibold text-textColor-primary"
                    >Đã hoàn thành</span
                  >
                  <span class="text-2xl font-semibold text-textColor-primary">{{
                    tasksByStatus.completed.length
                  }}</span>
                </div>
                <div class="w-[80px]">
                  <UCircular
                    :progress="
                      tasks.length != 0
                        ? Math.round(
                            (tasksByStatus.completed.length /
                              tasksForMe.length) *
                              100
                          )
                        : 0
                    "
                    progress-bg="text-green-500"
                    ><span class="text-base font-bold text-green-500"
                      >{{
                        tasks.length != 0
                          ? Math.round(
                              (tasksByStatus.completed.length /
                                tasksForMe.length) *
                                100
                            )
                          : 0
                      }}%</span
                    ></UCircular
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="px-3 py-3 flex flex-col shadow rounded-lg mb-4">
            <span class="text-base font-semibold text-textColor-primary mb-2"
              >Công việc sắp hoàn thành</span
            >
            <div class="flex flex-col gap-2">
              <div class="flex text-textColor-primary font-semibold gap-2">
                <span class="flex-1">Công việc</span>
                <span class="w-[150px]">Người thực hiện</span>
                <span class="w-[180px]">Tiến độ</span>
              </div>
              <div
                v-for="task in tasksNearlyCompleted"
                :key="task.id"
                class="flex items-center gap-2"
              >
                <div class="flex-1">
                  <RouterLink
                    :to="{
                      name: 'Project',
                      params: { projectId: task.project.id ?? 2 },
                      query: { taskSelected: task.id },
                    }"
                    class="text-dots hover:text-primary"
                    >{{ task.name }}</RouterLink
                  >
                </div>
                <div class="w-[150px]">
                  <div v-if="task.assignee" class="flex items-center">
                    <Avatar
                      class="flex-shrink-0 w-6 h-6 mr-1"
                      :avatarUrl="task.assignee?.avatar"
                    />
                    <span class="">{{ task.assignee?.fullname }}</span>
                  </div>
                </div>
                <div class="w-[180px]">
                  <div class="flex items-center">
                    <div class="w-full h-2 bg-hover rounded-md overflow-hidden">
                      <div
                        class="h-full bg-primary"
                        :style="{
                          width: task.progress.toFixed(0) + '%',
                        }"
                      ></div>
                    </div>
                    <span class="ml-2 text-xs text-textColor-secondary"
                      >{{ task.progress }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-3 py-3 flex flex-col shadow rounded-lg mb-4">
            <span class="text-base font-semibold text-textColor-primary mb-2"
              >Dự án sắp tới hạn</span
            >
            <div class="flex-1 flex flex-wrap -mx-2">
              <div
                v-for="project in projectDueDate"
                :key="project.id"
                class="w-1/3 max-[1000px]:w-1/3 max-[768px]:w-1/2 max-[500px]:w-full p-2"
              >
                <ProjectItem :project />
              </div>
            </div>
          </div>
        </div>
        <div class="w-2/5">
          <div class="flex flex-col mb-3">
            <span class="text-base font-semibold text-textColor-primary mb-1"
              >Công việc sắp tới</span
            >
            <div
              class="flex flex-col py-2 gap-3 max-h-[300px] overflow-y-scroll scroll-vert none"
            >
              <TaskHomeItem
                v-for="task in tasksIncomming"
                :key="task.id"
                :task
              />
            </div>
          </div>
          <div class="px-3 py-3 flex flex-col shadow rounded-lg mt-6">
            <span
              class="text-base font-semibold text-textColor-primary px-2 mb-1"
              >Hoạt động gần đây</span
            >
            <div
              class="flex flex-col p-2 gap-3 max-h-[300px] overflow-y-scroll scroll-vert none"
            >
              <ActivityItem
                class="py-2"
                v-for="activity in activities"
                :key="activity.id"
                :activity
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
