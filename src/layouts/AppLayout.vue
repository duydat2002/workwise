<script setup lang="ts">
import Header from "@/components/Layout/Header.vue";
import Sidebar from "@/components/Layout/Sidebar.vue";
import { onMounted } from "vue";

onMounted(() => {
  document.body.classList.add("no-scrollbar");
});
</script>

<template>
  <div class="w-full h-screen bg-bgColor-primary overflow-hidden">
    <div class="flex h-full">
      <Sidebar />
      <main class="flex-1 overflow-auto">
        <Header />
        <div class="mt-12">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
