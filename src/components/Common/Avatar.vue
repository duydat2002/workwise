<script setup lang="ts">
import UserIcon from "@icons/user.svg";
import { ref } from "vue";

withDefaults(
  defineProps<{
    avatarUrl?: string;
  }>(),
  { avatarUrl: "" }
);

const loading = ref(true);

const hanldeLoad = () => {
  loading.value = false;
};
</script>

<template>
  <div class="">
    <div
      v-if="avatarUrl && avatarUrl != ''"
      class="w-full h-full rounded-full overflow-hidden"
    >
      <div v-if="loading" class="w-full h-full skeleton"></div>
      <img
        class="object-cover block"
        v-show="!loading"
        :src="avatarUrl"
        alt=""
        @load="hanldeLoad"
      />
    </div>
    <div
      v-else
      class="relative w-full h-0 pt-[100%] rounded-full bg-primary-light"
    >
      <div class="absolute flex flex-center top-0 left-0 right-0 bottom-0">
        <UserIcon class="w-2/3 fill-white" />
      </div>
    </div>
  </div>
</template>
