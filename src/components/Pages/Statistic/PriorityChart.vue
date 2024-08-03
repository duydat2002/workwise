<script setup lang="ts">
import PriorityLowestIcon from "@icons/priority-lowest.svg";
import PriorityLowIcon from "@icons/priority-low.svg";
import PriorityMediumIcon from "@icons/priority-medium.svg";
import PriorityHighIcon from "@icons/priority-high.svg";
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
} from "chart.js";
import { ref, shallowRef } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  data: number[];
}>();

const priorities = shallowRef([
  { key: "high", name: "Cao", icon: PriorityHighIcon },
  { key: "medium", name: "Trung bình", icon: PriorityMediumIcon },
  { key: "low", name: "Thấp", icon: PriorityLowIcon },
  { key: "none", name: "Không", icon: PriorityLowestIcon },
]);

const chartData = ref({
  labels: ["Cao", "Trung bình", "Thấp", "Không"],
  datasets: [
    {
      data: props.data,
      backgroundColor: ["#ff9f40", "#ffcd56", "#4bc0c0", "#36a2eb"],
      maxBarThickness: 50,
      // barThickness: 50,
    },
  ],
});

const chartOptions = ref<ChartOptions<"bar">>({
  responsive: true,
  scales: {
    x: {
      ticks: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 2,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
});
</script>

<template>
  <div class="flex flex-col">
    <Bar :data="chartData" :options="chartOptions" />
    <div class="flex items-center ml-6">
      <div
        v-for="priority in priorities"
        :key="priority.key"
        class="flex-1 flex flex-col flex-center"
      >
        <component :is="priority.icon" class="w-5" />
        <span class="font-medium text-primary text-center">{{
          priority.name
        }}</span>
      </div>
    </div>
  </div>
</template>
