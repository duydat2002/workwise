<script setup lang="ts">
import UploadIcon from "@icons/upload.svg";
import LeftIcon from "@icons/left.svg";
import RightIcon from "@icons/right.svg";
import LoadingIcon from "@icons/loading.svg";
import XIcon from "@icons/x.svg";
import DownloadIcon from "@icons/downloads.svg";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores";
import { ref } from "vue";
import { IAttachment, ITask } from "@/types";
import { toast } from "vue3-toastify";
import { addTaskAttachment } from "@/services/attachment";
import AttachmentItem from "./AttachmentItem.vue";

const props = defineProps<{
  task: ITask;
  hasPermission: boolean | null;
}>();

const { user } = storeToRefs(useUserStore());

const inputAttachmentRef = ref<HTMLInputElement>();
const showPreview = ref(false);
const isLoading = ref(false);
const currentIndex = ref(0);
const currentAttachment = ref<IAttachment | null>(null);

const getInputAttachments = async (event: Event) => {
  isLoading.value = true;
  const files = (event.target as HTMLInputElement).files!;

  let check = false;
  if (files && files.length > 0) {
    const formData = new FormData();

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước tài liệu vượt quá 10MB!");
      } else {
        const newFile = new File([file], encodeURIComponent(file.name), {
          type: file.type,
        });
        formData.append("files", newFile);
        check = true;
      }
    }

    if (check) {
      const data = await addTaskAttachment(props.task.id, formData);

      if (data.success) {
        toast.success("Tải lên tài liệu thành công.");
      } else {
        toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
      }
    }
    isLoading.value = false;
  }
};

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

const handleClickAttachment = (attachment: IAttachment, index: number) => {
  showPreview.value = true;
  currentAttachment.value = attachment;
  currentIndex.value = index;
};

const handleNext = () => {
  const attachments = props.task.attachments;
  if (currentIndex.value < attachments.length - 1) {
    currentIndex.value += 1;
    currentAttachment.value = attachments[currentIndex.value];
  }
};

const handlePrev = () => {
  const attachments = props.task.attachments;
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    currentAttachment.value = attachments[currentIndex.value];
  }
};

const closePreview = () => {
  showPreview.value = false;
  currentIndex.value = 0;
  currentAttachment.value = null;
};
</script>

<template>
  <label class="mb-1 text-sm font-bold text-textColor-subtitle"
    >Tài liệu đính kèm
  </label>
  <div
    class="relative py-3 px-2 flex flex-col border rounded-md border-dashed border-borderColor"
  >
    <div v-if="isLoading" class="flex flex-center py-2">
      <LoadingIcon class="w-4 h-4 fill-textColor-primary animate-spin" />
      <span class="text-textColor-secondary ml-2">Đang tải lên tài liệu</span>
    </div>
    <div class="flex flex-col z-30">
      <AttachmentItem
        v-for="(attachment, index) in task.attachments"
        :key="attachment.id"
        :attachment
        @click="handleClickAttachment(attachment, index)"
      />
    </div>
    <div class="group p-2 flex w-full flex-center cursor-pointer">
      <UploadIcon
        class="group-hover:fill-primary w-4 fill-textColor-primary mr-2"
      />
      <span class="text-textColor-primary group-hover:text-primary"
        >Tải tệp hoặc tải lên tại đây</span
      >
      <input
        v-if="hasPermission"
        ref="inputAttachmentRef"
        type="file"
        name="attachments"
        multiple
        class="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
        @change="getInputAttachments"
      />
    </div>
  </div>
  <div
    v-if="showPreview && currentAttachment"
    class="fixed top-0 left-0 w-full h-full bg-bgColor-primary z-50"
  >
    <div class="flex w-full h-full">
      <div class="flex-shrink-0 h-full flex flex-center px-3">
        <div
          class="w-8 h-8 rounded-full flex flex-center bg-bgColor-secondary hover:bg-hover active:bg-hover cursor-pointer"
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
          class="w-8 h-8 rounded-full flex flex-center bg-bgColor-secondary hover:bg-hover active:bg-hover cursor-pointer"
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
