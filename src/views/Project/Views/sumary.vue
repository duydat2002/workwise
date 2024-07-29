<script setup lang="ts">
import CheckIcon from "@icons/check.svg";
</script>

<template>
  <div class="flex flex-col">
    <span class="">Xin chào Phạm Duy Đạt</span>
    <div class="flex">
      <div class="group p-5 flex shadow rounded-lg">
        <div
          class="w-10 h-10 flex flex-center bg-bgColor-secondary rounded-full"
        >
          <CheckIcon class="w-4 group-hover:w-5 transition-all" />
        </div>
        <div class="flex flex-col">
          <span class="text-base font-semibold text-textColor-primary"
            >{{ 0 }} đã hoàn thành</span
          >
          <span class="text-sm font-semibold text-textColor-secondary"
            >trong 7 ngày qua</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
