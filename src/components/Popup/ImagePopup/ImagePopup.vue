<script setup lang="ts">
import { BACKGROUND_TEMPLATES } from "@/constants/backgrounds";
import XIcon from "@icons/x.svg";

const emit = defineEmits(["choose", "close"]);

const handleChooseBackground = (url: string) => {
  emit("choose", url);
};

const closePopup = () => {
  emit("close");
};
</script>

<template>
  <div
    class="absolute left-0 right-0 top-0 mt-2 mx-auto p-3 w-[300px] max-h-[600px] bg-bgColor-primary shadow rounded-lg"
    v-click-outside.short="closePopup"
  >
    <div class="relative flex flex-center">
      <span class="text-base text-textColor-primary font-semibold"
        >Ảnh bìa mẫu</span
      >
      <div
        class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
        @click="closePopup"
      >
        <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
      </div>
    </div>
    <div class="mt-3 grid grid-cols-3 -mx-1">
      <div v-for="url in BACKGROUND_TEMPLATES" :key="url" class="m-1">
        <div
          class="rounded overflow-hidden bg-cover bg-center aspect-video border-2 border-bgColor-secondary hover:border-primary cursor-pointer"
          :style="{
            backgroundImage: `url(${url})`,
          }"
          @click="handleChooseBackground(url)"
        ></div>
      </div>
    </div>
  </div>
</template>
