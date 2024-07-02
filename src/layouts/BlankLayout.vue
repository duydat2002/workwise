<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  document.body.classList.remove("no-scrollbar");
});
</script>

<template>
  <slot />
</template>
