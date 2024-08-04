<script setup lang="ts">
import CheckIcon from "@icons/check.svg";
import EditIcon from "@icons/edit.svg";
import PlusIcon from "@icons/plus.svg";
import ClockIcon from "@icons/clock-o.svg";
import LoadingIcon from "@icons/loading.svg";

import { ref, computed, watch, nextTick, onBeforeMount } from "vue";
import { toast } from "vue3-toastify";
import { useActivityStore, useProjectStore, useUserStore } from "@/stores";
import { orderBy, unionBy } from "lodash";
import { getProjectActivities } from "@/services/project";
import { storeToRefs } from "pinia";
import ActivityItem from "@/components/Pages/Activities/ActivityItem.vue";
import { onMounted } from "vue";
import StatusChart from "@/components/Pages/Statistic/StatusChart.vue";
import PriorityChart from "@/components/Pages/Statistic/PriorityChart.vue";
import Avatar from "@/components/Common/Avatar.vue";
import {
  addDays,
  differenceInMinutes,
  endOfDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";
import { IUserInfo } from "@/types";

interface ChartItem {
  label: string;
  count: number;
  color: string;
  textColor?: string;
}

const clickStatusItem = (index: number) => {
  selectedStatus.value = statusChartItems.value[index];
};

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());
const { projectActivities } = storeToRefs(useActivityStore());

const PAGESIZE = 30;
const page = ref(1);
const outOfActivities = ref(false);
const isLoadingActivities = ref(true);

const sevenDaysAgo = startOfDay(subDays(new Date(), 7));
const sevenDaysAfter = endOfDay(addDays(new Date(), 7));

const tasks = computed(() => {
  return (
    project.value?.taskGroups
      .flatMap((g) => g.tasks)
      .filter((t) => !t.isArchived) ?? []
  );
});

const statusChartItems = computed(() => {
  return [
    {
      label: "Cần thực hiện",
      count: tasks.value.filter((t) => t.status === "todo").length,
      color: "#E0E0E0",
      textColor: "#9597a5",
    },
    {
      label: "Đang thực hiện",
      count: tasks.value.filter((t) => t.status === "inprogress").length,
      color: "#546fff",
    },
    {
      label: "Đã hoàn thành",
      count: tasks.value.filter((t) => t.status === "completed").length,
      color: "#22c55e",
    },
  ];
});

const selectedStatus = ref<ChartItem>(statusChartItems.value[0]);
const totalCount = computed(() =>
  statusChartItems.value.reduce((sum, item) => sum + item.count, 0)
);

const priorityData = computed(() => {
  const priorities = {
    high: 0,
    medium: 0,
    low: 0,
    none: 0,
  };

  tasks.value.forEach((t) => {
    if (t.priority == "high") {
      priorities.high++;
    } else if (t.priority == "medium") {
      priorities.medium++;
    } else if (t.priority == "low") {
      priorities.low++;
    } else {
      priorities.none++;
    }
  });

  return [priorities.high, priorities.medium, priorities.low, priorities.none];
});

const tasksByAssignee = computed(() => {
  const assigneeCounts = tasks.value.reduce((acc, task) => {
    const assigneeId = task.assignee ? task.assignee.id : "unassigned";
    if (!acc[assigneeId]) {
      acc[assigneeId] = { user: task.assignee ?? null, count: 0 };
    }
    acc[assigneeId].count++;
    return acc;
  }, {} as Record<string, { user: IUserInfo | null; count: number }>);

  const totalTasks = tasks.value.length;
  return Object.entries(assigneeCounts).map(([id, data]) => ({
    id,
    user: data.user,
    count: data.count,
    percentage:
      data.count == 0 ? 0 : ((data.count / totalTasks) * 100).toFixed(0),
  }));
});

const completedTasksLastWeek = computed(() => {
  return tasks.value.filter(
    (t) =>
      t.status == "completed" &&
      isWithinInterval(t.finishDate, {
        start: sevenDaysAgo,
        end: endOfDay(new Date()),
      })
  ).length;
});

const updatedTasksLastWeek = computed(() => {
  return tasks.value.filter(
    (t) =>
      differenceInMinutes(t.createdAt, t.updatedAt) != 0 &&
      isWithinInterval(t.updatedAt, {
        start: sevenDaysAgo,
        end: endOfDay(new Date()),
      })
  ).length;
});

const createdTasksLastWeek = computed(() => {
  return tasks.value.filter((t) =>
    isWithinInterval(t.createdAt, {
      start: sevenDaysAgo,
      end: endOfDay(new Date()),
    })
  ).length;
});

const upcomingDeadlineTasks = computed(() => {
  return tasks.value.filter(
    (t) =>
      t.status !== "completed" &&
      isWithinInterval(t.dueDate, {
        start: startOfDay(new Date()),
        end: sevenDaysAfter,
      })
  ).length;
});

const fetchActivities = async () => {
  if (!outOfActivities.value) {
    isLoadingActivities.value = true;

    const data = await getProjectActivities(
      project.value!.id,
      page.value,
      PAGESIZE
    );
    if (data.success) {
      let activities = data.result!.activities;

      activities = unionBy(activities, projectActivities.value, "id");
      activities = orderBy(activities, ["createdAt"], ["desc"]);

      projectActivities.value = activities;

      page.value += 1;
      if (activities.length < PAGESIZE) {
        outOfActivities.value = true;
      }
    } else {
      toast.error("Không thể tải dữ liệu lịch sử hoạt đông! Hãy thử lại sau.");
    }

    isLoadingActivities.value = false;
  }
};

onMounted(async () => {
  await fetchActivities();
});
</script>

<template>
  <div class="relative h-full w-full">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 px-5 my-4 overflow-y-scroll scroll-vert"
    >
      <span
        class="pb-4 pt-2 text-center w-full inline-block font-semibold text-textColor-primary text-2xl"
        >Xin chào {{ user?.fullname }}</span
      >
      <div class="flex gap-4 mb-4">
        <div class="w-1/4 group p-5 flex shadow rounded-lg">
          <div
            class="w-10 h-10 mr-2 flex flex-center bg-bgColor-secondary rounded-full"
          >
            <CheckIcon
              class="w-4 fill-green-500 group-hover:w-5 transition-all"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-green-500"
              >{{ completedTasksLastWeek }} đã hoàn thành</span
            >
            <span class="text-sm font-semibold text-textColor-secondary"
              >trong 7 ngày qua</span
            >
          </div>
        </div>
        <div class="w-1/4 group p-5 flex shadow rounded-lg">
          <div
            class="w-10 h-10 mr-2 flex flex-center bg-bgColor-secondary rounded-full"
          >
            <EditIcon class="w-4 fill-primary group-hover:w-5 transition-all" />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-primary"
              >{{ updatedTasksLastWeek }} đã cập nhật</span
            >
            <span class="text-sm font-semibold text-textColor-secondary"
              >trong 7 ngày qua</span
            >
          </div>
        </div>
        <div class="w-1/4 group p-5 flex shadow rounded-lg">
          <div
            class="w-10 h-10 mr-2 flex flex-center bg-bgColor-secondary rounded-full"
          >
            <PlusIcon
              class="w-4 fill-orange-500 group-hover:w-5 transition-all"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-orange-500"
              >{{ createdTasksLastWeek }} đã tạo</span
            >
            <span class="text-sm font-semibold text-textColor-secondary"
              >trong 7 ngày qua</span
            >
          </div>
        </div>
        <div class="w-1/4 group p-5 flex shadow rounded-lg">
          <div
            class="w-10 h-10 mr-2 flex flex-center bg-bgColor-secondary rounded-full"
          >
            <ClockIcon
              class="w-4 fill-red-500 group-hover:w-5 transition-all"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-red-500"
              >{{ upcomingDeadlineTasks }} sắp tới hạn</span
            >
            <span class="text-sm font-semibold text-textColor-secondary"
              >trong 7 ngày tới</span
            >
          </div>
        </div>
      </div>
      <div class="flex gap-4 mb-4">
        <div class="w-1/2 group p-5 flex flex-col shadow rounded-lg">
          <span class="mb-1 text-base font-semibold text-textColor-primary"
            >Tổng quan về trạng thái</span
          >
          <span class="mb-2 text-textColor-secondary"
            >Xem nhanh qua các trạng thái của các công việc.</span
          >
          <div class="flex gap-2 items-center">
            <div v-if="true" class="w-full min-h-[200px] flex flex-center">
              <span class="text-textColor-secondary"
                >Chưa có công việc nào.</span
              >
            </div>
            <template v-else>
              <div class="w-1/2 r">
                <div class="p-5">
                  <StatusChart
                    :statusChartItems
                    v-model:selected-status="selectedStatus"
                  />
                </div>
              </div>
              <div class="w-1/2">
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(status, i) in statusChartItems"
                    :key="i"
                    @click="clickStatusItem(i)"
                    class="flex p-1 rounded hover:bg-primary-extraLight active:bg-primary-extraLight cursor-pointer"
                  >
                    <div
                      class="w-5 h-5 rounded"
                      :style="{ background: status.color }"
                    ></div>
                    <span
                      class="mx-2 flex-1 text-textColor-primary font-medium"
                      >{{ status.label }}</span
                    >
                    <span class="text-primary font-medium">{{
                      status.count
                    }}</span>
                  </div>
                  <div class="flex p-1">
                    <span class="flex-1 text-textColor-primary font-medium"
                      >Tổng</span
                    >
                    <span class="text-primary font-medium">{{
                      totalCount
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="w-1/2 group p-5 flex flex-col shadow rounded-lg">
          <span class="mb-1 text-base font-semibold text-textColor-primary"
            >Hoạt động gần đây</span
          >
          <span class="mb-2 text-textColor-secondary"
            >Xem nhanh những hoạt động gần đầy đã xảy ra trong dự án.</span
          >
          <div class="flex-1 h-full overflow-hidden relative">
            <div
              class="flex flex-col absolute top-0 left-0 right-0 bottom-0 overflow-y-scroll scroll-vert"
            >
              <div
                v-if="isLoadingActivities"
                class="w-full h-full flex flex-center"
              >
                <LoadingIcon
                  class="w-5 h-5 fill-textColor-secondary animate-spin"
                />
              </div>
              <template v-else>
                <ActivityItem
                  class="py-2"
                  v-for="activity in projectActivities"
                  :key="activity.id"
                  :activity
                />
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-1/2 group p-5 flex flex-col shadow rounded-lg">
          <span class="mb-1 text-base font-semibold text-textColor-primary"
            >Thống kê độ ưu tiên</span
          >
          <span class="mb-2 text-textColor-secondary"
            >Có được cái nhìn toàn diện về độ ưu tiên các công việc.</span
          >
          <div class="">
            <PriorityChart :data="priorityData" />
          </div>
        </div>
        <div class="w-1/2 group p-5 flex flex-col shadow rounded-lg">
          <span class="mb-1 text-base font-semibold text-textColor-primary"
            >Khối lượng công việc nhóm</span
          >
          <span class="mb-2 text-textColor-secondary"
            >Giám sát năng lục của nhóm.</span
          >
          <div class="flex-1 h-full overflow-hidden relative">
            <div
              class="flex flex-col absolute top-0 left-0 right-0 bottom-0 overflow-y-scroll scroll-vert none"
            >
              <table>
                <thead>
                  <tr class="text-left">
                    <th
                      class="w-[150px] pr-2 py-1 font-medium text-textColor-subtitle"
                    >
                      Người thực hiện
                    </th>
                    <th class="px-2 py-1 font-medium text-textColor-subtitle">
                      Phân công công việc
                    </th>
                    <th
                      class="w-[80px] pl-2 py-1 text-right font-medium text-textColor-subtitle"
                    >
                      Công việc
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in tasksByAssignee" :key="item.id">
                    <td class="flex items-center pr-2 py-1">
                      <Avatar
                        class="w-8 h-8 mr-2"
                        :avatarUrl="item.user?.avatar ?? ''"
                      />
                      <span class="text-dots">{{
                        item.user?.fullname ?? "Chưa được giao"
                      }}</span>
                    </td>
                    <td class="px-2 py-1">
                      <div class="flex items-center">
                        <div
                          class="flex-1 h-3 bg-bgColor-secondary relative rounded-md overflow-hidden"
                        >
                          <div
                            class="bg-primary h-full rounded-md"
                            :style="{ width: item.percentage + '%' }"
                          ></div>
                        </div>
                        <span
                          class="w-12 text-right font-medium text-textColor-primary"
                          >{{ item.percentage }}%</span
                        >
                      </div>
                    </td>
                    <td
                      class="pl-2 py-1 text-right font-medium text-textColor-primary"
                    >
                      {{ item.count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
