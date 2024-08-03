<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Plugin,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { TypedChartComponent } from "node_modules/vue-chartjs/dist/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartItem {
  label: string;
  count: number;
  color: string;
}

const chartRef = ref<TypedChartComponent<"doughnut"> | null>(null);
const chartInstance = ref<ChartJS<"doughnut"> | null>(null);

const chartItems = ref<ChartItem[]>([
  { label: "To Do", count: 10, color: "#E0E0E0" },
  { label: "In Progress", count: 4, color: "#36A2EB" },
  { label: "Ready for Launch", count: 4, color: "#FF6384" },
  { label: "Launched", count: 1, color: "#4BC0C0" },
]);

const selectedStatus = ref<ChartItem>(chartItems.value[2]);

const totalCount = computed(() =>
  chartItems.value.reduce((sum, item) => sum + item.count, 0)
);

const chartData = computed<ChartData<"doughnut">>(() => ({
  labels: chartItems.value.map((item) => item.label),
  datasets: [
    {
      data: chartItems.value.map((item) => item.count),
      backgroundColor: chartItems.value.map((item) => item.color),
      borderWidth: 0,
    },
  ],
}));

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
};

const updateCenterText = (chart: ChartJS<"doughnut">) => {
  const { ctx, chartArea } = chart;
  if (!chartArea) return;

  const { width, height } = chartArea;

  ctx.save();
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = selectedStatus.value.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const percentage = (
    (selectedStatus.value.count / totalCount.value) *
    100
  ).toFixed(0);
  ctx.fillText(`${percentage}%`, width / 2, height / 2 - 10);

  ctx.font = "16px Arial";
  ctx.fillText(selectedStatus.value.label, width / 2, height / 2 + 20);
  ctx.restore();
};

const plugins: Plugin<"doughnut">[] = [
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
          selectedStatus.value = chartItems.value[activeElements[0].index];
        }
      }
    },
  },
];

const selectStatus = (index: number) => {
  selectedStatus.value = chartItems.value[index];
};

watch(
  selectedStatus,
  () => {
    nextTick(() => {
      if (chartInstance.value) {
        chartInstance.value.render();
        updateCenterText(chartInstance.value);
      }
    });
  },
  { immediate: true }
);

onMounted(() => {
  nextTick(() => {
    chartInstance.value = chartRef.value?.chart;
  });
});
</script>

<template>
  <div class="chart-container">
    <div class="w-500px">
      <Doughnut
        ref="chartRef"
        :data="chartData"
        :options="chartOptions"
        :plugins="plugins"
      />
    </div>
    <div class="legend w-[300px]">
      <div
        v-for="(item, index) in chartItems"
        :key="index"
        class="legend-item"
        @click="selectStatus(index)"
      >
        <div class="color-box" :style="{ backgroundColor: item.color }"></div>
        <span>{{ item.label }}</span>
        <span class="count">{{ item.count }}</span>
      </div>
      <div class="legend-item total">
        <span>Total</span>
        <span class="count">{{ totalCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  justify-content: space-between;
}
.legend {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}
.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.count {
  margin-left: auto;
  font-weight: bold;
}
.total {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
