<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
  ChartData,
} from "chart.js";
import { computed } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  options?: ChartOptions<"bar">;
  data: ChartData<"bar">;
}>();

const optionsComp = computed(() => {
  return (
    props.options ??
    ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          ticks: {
            stepSize: 1,
          },
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    } as ChartOptions<"bar">)
  );
});
</script>

<template>
  <Bar ref="lineChartRef" :options="optionsComp" :data />
</template>
