<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  ChartData,
  ChartOptions,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";
import { ref, computed, watch, nextTick, useSlots } from "vue";
import { TypedChartComponent } from "node_modules/vue-chartjs/dist/types";

ChartJS.register(DoughnutController, ArcElement, Title, Tooltip, Legend);

const emit = defineEmits(["hover", "click"]);

const props = defineProps<{
  options?: ChartOptions<"doughnut">;
  data: ChartData<"doughnut">;
}>();

const slots = useSlots();

const optionsComp = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
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
      datalabels: {
        display: false,
      },
    },
    ...props.options,
  } as ChartOptions<"doughnut">;
});

const plugins: Plugin<"doughnut">[] = [
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
          const data = props.data.datasets
            .at(activeElements[0].datasetIndex ?? 0)
            ?.data?.at(activeElements[0].index ?? 0);

          handleHover(
            data,
            activeElements[0].datasetIndex ?? 0,
            activeElements[0].index ?? 0
          );
        }
      }
    },
  },
  {
    id: "clickPlugin",
    beforeEvent(chart, args, pluginOptions) {
      const event = args.event as unknown as Event;
      if (event.type === "click") {
        const activeElements = chart.getElementsAtEventForMode(
          event,
          "nearest",
          { intersect: true },
          false
        );
        if (activeElements.length > 0) {
          const data = props.data.datasets
            .at(activeElements[0].datasetIndex ?? 0)
            ?.data?.at(activeElements[0].index ?? 0);

          const datasetIndex = activeElements[0].datasetIndex ?? 0;
          const index = activeElements[0].index ?? 0;

          emit("click", { data, datasetIndex, index });
        }
      }
    },
  },
];

const handleHover = (
  data: number | string | undefined,
  datasetIndex: number,
  index: number
) => {
  emit("hover", { data, datasetIndex, index });
};
</script>

<template>
  <div class="w-full h-full relative">
    <Doughnut
      ref="donutChartRef"
      :options="optionsComp"
      :data="data"
      :plugins="plugins"
    />
    <div v-if="slots.default" class="absolute absolute-center"><slot /></div>
  </div>
</template>
