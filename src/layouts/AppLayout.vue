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
    <Header />
    <div class="flex h-full pt-12">
      <Sidebar />
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
