<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ref, computed, watch, nextTick } from "vue";
import { TypedChartComponent } from "node_modules/vue-chartjs/dist/types";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { project } = storeToRefs(useProjectStore());

const speedChartOptions = ref<ChartOptions<"line">>({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
  },
});

const speedChartData = computed<ChartData<"line">>(() => ({
  labels: ["January", "February", "March"],
  datasets: [{ data: [40, 20, 12] }],
}));

const speedData = computed(() => {});
</script>

<template>
  <div>
    <div class="p-5 flex flex-col shadow rounded-lg">
      <span class="mb-1 text-base font-semibold text-textColor-primary"
        >Tốc độ hoàn thành công việc</span
      >
      <span class="mb-2 text-textColor-secondary"
        >Xem nhanh qua các trạng thái của các công việc.</span
      >
      <div class="flex gap-2 items-center">
        <Line
          ref="speedChartRef"
          :options="speedChartOptions"
          :data="speedChartData"
        />
      </div>
    </div>
  </div>
</template>
