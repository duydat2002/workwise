<script setup lang="ts">
import XIcon from "@icons/x.svg";
import CheckIcon from "@icons/check.svg";
import RightIcon from "@icons/right.svg";
import DescIcon from "@icons/list.svg";
import ClockIcon from "@icons/clock-o.svg";
import EditIcon from "@icons/edit.svg";
import DeleteIcon from "@icons/delete.svg";
import AttachIcon from "@icons/attach.svg";
import QuestionIcon from "@icons/question.svg";
import Avatar from "@/components/Common/Avatar.vue";
import Popper from "vue3-popper";
import { ref } from "vue";
import { IApproval, IAttachment } from "@/types";
import { formatDate } from "@/helpers";
import AttachmentPreview from "../Task/AttachmentPreview.vue";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import { deleteTaskApproval } from "@/services/approval";
import { toast } from "vue3-toastify";
import { storeToRefs } from "pinia";
import { useApprovalStore, useUserStore } from "@/stores";

const emit = defineEmits(["close", "edit"]);

const props = defineProps<{
  approval: IApproval;
}>();

const { user } = storeToRefs(useUserStore());
const { approvals } = storeToRefs(useApprovalStore());

const previewAttachment = ref<IAttachment>();
const isShowPreview = ref(false);
const showDetail = ref(false);
const showDeleteApproval = ref(false);
const isLoadingDelete = ref(false);

const handleDeleteApproval = async () => {
  const data = await deleteTaskApproval(props.approval.id);

  if (data.success) {
    toast.success("Xóa phê duyệt thành công.");
    approvals.value = approvals.value.filter((a) => a.id != props.approval.id);
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
};

const handleEdit = () => {
  emit("edit", props.approval);
};
</script>

<template>
  <div class="flex flex-col mb-2">
    <div
      class="flex items-center p-2 rounded-md bg-bgColor-secondary hover:bg-primary-extraLight cursor-pointer"
      @click="
        () => {
          showDetail = !showDetail;
        }
      "
    >
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
        <Popper hover offsetDistance="8" content="Phê duyệt lúc">
          <div
            v-if="approval.approvedAt"
            class="px-1 py-[2px] flex items-center rounded mr-2"
            :class="
              approval.status == 'approved'
                ? 'bg-green-200 text-green-500 fill-green-500'
                : 'bg-red-200 text-red-500 fill-red-500'
            "
          >
            <ClockIcon class="w-3 mr-1" />
            <span class="text-xs">{{
              formatDate(approval.approvedAt, "dd/MM/yyyy, HH:mm")
            }}</span>
          </div>
        </Popper>
      </div>
      <div class="flex flex-1 px-2 gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-textColor-secondary mr-1"
            >Người phê duyệt:</span
          >
          <Popper
            hover
            offsetDistance="8"
            :content="`${approval.reviewedBy.fullname} (${approval.reviewedBy.email})`"
          >
            <Avatar class="w-6 h-6" :avatarUrl="approval.reviewedBy.avatar" />
          </Popper>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-textColor-secondary mr-1">Người tạo:</span>
          <Popper
            hover
            offsetDistance="8"
            :content="`${approval.requestedBy.fullname} (${approval.requestedBy.email})`"
          >
            <Avatar class="w-6 h-6" :avatarUrl="approval.requestedBy.avatar" />
          </Popper>
        </div>
        <div class="flex items-center ml-2">
          <Popper hover offsetDistance="8" content="Có mô tả">
            <div
              v-if="approval.description != ''"
              class="h-6 flex flex-center mr-2"
            >
              <DescIcon class="w-4 fill-textColor-primary" />
            </div>
          </Popper>
          <Popper hover offsetDistance="8" content="Tài liệu đính kèm">
            <div
              v-if="approval.attachments.length > 0"
              class="h-6 flex flex-center"
            >
              <AttachIcon class="w-4 fill-textColor-primary" />
              <span class="text-textColor-secondary">{{
                approval.attachments.length
              }}</span>
            </div>
          </Popper>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <template v-if="approval.status == 'pending'">
          <div
            v-if="user?.id == approval.requestedBy.id"
            class="w-6 h-6 flex flex-center cursor-pointer"
            @click="handleEdit"
          >
            <EditIcon class="w-4 fill-textColor-primary hover:fill-primary" />
          </div>
          <div
            class="w-6 h-6 flex flex-center cursor-pointer"
            @click.stop="
              () => {
                showDeleteApproval = true;
              }
            "
          >
            <DeleteIcon class="w-5 fill-textColor-primary hover:fill-error" />
          </div>
        </template>
        <div class="w-6 h-6 flex flex-center cursor-pointer">
          <RightIcon
            class="w-5 fill-textColor-primary transition-all"
            :class="{ 'rotate-90': showDetail }"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDetail" class="flex flex-col p-2">
    <div v-if="approval.status != 'pending'" class="flex mb-2">
      <Popper
        hover
        offsetDistance="8"
        :content="`${approval.reviewedBy.fullname} (${approval.reviewedBy.email})`"
      >
        <Avatar class="w-6 h-6" :avatarUrl="approval.reviewedBy.avatar" />
      </Popper>
      <div class="flex flex-col ml-2">
        <div class="flex items-center">
          <span class="font-medium text-textColor-primary mr-2">{{
            approval.reviewedBy.fullname
          }}</span>
          <span class="text-xs text-textColor-secondary">{{
            formatDate(approval.approvedAt!, "dd/MM/yyyy, HH:mm")
          }}</span>
        </div>
        <div class="flex">
          <span class="text-xs text-textColor-secondary mr-1"
            >Đã phê duyệt:</span
          >
          <span
            class="text-sm font-medium uppercase"
            :class="[
              approval.status == 'approved' ? 'text-green-500' : 'text-error',
            ]"
            >{{ approval.status == "approved" ? "Đồng ý" : "Từ chối" }}</span
          >
        </div>
        <div v-if="approval.feedback != ''" class="flex flex-col mt-1">
          <span class="text-xs text-textColor-secondary">Phản hồi</span>
          <span class="text-textColor-primary">{{ approval.feedback }}</span>
        </div>
      </div>
    </div>
    <div class="flex">
      <Popper
        hover
        offsetDistance="8"
        :content="`${approval.requestedBy.fullname} (${approval.requestedBy.email})`"
      >
        <Avatar class="w-6 h-6" :avatarUrl="approval.requestedBy.avatar" />
      </Popper>
      <div class="flex flex-col ml-2">
        <div class="flex items-center">
          <span class="font-medium text-textColor-primary mr-2">{{
            approval.requestedBy.fullname
          }}</span>
          <span class="text-xs text-textColor-secondary">{{
            formatDate(approval.createdAt, "dd/MM/yyyy, HH:mm")
          }}</span>
        </div>
        <span class="pb-1 text-xs text-textColor-secondary"
          >Đã tạo phê duyệt</span
        >
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
      </div>
    </div>
  </div>
  <ConfirmPopup
    v-if="showDeleteApproval"
    id="confirm_delete_approval"
    title="Xóa phê duyệt?"
    confirmMessage="Xóa"
    desc="Tất cả mọi tài liệu, hành động liên quan sẽ bị xóa. Không thể hoàn tác."
    :isLoadingConfirm="isLoadingDelete"
    @confirm="handleDeleteApproval"
    @cancel="
      () => {
        showDeleteApproval = false;
      }
    "
  ></ConfirmPopup>
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
</template>
