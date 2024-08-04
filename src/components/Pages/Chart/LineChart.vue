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
import { computed } from "vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  options?: ChartOptions<"line">;
  data: ChartData<"line">;
}>();

const optionsComp = computed(() => {
  return (
    props.options ??
    ({
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          enabled: true,
        },
      },
    } as ChartOptions<"line">)
  );
});
</script>

<template>
  <Line ref="lineChartRef" :options="optionsComp" :data />
</template>
