<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useAuth } from "./composables";
import { useThemeStore, useResizeStore } from "./stores";
import { debounce } from "./helpers";

const route = useRoute();
const { getGoogleRedirectResult } = useAuth();
const { setDimensions } = useResizeStore();
const { initTheme } = useThemeStore();

const hanldeResize = () => {
  debounce(() => {
    setDimensions(window.innerWidth, window.innerHeight);
  }, 150);
};

onMounted(async () => {
  initTheme();
  hanldeResize();
  window.addEventListener("resize", hanldeResize);
  await getGoogleRedirectResult();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", hanldeResize);
});
</script>

<template>
  <KeepAlive>
    <component :is="route.meta.layout || 'div'">
      <RouterView />
      <!-- <RouterView name="modal"></RouterView> -->
    </component>
  </KeepAlive>
</template>
