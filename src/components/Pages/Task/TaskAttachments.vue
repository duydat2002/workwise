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
import AttachmentPreview from "./AttachmentPreview.vue";

const props = defineProps<{
  task: ITask;
  hasPermission: boolean | null;
}>();

const { user } = storeToRefs(useUserStore());

const inputAttachmentRef = ref<HTMLInputElement>();
const showPreview = ref(false);
const isLoading = ref(false);
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

const handleClickAttachment = (attachment: IAttachment, index: number) => {
  showPreview.value = true;
  currentAttachment.value = attachment;
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
        v-if="!task.isArchived && !task.project.isArchived"
        ref="inputAttachmentRef"
        type="file"
        name="attachments"
        multiple
        class="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
        @change="getInputAttachments"
      />
    </div>
  </div>
  <AttachmentPreview
    v-if="showPreview"
    :attachments="task.attachments"
    :previewAttachment="currentAttachment"
    @close="
      () => {
        showPreview = false;
        currentAttachment = null;
      }
    "
  />
</template>
