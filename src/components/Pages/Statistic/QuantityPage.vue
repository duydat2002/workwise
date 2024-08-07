<script setup lang="ts">
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ITask } from "@/types";
import { addDays, format, isWithinInterval } from "date-fns";
import { GridOptions, ColDef } from "ag-grid-community";
import { computed } from "vue";
import TaskNotFound from "../Task/TaskNotFound.vue";
import { ref } from "vue";
import UTable from "@/components/UI/UTable.vue";
import LineChart from "../Chart/LineChart.vue";
import { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  tasks: ITask[];
  dates: Date[];
  range: string;
}>();

const gridOptions = ref<GridOptions>({
  autoSizeStrategy: {
    type: "fitGridWidth",
    defaultMinWidth: 100,
  },
  suppressRowHoverHighlight: true,
  noRowsOverlayComponent: TaskNotFound,
  domLayout: "autoHeight",
});

const colDefs = ref<ColDef[]>([
  {
    headerName: "Giai đoạn",
    field: "date",
    flex: 1,
  },
  {
    headerName: "Đã tạo",
    field: "tasksCreated",
  },
  {
    headerName: "Đã hoàn thành",
    field: "tasksCompleted",
  },
]);

const testData = computed(() => {
  const taskCounts = props.dates.map((d) => ({
    tasksCreated: 0,
    tasksCompleted: 0,
    date: d,
  }));

  props.tasks.forEach((t) => {
    taskCounts.forEach((c, i) => {
      const startDate = taskCounts[i]?.date;
      const endDate = taskCounts[i + 1]?.date ?? addDays(c.date, 1);
      if (isWithinInterval(t.createdAt, { start: startDate, end: endDate })) {
        c.tasksCreated++;
      }

      if (
        t.finishDate &&
        isWithinInterval(t.finishDate, { start: startDate, end: endDate })
      ) {
        c.tasksCompleted++;
      }
    });
  });

  return taskCounts;
});

const speedChartData = computed<ChartData<"line">>(() => ({
  labels: testData.value.map((i) => format(i.date, "dd/MM")),
  datasets: [
    {
      label: "Đã tạo",
      data: testData.value.map((i) => i.tasksCreated),
      borderColor: "#ffeb3c",
      backgroundColor: "#ffeb3c",
    },
    {
      label: "Đã hoàn thành",
      data: testData.value.map((i) => i.tasksCompleted),
      borderColor: "#4cb050",
      backgroundColor: "#4cb050",
    },
  ],
}));

const lineOptions = ref<ChartOptions<"line">>({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 15,
      },
    },
    y: {
      title: {
        display: true,
        text: "Công việc",
      },
      ticks: {
        stepSize: 1,
      },
    },
  },
});
</script>

<template>
  <div>
    <div class="p-5 flex flex-col shadow rounded-lg">
      <span class="mb-1 text-base font-semibold text-textColor-primary"
        >Thống kê công việc đã tạo và đã hoàn thành</span
      >
      <span class="mb-2 text-textColor-secondary"
        >Biểu đồ thể hiện số công việc đã tạo và số công việc đã hoàn
        thành.</span
      >
      <div class="p-5 max-w-[800px]">
        <LineChart :options="lineOptions" :data="speedChartData" />
      </div>
      <div class="">
        <span
          class="mb-3 inline-block text-base font-semibold text-textColor-primary"
          >Chi tiết dữ liệu</span
        >
        <div class="w-full">
          <UTable :rowData="testData" :columnDefs="colDefs" :gridOptions />
        </div>
      </div>
    </div>
  </div>
</template>
