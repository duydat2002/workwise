<script setup lang="ts">
import UCircular from "@/components/UI/UCircular.vue";
import { ref } from "vue";
</script>

<template>
  <div class="relative h-full w-full">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 px-5 my-4 overflow-y-scroll scroll-vert"
    >
      <div class="pt-2 flex gap-3">
        <div class="w-3/5">
          <div class="flex flex-col">
            <span class="text-base font-semibold text-textColor-primary mb-3"
              >Tổng số công việc</span
            >
            <div class="flex gap-3">
              <div class="w-1/3 p-3 flex justify-between shadow-box rounded-lg">
                <div class="flex flex-col justify-between py-2">
                  <span class="text-base font-semibold text-textColor-primary"
                    >Việc cần làm</span
                  >
                  <span class="text-2xl font-semibold text-textColor-primary"
                    >20</span
                  >
                </div>
                <div class="w-[80px]">
                  <UCircular :progress="10" progress-bg="text-[#979797]"
                    ><span class="text-base font-bold text-[#979797]"
                      >10%</span
                    ></UCircular
                  >
                </div>
              </div>
              <div class="w-1/3 p-3 flex justify-between shadow-box rounded-lg">
                <div class="flex flex-col justify-between py-2">
                  <span class="text-base font-semibold text-textColor-primary"
                    >Đang thực hiện</span
                  >
                  <span class="text-2xl font-semibold text-textColor-primary"
                    >60</span
                  >
                </div>
                <div class="w-[80px]">
                  <UCircular :progress="30" progress-bg="text-blue-500"
                    ><span class="text-base font-bold text-blue-500"
                      >30%</span
                    ></UCircular
                  >
                </div>
              </div>
              <div class="w-1/3 p-3 flex justify-between shadow-box rounded-lg">
                <div class="flex flex-col justify-between py-2">
                  <span class="text-base font-semibold text-textColor-primary"
                    >Đã hoàn thành</span
                  >
                  <span class="text-2xl font-semibold text-textColor-primary"
                    >150</span
                  >
                </div>
                <div class="w-[80px]">
                  <UCircular :progress="60" progress-bg="text-green-500"
                    ><span class="text-base font-bold text-green-500"
                      >60%</span
                    ></UCircular
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-2/5">
          <div class="flex flex-col">
            <span class="text-base font-semibold text-textColor-primary mb-3"
              >Công việc sắp tới</span
            >
            <div class="flex flex-col"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
