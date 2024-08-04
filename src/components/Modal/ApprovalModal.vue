<script setup lang="ts">
import XIcon from "@icons/x.svg";
import LeftIcon from "@icons/left.svg";
import PlusIcon from "@icons/plus.svg";
import LoadingIcon from "@icons/loading.svg";
import Modal from "./Modal.vue";
import ApprovalItem from "@/components/Pages/Approval/ApprovalItem.vue";
import { computed, onMounted, ref } from "vue";
import { getTaskApprovals } from "@/services/approval";
import { storeToRefs } from "pinia";
import { useApprovalStore, useProjectStore } from "@/stores";
import CreateApproval from "@/components/Pages/Approval/CreateApproval.vue";
import { toast } from "vue3-toastify";
import EditApproval from "../Pages/Approval/EditApproval.vue";
import { IApproval } from "@/types";
import Popper from "vue3-popper";

const emit = defineEmits(["close"]);

const { task } = storeToRefs(useProjectStore());
const { approvals } = storeToRefs(useApprovalStore());

const approvalTab = ref<"list" | "create" | "edit">("list");
const approvalEdit = ref<IApproval>();
const isLoadingApprovals = ref(true);

const showCreateApproval = computed(() => {
  return (
    task.value?.status != "completed" &&
    approvals.value &&
    !approvals.value.some((a) => a.status == "pending")
  );
});

const handleClickEdit = (approval: IApproval) => {
  approvalEdit.value = approval;
  approvalTab.value = "edit";
};

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
  <Modal>
    <div
      class="flex flex-col w-full max-h-[calc(100vh-80px)] bg-bgColor-primary px-3 py-2 rounded-lg transition-all"
      :class="
        approvalTab != 'list'
          ? 'h-auto max-w-[400px]'
          : 'h-[calc(100vh-80px)] max-w-[600px]'
      "
    >
      <div class="relative flex flex-center mb-3">
        <div
          v-if="approvalTab != 'list'"
          class="group absolute left-0 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
          @click="
            () => {
              approvalTab = 'list';
            }
          "
        >
          <LeftIcon
            class="w-5 fill-textColor-secondary group-hover:fill-primary"
          />
        </div>
        <span class="text-base text-textColor-primary font-semibold">{{
          approvalTab == "list"
            ? "Phê duyệt"
            : approvalTab == "create"
            ? "Tạo phê duyệt"
            : "Sửa phê duyệt"
        }}</span>
        <div
          class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
          @click="closeModal"
        >
          <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
        </div>
      </div>
      <div class="flex flex-col transition-all">
        <div v-if="approvalTab == 'list'" class="flex flex-col">
          <div class="">
            <Popper
              hover
              :disabled="showCreateApproval && task?.status != 'completed'"
              :content="
                task?.status == 'completed'
                  ? 'Công việc đã hoàn thành không thể phê duyệt'
                  : 'Phê duyệt trước đó phải được phê duyệt'
              "
            >
              <div
                class="self-start py-2 px-2 flex items-center"
                :class="[
                  showCreateApproval
                    ? 'cursor-pointer hover:text-primary hover:fill-primary'
                    : 'cursor-not-allowed text-error fill-error',
                ]"
                @click="
                  () => {
                    if (showCreateApproval) approvalTab = 'create';
                  }
                "
              >
                <PlusIcon class="w-3" />
                <span class="ml-2 text-sm font-semibold">Tạo phê duyệt</span>
              </div>
            </Popper>
          </div>
          <div v-if="isLoadingApprovals" class="flex flex-center p-3">
            <LoadingIcon class="w-5 fill-textColor-secondary animate-spin" />
          </div>
          <ApprovalItem
            v-else
            v-for="approval in approvals"
            :key="approval.id"
            :approval
            @edit="handleClickEdit"
          />
        </div>
        <CreateApproval
          v-else-if="approvalTab == 'create'"
          @back="
            () => {
              approvalTab = 'list';
            }
          "
        />
        <EditApproval
          v-else
          :approval="approvalEdit!"
          @back="
            () => {
              approvalTab = 'list';
            }
          "
        />
      </div>
    </div>
  </Modal>
</template>
