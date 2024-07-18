<script setup lang="ts">
import Header from "@/components/Layout/Header.vue";
import Sidebar from "@/components/Layout/Sidebar.vue";
import CreateProjectModal from "@/components/Modal/CreateProjectModal.vue";
import { useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const { showCreateProject } = storeToRefs(useProjectStore());

onMounted(() => {
  document.body.classList.add("no-scrollbar");
});
</script>

<template>
  <div class="w-full h-full bg-bgColor-primary overflow-hidden">
    <Header />
    <div class="flex h-[calc(100vh-48px)] mt-12">
      <Sidebar />
      <main class="flex-1 h-full overflow-x-hidden overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
  <CreateProjectModal
    v-if="showCreateProject"
    @close="
      () => {
        showCreateProject = false;
      }
    "
  />
</template>
