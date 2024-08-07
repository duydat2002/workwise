<script setup lang="ts">
import UTable from "@/components/UI/UTable.vue";
import { IMember, ITask, IUserInfo } from "@/types";
import { GridOptions, ColDef } from "ag-grid-community";
import { ref } from "vue";
import { computed } from "vue";
import TMemberCell from "../Project/List/TMemberCell.vue";
import StackedBarChart from "../Chart/StackedBarChart.vue";
import { ChartData, ChartOptions } from "chart.js";
import Avatar from "@/components/Common/Avatar.vue";

const props = defineProps<{
  tasks: ITask[];
  members: IMember[];
  range: string;
}>();

interface IData {
  user: IUserInfo | null;
  completedBeforeDuedate: number;
  completedAfterDuedate: number;
  pending: number;
  outOfDate: number;
  notComplete: number;
}

const colDefs = ref<ColDef[]>([
  {
    headerName: "Thành viên",
    field: "user",
    flex: 1,
    width: 200,
    valueFormatter: (p) => p.value,
    valueParser: (p) => p.newValue,
    cellRenderer: TMemberCell,
  },
  {
    headerName: "Hoàn thành trước hạn",
    field: "completedBeforeDuedate",
  },
  {
    headerName: "Hoàn thành trễ hạn",
    field: "completedAfterDuedate",
  },
  {
    headerName: "Chờ duyệt",
    field: "pending",
  },
  {
    headerName: "Chưa hoàn thành",
    field: "notComplete",
  },
  {
    headerName: "Quá hạn",
    field: "outOfDate",
  },
]);

const testData = computed(() => {
  const assigneeCounts = props.tasks.reduce((acc, task) => {
    const assigneeId = task.assignee ? task.assignee.id : "unassigned";
    const assignee = props.members.find((m) => m.user.id == assigneeId)?.user;

    if (!acc[assigneeId]) {
      acc[assigneeId] = {
        user: assignee ?? null,
        completedBeforeDuedate: 0,
        completedAfterDuedate: 0,
        pending: 0,
        outOfDate: 0,
        notComplete: 0,
      };
    }

    if (task.approvals.some((a) => a.status == "pending")) {
      acc[assigneeId].pending++;
    } else if (task.status != "completed") {
      if (
        task.dueDate &&
        new Date(task.dueDate).getTime() < new Date().getTime()
      )
        acc[assigneeId].outOfDate++;
      else acc[assigneeId].notComplete++;
    } else if (
      task.dueDate &&
      task.finishDate &&
      new Date(task.dueDate).getTime() < new Date(task.finishDate).getTime()
    ) {
      acc[assigneeId].completedAfterDuedate++;
    } else {
      acc[assigneeId].completedBeforeDuedate++;
    }

    return acc;
  }, {} as Record<string, IData>);

  return Object.entries(assigneeCounts)
    .map(([id, data]) => ({
      id,
      ...data,
    }))
    .sort((a, b) => {
      if (a.id == "unassigned") return -1;
      if (b.id == "unassigned") return 1;
      return 0;
    });
});

const chartData = computed<ChartData<"bar">>(() => ({
  labels: testData.value.map((i) => i.id),
  datasets: [
    {
      label: "Hoàn thành trước hạn",
      data: testData.value.map((i) => i.completedBeforeDuedate),
      backgroundColor: "#37c5ab",
    },
    {
      label: "Hoàn thành trễ hạn",
      data: testData.value.map((i) => i.completedAfterDuedate),
      backgroundColor: "#a4cf30",
    },
    {
      label: "Chờ duyệt",
      data: testData.value.map((i) => i.pending),
      backgroundColor: "#aa62e3",
    },
    {
      label: "Chưa hoàn thành",
      data: testData.value.map((i) => i.notComplete),
      backgroundColor: "#8da3a6",
    },
    {
      label: "Quá hạn",
      data: testData.value.map((i) => i.outOfDate),
      backgroundColor: "#ff6566",
    },
  ],
}));
</script>

<template>
  <div>
    <div class="p-5 flex flex-col shadow rounded-lg">
      <span class="mb-1 text-base font-semibold text-textColor-primary"
        >Thống kê tình trạng thực hiện công việc</span
      >
      <span class="mb-2 text-textColor-secondary"
        >Biểu đồ thể hiện hiệu suất công việc các thành viên.</span
      >
      <div class="p-5 flex">
        <div class="flex flex-col mb-8 justify-around">
          <div
            v-for="item in testData"
            :key="item.id"
            class="flex items-center flex-shrink-0"
          >
            <Avatar
              class="w-5 h-5 mr-2 flex-shrink-0"
              :avatarUrl="item.user?.avatar"
            />
            <span class="text-nowrap">{{
              item.user?.fullname ?? "Chưa giao"
            }}</span>
          </div>
        </div>
        <div class="flex-1">
          <StackedBarChart :data="chartData" />
        </div>
      </div>
      <div class="">
        <UTable :rowData="testData" :columnDefs="colDefs" />
      </div>
    </div>
  </div>
</template>
