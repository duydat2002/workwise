<script setup lang="ts">
import SidebarRight from "@/components/Layout/SidebarRight.vue";

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <SidebarRight title="Lịch sử hoạt động" @close="handleClose"> </SidebarRight>
</template>
