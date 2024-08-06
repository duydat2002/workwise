<script setup lang="ts">
import URange from "@/components/UI/URange.vue";
import { ref } from "vue";

const range = ref(0);
</script>

<template>
  <div class="m-5">
    <URange v-model:value="range" />
  </div>
  <span>{{ range }}</span>
  <div class="flex gap-2">
    <div class="flex flex-col w-3/5 h-[200px]">
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-textColor-primary"
            >Tổng số công việc</span
          >
          <span class="">Xem tất cả</span>
        </div>
        <div class="flex gap-2">
          <div class="w-1/3 flex bg-bgColor-secondary rounded-lg">
            <div class="flex flex-col">
              <span class="">Cần thực hiện</span>
              <span class="">80</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-2/5 h-[200px]"></div>
  </div>
</template>
