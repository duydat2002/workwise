<script setup lang="ts">
import XIcon from "@icons/x.svg";
import LeftIcon from "@icons/left.svg";
import PlusIcon from "@icons/plus.svg";
import LoadingIcon from "@icons/loading.svg";
import Modal from "./Modal.vue";
import ApprovalItem from "@/components/Pages/Approval/ApprovalItem.vue";
import { onMounted, ref } from "vue";
import { getTaskApprovals } from "@/services/approval";
import { storeToRefs } from "pinia";
import { useApprovalStore, useProjectStore } from "@/stores";
import CreateApproval from "@/components/Pages/Approval/CreateApproval.vue";
import { toast } from "vue3-toastify";

const emit = defineEmits(["close"]);

const { task } = storeToRefs(useProjectStore());
const { approvals } = storeToRefs(useApprovalStore());

const showCreateApproval = ref(false);
const isLoadingApprovals = ref(true);

const closeModal = () => {
  emit("close");
};

onMounted(async () => {
  const data = await getTaskApprovals(task.value?.id ?? "1");

  if (data.success) {
    approvals.value = data.result!.approvals;
  } else {
    approvals.value = [];
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }

  isLoadingApprovals.value = false;
});
</script>

<template>
  <Modal @click-outside="closeModal">
    <div
      class="flex flex-col w-full max-h-[calc(100vh-80px)] bg-bgColor-primary px-3 py-2 rounded-lg transition-all"
      :class="
        showCreateApproval
          ? 'h-auto max-w-[400px]'
          : 'h-[calc(100vh-80px)] max-w-[600px]'
      "
    >
      <div class="relative flex flex-center mb-3">
        <div
          v-if="showCreateApproval"
          class="group absolute left-0 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
          @click="
            () => {
              showCreateApproval = false;
            }
          "
        >
          <LeftIcon
            class="w-5 fill-textColor-secondary group-hover:fill-primary"
          />
        </div>
        <span class="text-base text-textColor-primary font-semibold">{{
          showCreateApproval ? "Tạo phê duyệt" : "Phê duyệt"
        }}</span>
        <div
          class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
          @click="closeModal"
        >
          <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
        </div>
      </div>
      <div class="flex flex-col transition-all">
        <div v-if="!showCreateApproval" class="flex flex-col">
          <div
            class="group self-start py-2 px-2 flex items-center cursor-pointer"
            @click="
              () => {
                showCreateApproval = true;
              }
            "
          >
            <PlusIcon
              class="w-3 fill-textColor-secondary group-hover:fill-primary"
            />
            <span
              class="ml-2 text-sm font-semibold text-textColor-subtitle group-hover:text-primary"
              >Tạo phê duyệt</span
            >
          </div>
          <div v-if="isLoadingApprovals" class="flex flex-center p-3">
            <LoadingIcon class="w-5 fill-textColor-secondary animate-spin" />
          </div>
          <ApprovalItem
            v-else
            v-for="approval in approvals"
            :key="approval.id"
            :approval
          />
        </div>
        <CreateApproval
          v-else
          @back="
            () => {
              showCreateApproval = false;
            }
          "
        />
      </div>
    </div>
  </Modal>
</template>
