<script setup lang="ts">
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { computed } from "vue";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const props = defineProps<{
  options?: ChartOptions<"pie">;
  data: ChartData<"pie">;
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
    } as ChartOptions<"pie">)
  );
});
</script>

<template>
  <Pie ref="pieChartRef" :options="optionsComp" :data />
</template>
