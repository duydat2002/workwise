<script setup lang="ts">
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

const { user } = storeToRefs(useUserStore());
</script>

<template>
  <div>Index</div>
  <button>Logout</button>
  <p>{{ user?.email }}</p>
</template>
