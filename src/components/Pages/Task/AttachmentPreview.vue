<script setup lang="ts">
import LeftIcon from "@icons/left.svg";
import RightIcon from "@icons/right.svg";
import XIcon from "@icons/x.svg";
import DownloadIcon from "@icons/downloads.svg";
import { IAttachment } from "@/types";
import { ref } from "vue";

const emit = defineEmits(["close"]);

const props = defineProps<{
  attachments: IAttachment[];
  attachment?: IAttachment;
}>();

const currentIndex = ref(0);
const currentAttachment = ref<IAttachment | null>(
  props.attachment || props.attachments[0] || null
);

const handleDownloadAttachment = async () => {
  if (currentAttachment.value) {
    const response = await fetch(currentAttachment.value.url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", currentAttachment.value.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  }
};

const handleNext = () => {
  if (currentIndex.value < props.attachments.length - 1) {
    currentIndex.value += 1;
    currentAttachment.value = props.attachments[currentIndex.value];
  }
};

const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    currentAttachment.value = props.attachments[currentIndex.value];
  }
};

const closePreview = () => {
  currentIndex.value = 0;
  currentAttachment.value = null;
  emit("close");
};
</script>

<template>
  <div
    v-if="currentAttachment"
    class="fixed top-0 left-0 w-full h-full bg-bgColor-primary z-50"
  >
    <div class="flex w-full h-full">
      <div class="flex-shrink-0 h-full flex flex-center px-3">
        <div
          class="w-8 h-8 rounded-full flex flex-center hover:bg-hover active:bg-hover cursor-pointer"
          :class="[
            currentIndex > 0
              ? 'cursor-pointer  bg-bgColor-secondary'
              : 'cursor-not-allowed bg-hover',
          ]"
          @click="handlePrev"
        >
          <LeftIcon class="w-5 fill-textColor-primary" />
        </div>
      </div>
      <div class="flex-1">
        <div
          v-if="currentAttachment.minetype.includes('image')"
          class="flex flex-col items-center"
        >
          <span
            class="text-center text-base font-semibold text-textColor-primary py-2"
            >{{ currentAttachment.name }}</span
          >
          <img class="" :src="currentAttachment.url" />
        </div>
        <iframe
          v-else
          class="w-full h-full"
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            currentAttachment.url
          )}`"
        />
      </div>
      <div class="relative flex-shrink-0 h-full flex flex-center px-3">
        <div
          class="w-8 h-8 rounded-full flex flex-center bg-bgColor-secondary hover:bg-hover active:bg-hover"
          :class="[
            currentIndex < attachments.length - 1
              ? 'cursor-pointer  bg-bgColor-secondary'
              : 'cursor-not-allowed bg-hover',
          ]"
          @click="handleNext"
        >
          <RightIcon class="w-5 fill-textColor-primary" />
        </div>
        <div class="absolute top-0 py-3">
          <div
            class="w-8 h-8 rounded-full flex flex-center bg-bgColor-secondary hover:bg-hover active:bg-hover cursor-pointer"
            @click="closePreview"
          >
            <XIcon class="w-3 fill-textColor-primary" />
          </div>
          <div
            class="my-2 w-8 h-8 rounded-full flex flex-center bg-bgColor-secondary hover:bg-hover active:bg-hover cursor-pointer"
            @click="handleDownloadAttachment"
          >
            <DownloadIcon class="w-3 fill-textColor-primary" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
