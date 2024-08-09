<script setup lang="ts">
import UTable from "@/components/UI/UTable.vue";
import { IMember, ITask, IUserInfo } from "@/types";
import { GridOptions, ColDef, ColGroupDef } from "ag-grid-community";
import { ref } from "vue";
import { computed } from "vue";
import TMemberCell from "../Project/List/TMemberCell.vue";
import StackedBarChart from "../Chart/StackedBarChart.vue";
import { ChartData, ChartOptions } from "chart.js";
import Avatar from "@/components/Common/Avatar.vue";
import TPerformanceCell from "../Project/List/TPerformanceCell.vue";
import {
  differenceInDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

const props = defineProps<{
  tasks: ITask[];
  members: IMember[];
  range: string;
}>();

interface IData {
  user: IUserInfo | null;
  completed: {
    total: number;
    beforeDueDate: number;
    afterDueDate: number;
  };
  inprogress: {
    total: number;
    outOfDate: number;
  };
  todo: {
    total: number;
    outOfDate: number;
  };
}

const colDefs = ref<(ColDef | ColGroupDef)[]>([
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
    headerName: "Số công việc",
    cellRenderer: TPerformanceCell,
    cellRendererParams: {
      field: "total",
    },
  },
  {
    headerName: "Đang thực hiện",
    children: [
      {
        headerName: "Số lượng",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "inprogress-total",
        },
      },
      {
        headerName: "Quá hạn",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "inprogress-outOfDate",
          color: "#ff6566",
        },
      },
    ],
  },
  {
    headerName: "Đã hoàn thành",
    children: [
      {
        headerName: "Số lượng",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "completed-total",
        },
      },
      {
        headerName: "Trước hạn",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "completed-beforeDueDate",
          color: "#37c5ab",
        },
      },
      {
        headerName: "Quá hạn",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "completed-afterDueDate",
          color: "#a4cf30",
        },
      },
    ],
  },
  {
    headerName: "Chưa thực hiện",
    children: [
      {
        headerName: "Số lượng",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "todo-total",
        },
      },
      {
        headerName: "Quá hạn",
        cellRenderer: TPerformanceCell,
        cellRendererParams: {
          field: "todo-outOfDate",
          color: "#ff6566",
        },
      },
    ],
  },
]);

const testData = computed(() => {
  let minDate;
  let maxDate;
  switch (props.range) {
    case "week":
      minDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      maxDate = endOfWeek(new Date(), { weekStartsOn: 1 });
      break;
    case "month":
      minDate = startOfMonth(new Date());
      maxDate = endOfMonth(new Date());
      break;
    case "year":
      minDate = startOfYear(new Date());
      maxDate = endOfYear(new Date());
      break;
    case "all":
    default:
      const sortedDates = props.tasks
        .map((t) => t.updatedAt)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      minDate = sortedDates[0];
      maxDate = sortedDates[sortedDates.length - 1];
      break;
  }

  const assigneeCounts = props.tasks
    .filter((t) =>
      isWithinInterval(t.updatedAt, { start: minDate, end: maxDate })
    )
    .reduce((acc, task) => {
      const assigneeId = task.assignee ? task.assignee.id : "unassigned";
      const assignee = props.members.find((m) => m.user.id == assigneeId)?.user;

      if (!acc[assigneeId]) {
        acc[assigneeId] = {
          user: assignee ?? null,
          completed: {
            total: 0,
            beforeDueDate: 0,
            afterDueDate: 0,
          },
          inprogress: {
            total: 0,
            outOfDate: 0,
          },
          todo: {
            total: 0,
            outOfDate: 0,
          },
        };
      }

      const outOfDate =
        task.dueDate &&
        differenceInDays(new Date(), new Date(task.dueDate)) > 0;

      if (task.status == "completed") {
        acc[assigneeId].completed.total++;
        if (outOfDate) {
          acc[assigneeId].completed.afterDueDate++;
        } else {
          acc[assigneeId].completed.beforeDueDate++;
        }
      } else if (task.status == "inprogress") {
        acc[assigneeId].inprogress.total++;
        if (outOfDate) {
          acc[assigneeId].inprogress.outOfDate++;
        }
      }
      if (task.status == "todo") {
        acc[assigneeId].todo.total++;
        if (outOfDate) {
          acc[assigneeId].todo.outOfDate++;
        }
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

const chartOptions = ref({
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "#FFF",
      font: {
        weight: "bold",
      },
      formatter: (value: any) => {
        return value != 0 ? value : null;
      },
      anchor: "center",
      align: "center",
      offset: 0,
    },
    tooltip: {
      callbacks: {
        title: (context: any) => {
          const index = context[0]?.parsed?.y || 0;
          return testData.value[index]?.user?.fullname ?? "Chưa giao";
        },
        label: (context: any) => {
          const datasetLabel = context.dataset.label || "";
          const value = context.parsed.x;
          const index = context.parsed.y;

          let total = 0;
          context.chart.data.datasets.forEach((dataset: any) => {
            total += dataset.data[index];
          });

          const percentage = ((value / total) * 100).toFixed(2);
          return `${datasetLabel}: ${value} (${percentage}%)`;
        },
      },
    },
  },
});

const chartData = computed<ChartData<"bar">>(() => ({
  labels: testData.value.map((i) => i.id),
  datasets: [
    {
      label: "Hoàn thành trước hạn",
      data: testData.value.map((i) => i.completed.beforeDueDate),
      backgroundColor: "#37c5ab",
    },
    {
      label: "Hoàn thành trễ hạn",
      data: testData.value.map((i) => i.completed.afterDueDate),
      backgroundColor: "#a4cf30",
    },
    {
      label: "Đang thực hiện",
      data: testData.value.map(
        (i) => i.inprogress.total - i.inprogress.outOfDate
      ),
      backgroundColor: "#5171fc",
    },
    {
      label: "Chưa hoàn thành",
      data: testData.value.map((i) => i.todo.total - i.todo.outOfDate),
      backgroundColor: "#8da3a6",
    },
    {
      label: "Quá hạn",
      data: testData.value.map(
        (i) => i.inprogress.outOfDate + i.todo.outOfDate
      ),
      backgroundColor: "#ff6566",
    },
  ],
}));

const tableData = computed(() => {});
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
          <StackedBarChart :options="chartOptions" :data="chartData" />
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-around gap-3 mb-3">
        <div
          v-for="item in chartData.datasets"
          :key="item.label"
          class="flex items-center"
        >
          <div
            class="w-4 h-4 rounded-sm mr-1"
            :style="{ background: item.backgroundColor?.toString() }"
          ></div>
          <span class="">{{ item.label }}</span>
        </div>
      </div>
      <div class="mt-3">
        <span
          class="mb-1 inline-block text-base font-semibold text-textColor-primary"
          >Chi tiết</span
        >
        <UTable :rowData="testData" :columnDefs="colDefs" />
      </div>
    </div>
  </div>
</template>
