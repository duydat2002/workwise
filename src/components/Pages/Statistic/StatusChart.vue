<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  ChartData,
  ChartOptions,
  Plugin,
} from "chart.js";
import { ref, computed, watch, nextTick } from "vue";
import { TypedChartComponent } from "node_modules/vue-chartjs/dist/types";

ChartJS.register(DoughnutController, ArcElement);

interface IStatusChartItem {
  label: string;
  count: number;
  color: string;
  textColor?: string;
}

const emit = defineEmits(["update:selectedStatus"]);

const props = defineProps<{
  statusChartItems: IStatusChartItem[];
  selectedStatus: IStatusChartItem;
}>();

const selected = computed<IStatusChartItem>({
  get: () => props.selectedStatus,
  set: (value) => {
    emit("update:selectedStatus", value);
  },
});

const statusChartRef = ref<TypedChartComponent<"doughnut"> | null>(null);
const totalCount = computed(() =>
  props.statusChartItems.reduce((sum, item) => sum + item.count, 0)
);

const statusChartData = computed<ChartData<"doughnut">>(() => ({
  labels: props.statusChartItems.map((item) => item.label),
  datasets: [
    {
      data: props.statusChartItems.map((item) => item.count),
      backgroundColor: props.statusChartItems.map((item) => item.color),
      borderWidth: 0,
    },
  ],
}));

const statusChartOptions = ref<ChartOptions<"doughnut">>({
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
    datalabels: {
      display: false,
    },
  },
});

const updateCenterText = (chart: ChartJS<"doughnut">) => {
  const { ctx, chartArea } = chart;
  if (!chartArea) return;

  const { width, height } = chartArea;

  ctx.save();
  ctx.font = "bold 24px Segoe UI";
  ctx.fillStyle = selected.value.textColor ?? selected.value.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const percentage =
    selected.value.count == 0
      ? 0
      : ((selected.value.count / totalCount.value) * 100).toFixed(0);
  ctx.fillText(`${percentage}%`, width / 2, height / 2 - 10);

  ctx.font = "16px Segoe UI";
  ctx.fillText(selected.value.label, width / 2, height / 2 + 20);
  ctx.restore();
};

const statusChartPlugins: Plugin<"doughnut">[] = [
  {
    id: "centerText",
    beforeDatasetsDraw: (chart: ChartJS<"doughnut">) => {
      updateCenterText(chart);
    },
  },
  {
    id: "hoverPlugin",
    beforeEvent(chart, args, pluginOptions) {
      const event = args.event as unknown as Event;
      if (event.type === "mousemove") {
        const activeElements = chart.getElementsAtEventForMode(
          event,
          "nearest",
          { intersect: true },
          false
        );
        if (activeElements.length > 0) {
          selected.value = props.statusChartItems[activeElements[0].index];
        }
      }
    },
  },
];

watch(
  selected,
  () => {
    nextTick(() => {
      if (statusChartRef.value) {
        statusChartRef.value.chart.render();
        updateCenterText(statusChartRef.value.chart);
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <Doughnut
    ref="statusChartRef"
    :options="statusChartOptions"
    :data="statusChartData"
    :plugins="statusChartPlugins"
  />
</template>
