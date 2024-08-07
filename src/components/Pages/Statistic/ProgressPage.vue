<script setup lang="ts">
import { ChartData, ChartOptions } from "chart.js";
import { ref, computed, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";
import { ITask } from "@/types";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import PieChart from "../Chart/PieChart.vue";
import LineChart from "../Chart/LineChart.vue";

const props = defineProps<{
  tasks: ITask[];
  dates: Date[];
  range: string;
}>();

const { project } = storeToRefs(useProjectStore());

const pieChartOptions = ref<ChartOptions<"pie">>({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context: any) => {
          const label = context.label || "";
          const value = context.parsed;
          const total = context.dataset.data.reduce(
            (acc: number, data: number) => acc + data,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return `${label}: ${percentage}% (${value})`;
        },
      },
    },
  },
});

const lineChartOptions = ref<ChartOptions<"line">>({
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
    y: {
      title: {
        display: true,
        text: "Công việc còn lại",
      },
      stacked: true,
      ticks: {
        stepSize: 1,
      },
      beginAtZero: true,
    },
  },
});

const workPerformanceData = computed(() => {
  let completedBeforeDuedate = 0;
  let completedAfterDuedate = 0;
  let pending = 0;
  let outOfDate = 0;
  let notComplete = 0;

  props.tasks.forEach((task) => {
    if (task.approvals.some((a) => a.status == "pending")) {
      pending++;
    } else if (task.status != "completed") {
      if (
        task.dueDate &&
        new Date(task.dueDate).getTime() < new Date().getTime()
      )
        outOfDate++;
      else notComplete++;
    } else if (
      task.dueDate &&
      task.finishDate &&
      new Date(task.dueDate).getTime() < new Date(task.finishDate).getTime()
    ) {
      completedAfterDuedate++;
    } else {
      completedBeforeDuedate++;
    }
  });

  return [
    {
      name: "Hoàn thành trước hạn",
      color: "#37c5ab",
      count: completedBeforeDuedate,
    },
    {
      name: "Hoàn thành trễ hạn",
      color: "#a4cf30",
      count: completedAfterDuedate,
    },
    { name: "Chờ duyệt", color: "#aa62e3", count: pending },
    { name: "Chưa hoàn thành", color: "#8da3a6", count: outOfDate },
    { name: "Quá hạn", color: "#ff6566", count: notComplete },
  ];
});

const workPerformance = computed<ChartData<"pie">>(() => {
  const labels = workPerformanceData.value.map((i) => i.name);
  const backgrounds = workPerformanceData.value.map((i) => i.color);
  const datas = workPerformanceData.value.map((i) => i.count);

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgrounds,
        data: datas,
      },
    ],
  };
});

const completedTasks = computed(
  () => props.tasks.filter((t) => t.finishDate)?.length ?? 0
);

const completionRate = computed<ChartData<"pie">>(() => {
  const uncompletedTasks = props.tasks.length - completedTasks.value;

  return {
    labels: ["Đã hoàn thành", "Chưa hoàn thành"],
    datasets: [
      {
        backgroundColor: ["#37c5ab", "#8da3a6"],
        data: [completedTasks.value, uncompletedTasks],
      },
    ],
  };
});

const testData = computed(() => {
  const taskCounts = props.dates.map((d) => ({
    totalTasks: 0,
    totalCompleted: 0,
    date: d,
  }));

  props.tasks.forEach((t) => {
    taskCounts.forEach((c, i) => {
      if (isBefore(t.createdAt, c.date) || isSameDay(t.createdAt, c.date)) {
        c.totalTasks++;
      }

      if (
        t.finishDate &&
        (isBefore(t.finishDate, c.date) || isSameDay(t.finishDate, c.date))
      ) {
        c.totalCompleted++;
      }
    });
  });

  return taskCounts;
});

const speedChartData = computed<ChartData<"line">>(() => ({
  labels: testData.value.map((i) => format(i.date, "dd/MM")),
  datasets: [
    {
      label: "Công việc còn lại",
      data: testData.value.map((i) => i.totalTasks - i.totalCompleted),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 1)",
      fill: true,
    },
  ],
}));

const dataTest = computed(() => {
  const labels = testData.value.map((i) => format(i.date, "dd/MM"));
  const totalTasks = testData.value[0].totalTasks;
  const idealBurndown = testData.value.map(
    (d, index) =>
      totalTasks - (totalTasks / (testData.value.length - 1)) * index
  );
  const actualBurndown = testData.value.map(
    (d) => d.totalTasks - d.totalCompleted
  );

  return {
    labels,
    datasets: [
      {
        label: "Ideal Burndown",
        data: idealBurndown,
        borderColor: "rgba(75, 192, 192, 1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      },
      {
        label: "Actual Burndown",
        data: actualBurndown,
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
        tension: 0,
      },
    ],
  };
});
</script>

<template>
  <div>
    <div class="p-5 flex shadow rounded-lg mb-4">
      <div class="flex flex-col w-1/2">
        <span class="mb-1 text-base font-semibold text-textColor-primary"
          >Tỷ lệ hoàn thành dự án</span
        >
        <div class="flex items-center gap-6">
          <div class="w-1/2">
            <PieChart :options="pieChartOptions" :data="completionRate" />
          </div>
          <div class="w-1/2 flex flex-col">
            <div class="flex items-center text-base">
              <span class="font-semibold mr-2 text-[#37c5ab]">{{
                completedTasks
              }}</span>
              <span class="">Đã hoàn thành</span>
            </div>
            <div class="flex items-center text-base">
              <span class="font-semibold mr-2 text-[#8da3a6]">{{
                tasks.length - completedTasks
              }}</span>
              <span class="">Chưa hoàn thành</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-1/2">
        <span class="mb-1 text-base font-semibold text-textColor-primary"
          >Tình trạng thực hiện công việc</span
        >
        <div class="flex items-center gap-6">
          <div class="w-1/2">
            <PieChart :options="pieChartOptions" :data="workPerformance" />
          </div>
          <div class="w-1/2 flex flex-col">
            <div
              v-for="item in workPerformanceData"
              class="flex items-center text-base"
            >
              <span class="font-semibold mr-2" :style="{ color: item.color }">{{
                item.count
              }}</span>
              <span class="">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 flex flex-col shadow rounded-lg">
      <span class="mb-1 text-base font-semibold text-textColor-primary"
        >Lượng công việc còn lại</span
      >
      <div class="flex gap-2 items-center">
        <div class="w-full max-w-[800px]">
          <LineChart :options="lineChartOptions" :data="speedChartData" />
        </div>
      </div>
    </div>
  </div>
</template>
