<script setup lang="ts">
import { ref } from "vue";

const n = ref(3);
</script>

<template>
  <div class="h-full flex flex-col bg-purple-200">
    <div class="p-5 bg-green-200">
      <button
        @click="
          () => {
            n = n + 1;
          }
        "
      >
        Inc
      </button>
    </div>
    <div class="relative flex-1 h-full bg-orange-200 p-3">
      <div
        class="absolute top-0 left-0 right-0 flex h-full flex-nowrap bg-pink-200 not-lastchild:mr-3 overflow-x-auto"
      >
        <div
          v-for="i in n"
          :key="i"
          class="flex-shrink-0 w-[250px] h-full bg-blue-200"
        >
          <div class="flex flex-col h-full">
            <div class="p-3 bg-gray-200"></div>
            <div class="flex-1 h-full bg-red-200 overflow-y-auto">
              <div class="h-full bg-amber-200">
                <div class="h-[100px] bg-lime-300 mb-2"></div>
                <div class="h-[100px] bg-lime-300 mb-2"></div>
                <div class="h-[100px] bg-lime-300 mb-2"></div>
                <div class="h-[100px] bg-lime-300 mb-2"></div>
              </div>
            </div>
            <div class="p-3 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
