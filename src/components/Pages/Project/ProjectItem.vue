<script setup lang="ts">
import { IProject } from "@/types";

defineProps<{
  project: IProject;
}>();
</script>

<template>
  <div
    class="w-full px-3 py-2 bg-bgColor-primary flex flex-col justify-between rounded-lg shadow"
  >
    <img src="@/assets/images/Rectangle.png" alt="" class="h-[100px]" />
    <div class="mt-2 flex items-center not-lastchild:mr-1">
      <div class="relative group w-10 h-2 rounded bg-red-400 cursor-pointer">
        <div class="hidden group-hover:block absolute top-full pt-1">
          <span
            class="px-[6px] py-[2px] text-xs text-textColor-tooltip bg-bgColor-tooltip rounded"
            >Game</span
          >
        </div>
      </div>
    </div>
    <RouterLink
      :to="{ name: 'Project', params: { projectId: i } }"
      class="mt-2 flex flex-col"
    >
      <span class="text-base font-bold text-textColor-primary"
        >Dự án {{ i }}</span
      >
      <span class="text-sm text-textColor-secondary text-dots"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
        quo?</span
      >
    </RouterLink>
    <div class="mt-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-textColor-primary"
          >Tiến trình</span
        >
        <span class="text-sm text-primary-light">75%</span>
      </div>
      <div class="relative w-full h-2 bg-[#c6d3ff] rounded">
        <div
          class="absolute left-0 top-0 bottom-0 w-[80%] bg-primary rounded"
        ></div>
        <div
          class="absolute left-[80%] top-1/2 -translate-y-1/2 -translate-x-1 w-3 h-3 border-[2px] border-white rounded-full bg-primary box-content"
        ></div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-xs text-textColor-secondary">Người tạo</span>
          <div
            class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
          >
            <img src="@/assets/images/Logo.png" alt="" class="" />
          </div>
        </div>
        <div class="flex items-center not-firstchild:-ml-[6px]">
          <div
            class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
          >
            <img src="@/assets/images/Logo.png" alt="" class="" />
          </div>
          <div
            class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
          >
            <img src="@/assets/images/Logo.png" alt="" class="" />
          </div>
          <div
            class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
          >
            <img src="@/assets/images/Logo.png" alt="" class="" />
          </div>
          <div
            class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
          >
            <img src="@/assets/images/Logo.png" alt="" class="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
