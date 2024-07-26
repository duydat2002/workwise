<script setup lang="ts">
import DocumentIcon from "@icons/document.svg";
import Avatar from "@/components/Common/Avatar.vue";
import { dateDistanceToNow } from "@/helpers";
import { IAttachment } from "@/types";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import { ref } from "vue";
import { deleteTaskAttachment } from "@/services/attachment";
import { toast } from "vue3-toastify";

const emit = defineEmits(["click"]);

const props = defineProps<{
  attachment: IAttachment;
}>();

const isLoadingAction = ref(false);
const showDeleteAttachment = ref(false);

const handleDeleteAttachment = async () => {
  isLoadingAction.value = true;

  const data = await deleteTaskAttachment(props.attachment.id);
  if (data.success) {
    toast.success("Xóa tài liệu thành công.");
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }

  isLoadingAction.value = false;
};

const handleDownloadAttachment = async () => {
  isLoadingAction.value = true;

  const response = await fetch(props.attachment.url);
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", props.attachment.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);

  isLoadingAction.value = false;
};

const handleClick = () => {
  emit("click");
};
</script>

<template>
  <div
    class="flex h-[100px] items-center p-2 bg-bgColor-primary hover:bg-hover active:bg-hover rounded-lg overflow-hidden cursor-pointer"
    @click="handleClick"
  >
    <div
      class="flex-shrink-0 w-[120px] flex flex-center h-full bg-bgColor-secondary mr-3"
    >
      <img
        v-if="attachment.minetype.includes('image')"
        class=""
        :src="attachment.url"
      />
      <DocumentIcon v-else class="w-8 fill-textColor-primary" />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <span
        class="font-semibold text-textColor-primary line-clamp-2 text-ellipsis break-all"
        >{{ attachment.name }}</span
      >
      <div class="flex py-1">
        <Avatar class="w-5 h-5 mr-2" :avatarUrl="attachment.createdBy.avatar" />
        <span class="text-textColor-secondary text-xs"
          >Đã thêm {{ dateDistanceToNow(attachment.createdAt) }}
        </span>
      </div>
      <div class="flex flex-wrap text-xs">
        <span
          class="underline text-textColor-secondary hover:text-primary active:text-primary cursor-pointer"
          @click.stop="handleDownloadAttachment"
          >Tải xuống</span
        >
        <span class="mx-1">•</span>
        <span
          class="underline text-textColor-secondary hover:text-primary active:text-primary cursor-pointer"
          @click.stop="
            () => {
              showDeleteAttachment = true;
            }
          "
          >Xóa</span
        >
      </div>
    </div>
  </div>
  <ConfirmPopup
    v-if="showDeleteAttachment"
    id="confirm_delete_attachment"
    title="Xóa tài liệu?"
    confirmMessage="Xóa"
    desc="Tài liệu sẽ bị xóa. Không thể hoàn tác."
    :isLoadingConfirm="isLoadingAction"
    @confirm="handleDeleteAttachment"
    @cancel="
      () => {
        showDeleteAttachment = false;
      }
    "
  ></ConfirmPopup>
</template>
