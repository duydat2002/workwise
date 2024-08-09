<script setup lang="ts">
import { ChartData, ChartOptions } from "chart.js";
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";
import { IOption, ITask } from "@/types";
import { differenceInDays, format, isBefore, isSameDay } from "date-fns";
import LineChart from "../Chart/LineChart.vue";
import DonutChart from "../Chart/DonutChart.vue";
import RangeSelect from "./RangeSelect.vue";
import { GridOptions, ColDef } from "ag-grid-community";
import UTable from "@/components/UI/UTable.vue";
import TNameCell from "../Project/List/TNameCell.vue";
import TStatusCell from "../Project/List/TStatusCell.vue";
import { dateComparator, formatDate } from "@/helpers";
import TAssigneeCell from "../Project/List/TAssigneeCell.vue";
import TProgressCell from "../Project/List/TProgressCell.vue";

const props = defineProps<{
  tasks: ITask[];
}>();

const { project } = storeToRefs(useProjectStore());

const lineChartOptions = ref<ChartOptions<"line">>({
  responsive: true,
  maintainAspectRatio: false,

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
        text: "Số lượng công việc",
      },
      stacked: true,
      ticks: {
        stepSize: 1,
        maxTicksLimit: 10,
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

const workPerformanceSelected = ref(workPerformanceData.value[0] ?? {});

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
  const taskCounts = burnUpRangeDates.value.map((d) => ({
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

const burnUpChartData = computed<ChartData<"line">>(() => ({
  labels: testData.value.map((i) => format(i.date, "dd/MM")),
  datasets: [
    {
      label: "Công việc đã hoàn thành",
      data: testData.value.map((i) => i.totalCompleted),
      borderColor: "#37c5ab",
      backgroundColor: "#37c5ab",
    },
    {
      label: "Tổng số công việc",
      data: testData.value.map((i) => i.totalTasks),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 1)",
    },
  ],
}));

const dateRemaining = computed(() => {
  return {
    total: differenceInDays(project.value!.dueDate, project.value!.startDate),
    remaining: differenceInDays(project.value!.dueDate, new Date()),
  };
});

const clickWorkPerformance = (data: any) => {
  workPerformanceSelected.value = workPerformanceData.value[data.index];
};

const burnUpRangeSelected = ref<string>("week");
const burnUpRangeDates = ref<Date[]>([]);

const projectRangeDate = computed(() => {
  const sortedDates = props.tasks
    .map((t) => t.updatedAt)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return {
    minDate: sortedDates[0],
    maxDate: sortedDates[sortedDates.length - 1],
  };
});

const chooseBurnUpRange = (dates: Date[]) => {
  burnUpRangeDates.value = dates;
};

const colDefs = ref<ColDef[]>([
  {
    headerName: "Tên công việc",
    field: "name",
    width: 200,
    cellRenderer: TNameCell,
    cellRendererParams: {
      hasLine: true,
      hasPermission: false,
    },
  },
  {
    headerName: "Nhóm công việc",
    field: "taskGroup",
    width: 150,
    valueFormatter: (p) => p.value,
    valueGetter: (p: any) => p.data.taskGroup.name ?? p.data.taskGroup,
  },
  {
    headerName: "Người thực hiện",
    field: "assignee",
    width: 150,
    valueFormatter: (p) => p.value,
    valueParser: (p) => p.newValue,
    cellRenderer: TAssigneeCell,
  },
  {
    headerName: "Trạng thái",
    field: "status",
    width: 150,
    cellRenderer: TStatusCell,
  },
  {
    headerName: "Tiến độ",
    field: "progress",
    width: 150,
    cellRenderer: TProgressCell,
  },
  {
    headerName: "Ngày đến hạn",
    field: "dueDate",
    width: 150,
    comparator: dateComparator,
    valueFormatter: (p: any) => {
      if (p.value) return formatDate(p.value, "dd/MM/yyyy");
      else {
        return "";
      }
    },
  },
  {
    headerName: "Ngày hoàn thành",
    field: "finishDate",
    width: 150,
    comparator: dateComparator,
    valueFormatter: (p: any) => {
      if (p.value) return formatDate(p.value, "dd/MM/yyyy");
      else {
        return "";
      }
    },
  },
]);
</script>

<template>
  <div>
    <div class="p-5 flex shadow items-center rounded-lg mb-4">
      <div class="flex flex-col w-3/5">
        <span class="mb-1 text-base font-semibold text-textColor-primary"
          >Tỷ lệ hoàn thành dự án</span
        >
        <div class="flex items-center">
          <div class="w-1/2 mr-2">
            <DonutChart :data="(completionRate as any)">
              <div class="flex flex-col flex-center">
                <span class="text-3xl text-center font-bold text-[#37c5ab]"
                  >{{
                    ((completedTasks / tasks.length) * 100).toFixed(0)
                  }}%</span
                >
              </div>
            </DonutChart>
          </div>
          <div class="w-1/2 flex flex-col">
            <div class="flex items-center justify-between gap-4 text-base">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-sm bg-[#37c5ab] mr-1"></div>
                <span class="">Đã hoàn thành</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold"
                  >({{
                    ((completedTasks / tasks.length) * 100).toFixed(0)
                  }}%)</span
                >
                <span class="font-semibold w-6 text-right">{{
                  completedTasks
                }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between gap-4 text-base">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-sm bg-[#8da3a6] mr-1"></div>
                <span class="">Chưa hoàn thành</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold"
                  >({{
                    (100 - (completedTasks / tasks.length) * 100).toFixed(0)
                  }}%)</span
                >
                <span class="font-semibold w-6 text-right">{{
                  tasks.length - completedTasks
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-2/5 gap-6 p-5">
        <div class="flex flex-col">
          <span class="text-base font-semibold text-textColor-primary"
            >{{ tasks.length - completedTasks }}/ {{ tasks.length }} Công việc
            chưa hoàn thành</span
          >
          <span class="text-textColor-secondary"
            >{{
              (100 - (completedTasks / tasks.length) * 100).toFixed(1)
            }}
            %</span
          >
          <div class="h-2 w-full mt-2 rounded-md bg-hover overflow-hidden">
            <div
              class="h-full bg-primary"
              :style="{
                width:
                  (100 - (completedTasks / tasks.length) * 100).toFixed(1) +
                  '%',
              }"
            ></div>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-base font-semibold text-textColor-primary"
            >{{ dateRemaining.remaining }}/ {{ dateRemaining.total }} Ngày còn
            lại</span
          >
          <span class="text-textColor-secondary"
            >{{
              (
                100 -
                (dateRemaining.remaining / dateRemaining.total) * 100
              ).toFixed(1)
            }}
            %</span
          >
          <div class="h-2 mt-2 w-full rounded-md bg-hover overflow-hidden">
            <div
              class="h-full bg-primary"
              :style="{
                width:
                  (
                    100 -
                    (dateRemaining.remaining / dateRemaining.total) * 100
                  ).toFixed(1) + '%',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 flex shadow rounded-lg mb-4">
      <div class="flex flex-col w-full">
        <span class="mb-1 text-base font-semibold text-textColor-primary"
          >Tình trạng thực hiện công việc</span
        >
        <div class="flex items-center">
          <div class="w-1/2 p-4 mr-2">
            <DonutChart
              :data="(workPerformance as any)"
              @hover="clickWorkPerformance"
            >
              <div class="flex flex-col">
                <span
                  class="text-3xl font-bold"
                  :style="{ color: workPerformanceSelected?.color ?? '#000' }"
                  >{{
                    (
                      (workPerformanceSelected?.count / tasks.length) *
                      100
                    ).toFixed(0)
                  }}%</span
                >
              </div>
            </DonutChart>
          </div>
          <div class="w-1/2 flex flex-col">
            <div
              v-for="item in workPerformanceData"
              :key="item.name"
              class="flex items-center justify-between text-base"
            >
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-sm mr-1"
                  :style="{ background: item.color }"
                ></div>
                <span class="">{{ item.name }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold"
                  >({{ ((item.count / tasks.length) * 100).toFixed(0) }}%)</span
                >
                <span class="font-semibold w-6 text-right">{{
                  item.count
                }}</span>
              </div>
            </div>
            <div
              class="flex items-center justify-between text-base text-textColor-primary font-semibold"
            >
              <span class="">Tổng</span>
              <span class="">{{ tasks.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 flex flex-col shadow mb-4 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="mb-1 text-base font-semibold text-textColor-primary"
          >Burn up tiến độ công việc</span
        >
        <div class="">
          <RangeSelect
            v-model:selected="burnUpRangeSelected"
            :minDate="projectRangeDate.minDate"
            :maxDate="projectRangeDate.maxDate"
            @choose="chooseBurnUpRange"
          />
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="w-full h-[350px]">
          <LineChart :options="lineChartOptions" :data="burnUpChartData" />
        </div>
      </div>
    </div>
    <div class="p-5 flex flex-col shadow rounded-lg">
      <span class="mb-1 text-base font-semibold text-textColor-primary"
        >Chi tiết</span
      >
      <UTable :rowData="tasks" :columnDefs="colDefs" />
    </div>
  </div>
</template>
