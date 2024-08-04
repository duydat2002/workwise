<script setup lang="ts">
import { useCommonStore, useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";

const { narrowSidebar } = storeToRefs(useCommonStore());
const { statisticTab } = storeToRefs(useProjectStore());

const changeStatistic = (tab: typeof statisticTab.value) => {
  statisticTab.value = tab;
};
</script>

<template>
  <div class="h-full py-3 parent-[.narrow]:opacity-0">
    <div
      class="w-full h-full flex flex-col pl-2 pr-1 parent-[.narrow]:pr-0 overflow-y-scroll scroll-vert none not-lastchild:mb-1"
      :class="{ 'no-scrollbar': narrowSidebar }"
    >
      <span
        class="px-1 mb-2 text-textColor-secondary font-medium uppercase whitespace-nowrap"
        >Báo cáo thống kê</span
      >
      <div
        class="flex px-1 py-[6px] items-center rounded-md cursor-pointer transition-colors"
        :class="[
          statisticTab == 'progress'
            ? 'bg-primary text-white'
            : 'hover:bg-hover',
        ]"
        @click="changeStatistic('progress')"
      >
        <span class="font-medium text-dots">Tiến độ dự án</span>
      </div>
      <div
        class="flex px-1 py-[6px] items-center rounded-md cursor-pointer transition-colors"
        :class="[
          statisticTab == 'performance'
            ? 'bg-primary text-white'
            : 'hover:bg-hover',
        ]"
        @click="changeStatistic('performance')"
      >
        <span class="font-medium text-dots">Hiệu suất làm việc</span>
      </div>
      <div
        class="flex px-1 py-[6px] items-center rounded-md cursor-pointer transition-colors"
        :class="[
          statisticTab == 'quantity'
            ? 'bg-primary text-white'
            : 'hover:bg-hover',
        ]"
        @click="changeStatistic('quantity')"
      >
        <span class="font-medium text-dots">Số lượng công việc</span>
      </div>
    </div>
  </div>
</template>
