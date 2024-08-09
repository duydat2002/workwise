<script setup lang="ts">
import { IApproval, IAttachment } from "@/types";
import XIcon from "@icons/x.svg";
import CheckIcon from "@icons/check.svg";
import QuestionIcon from "@icons/question.svg";
import UButton from "@/components/UI/UButton.vue";
import AttachmentPreview from "./AttachmentPreview.vue";
import { ref } from "vue";
import { acceptTaskAproval, rejectTaskAproval } from "@/services/approval";
import Popper from "vue3-popper";
import UTextarea from "@/components/UI/UTextarea.vue";
import { toast } from "vue3-toastify";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores";

const props = defineProps<{
  approval: IApproval;
}>();

const { user } = storeToRefs(useUserStore());

const feedbackRef = ref<InstanceType<typeof UTextarea>>();
const previewAttachment = ref<IAttachment>();
const feedback = ref("");
const isLoading = ref(false);
const isShowFeedback = ref(false);
const isShowPreview = ref(false);

const handleAcceptApproval = async () => {
  isLoading.value = true;
  const data = await acceptTaskAproval(props.approval.id, feedback.value);
  if (data.success) {
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
  isLoading.value = false;
  isShowFeedback.value = false;
};

const handleRejectApproval = async () => {
  isLoading.value = true;
  const data = await rejectTaskAproval(props.approval.id, feedback.value);
  if (data.success) {
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
  isLoading.value = false;
  isShowFeedback.value = false;
};

const focusFeedBack = () => {
  isShowFeedback.value = true;
  feedback.value = "";
  setTimeout(() => {
    feedbackRef.value!.focusTextarea();
  }, 100);
};
</script>

<template>
  <div class="flex flex-col py-2 rounded-lg bg-bgColor-secondary">
    <div class="flex">
      <div class="w-6 h-6 flex flex-center mr-2">
        <QuestionIcon
          v-if="approval.status == 'pending'"
          class="w-5 fill-textColor-primary"
        />
        <CheckIcon
          v-else-if="approval.status == 'approved'"
          class="w-4 fill-green-500"
        />
        <XIcon v-else class="w-4 fill-red-500" />
      </div>
      <div class="flex flex-col">
        <span
          class="font-semibold w-[100px]"
          :class="[
            approval.status == 'pending'
              ? 'text-textColor-primary'
              : approval.status == 'approved'
              ? 'text-green-500'
              : 'text-red-500',
          ]"
          >{{
            approval.status == "pending" ? "Chờ phê duyệt" : "Đã phê duyệt"
          }}</span
        >
      </div>
    </div>
    <div class="ml-8">
      <div v-if="approval.description" class="flex flex-col mt-1">
        <span class="text-xs text-textColor-secondary">Mô tả</span>
        <span class="text-textColor-primary">{{ approval.description }}</span>
      </div>
      <div v-if="approval.attachments.length > 0" class="flex flex-col mt-1">
        <span class="text-xs text-textColor-secondary">Tài liệu</span>
        <span
          v-for="attachment in approval.attachments"
          :key="attachment.id"
          class="text-textColor-primary hover:text-primary underline cursor-pointer"
          @click="
            () => {
              previewAttachment = attachment;
              isShowPreview = true;
            }
          "
          >{{ attachment.name }}</span
        >
      </div>
      <div
        v-if="approval?.reviewedBy?.id == user?.id"
        class="flex items-center mt-2"
      >
        <Popper :disabled="!isShowFeedback">
          <UButton class="mr-2" variantType="primary" @click="focusFeedBack"
            ><span class="">Đồng ý</span></UButton
          >
          <template #content>
            <div
              class="w-[400px] p-2 flex flex-col bg-bgColor-primary rounded-lg shadow"
            >
              <UTextarea
                class="text-textColor-primary"
                ref="feedbackRef"
                v-model:value="feedback"
                name="feedback"
                placement="Nhập nhận xét..."
                :height="100"
              />
              <UButton
                class="mt-2 self-end"
                variantType="primary"
                :isLoading
                @click="handleAcceptApproval"
                ><span class="">Đồng ý</span></UButton
              >
            </div>
          </template>
        </Popper>
        <Popper :disabled="!isShowFeedback">
          <UButton variantType="error" @click="focusFeedBack"
            ><span class="">Từ chối</span></UButton
          >
          <template #content>
            <div
              class="w-[400px] p-2 flex flex-col bg-bgColor-primary rounded-lg shadow"
            >
              <UTextarea
                class="text-textColor-primary"
                ref="feedbackRef"
                v-model:value="feedback"
                name="feedback"
                placement="Nhập nhận xét..."
                :height="100"
              />
              <UButton
                class="mt-2 self-end"
                variantType="error"
                :isLoading
                @click="handleRejectApproval"
                ><span class="">Từ chối</span></UButton
              >
            </div>
          </template>
        </Popper>
      </div>
    </div>
    <AttachmentPreview
      v-if="isShowPreview"
      :attachments="approval.attachments"
      :previewAttachment
      @close="
        () => {
          isShowPreview = false;
          previewAttachment = undefined;
        }
      "
    />
  </div>
</template>

<style scoped>
:deep(.popper) {
  background: transparent !important;
}
</style>
