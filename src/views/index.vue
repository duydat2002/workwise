<script setup lang="ts">
import { auth } from "@/plugins/firebase";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

const { user } = storeToRefs(useUserStore());

const cac = () => {
  console.log(auth.currentUser);
};
</script>

<template>
  <div>Index</div>
  <button @click="cac">Logout</button>
  <p>{{ user?.email }}</p>
</template>
