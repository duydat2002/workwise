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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { computed } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

const props = defineProps<{
  options?: any;
  data: ChartData<"bar">;
}>();

const optionsComp = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
        ticks: {
          stepSize: 1,
        },
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
    ...props.options,
  } as ChartOptions<"bar">;
});
</script>

<template>
  <Bar ref="lineChartRef" :options="optionsComp" :data />
</template>
