<script setup lang="ts">
import ExitIcon from "@icons/exit.svg";
import USelect from "@/components/UI/USelect.vue";
import Avatar from "@/components/Common/Avatar.vue";
import { useProjectStore, useUserStore } from "@/stores";
import { IMember } from "@/types";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import {
  changeProjectMemberRole,
  deleteProjectMember,
} from "@/services/project";
import { leaveProject } from "@/services/user";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import Popper from "vue3-popper";
import { toast } from "vue3-toastify";

const props = defineProps<{
  hasOneAdmin: boolean;
  hasOneMember: boolean;
  member: IMember;
  isWaitForAccept?: boolean;
}>();

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());

const isLoadingLeave = ref(false);
const showLeaveConfirm = ref(false);

const roleOptions = computed(() => {
  if (isUser.value && hasAtLeastOneAdmin.value) {
    return [
      { key: "admin", value: "Quản lý" },
      { key: "member", value: "Thành viên", disabled: true },
    ];
  } else {
    return [
      { key: "admin", value: "Quản lý" },
      { key: "member", value: "Thành viên" },
    ];
  }
});
const isUser = computed(() => props.member.user.id == user.value!.id);
const isAdmin = computed(() =>
  project.value!.members.some(
    (m) => m.user.id == user.value!.id && m.role == "admin"
  )
);
const hasAtLeastOneAdmin = computed(
  () =>
    project.value!.members.filter(
      (m) => m.role == "admin" && m.status == "accepted"
    ).length <= 1
);

const confirmText = computed(() => {
  if (isUser.value) {
    return {
      title: `Rời khỏi dự án?`,
      desc: `Bạn sẽ bị loại bỏ khỏi dự án và toàn bộ công việc trong dự án này.`,
      confirm: "Rời",
    };
  } else {
    return {
      title: `Xóa khỏi dự án?`,
      desc: `${props.member.user.fullname} sẽ bị loại bỏ khỏi dự án và toàn bộ công việc trong dự án này.`,
      confirm: "Xóa",
    };
  }
});

const showLeave = computed(() => {
  if (isUser.value) {
    if (isAdmin.value) {
      return !props.hasOneAdmin;
    } else {
      return !props.hasOneMember;
    }
  } else {
    return isAdmin.value;
  }
});

const handleChangeRole = async () => {
  await changeProjectMemberRole(
    project.value!.id,
    props.member.user.id,
    props.member.role
  );
};

const handleLeftProject = async () => {
  isLoadingLeave.value = true;
  let data;
  const memberName = props.member.user.fullname;
  if (isUser.value) {
    data = await leaveProject(project.value!.id);
  } else {
    data = await deleteProjectMember(project.value!.id, props.member.user.id);
  }

  if (data?.success) {
    toast.success(
      isUser.value
        ? "Bạn đã rời khỏi dự án."
        : `Bạn đã xóa ${memberName} khởi dự án.`
    );
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
  isLoadingLeave.value = false;
};
</script>

<template>
  <div class="flex items-center flex-1 mr-2">
    <Avatar class="w-8" :avatarUrl="member.user.avatar" />
    <div class="ml-2 flex flex-col">
      <span class="text-sm text-textColor-primary font-medium"
        >{{ member.user.fullname }}
        {{
          member.user.id == user!.id
            ? " (bạn)"
            : isWaitForAccept
            ? " (chờ chấp nhận)"
            : ""
        }}</span
      >
      <span class="text-sm text-textColor-secondary">{{
        member.user.email
      }}</span>
    </div>
  </div>
  <div class="flex-shrink-0 mr-2">
    <USelect
      class="min-h-8"
      v-model:selected="member.role"
      :options="roleOptions"
      :isDisabled="!isAdmin"
      @change="handleChangeRole"
    />
  </div>
  <div
    v-if="showLeave"
    class="flex flex-center w-8 h-8 bg-bgColor-secondary rounded-md hover:bg-hover cursor-pointer"
    :title="isUser ? 'Rời khỏi dự án' : 'Xóa khỏi dự án'"
    @click="
      () => {
        showLeaveConfirm = true;
      }
    "
  >
    <ExitIcon class="w-4 fill-textColor-primary" />
  </div>
  <ConfirmPopup
    v-if="showLeaveConfirm"
    id="confirm_leave_project"
    :confirmMessage="confirmText.confirm"
    :title="confirmText.title"
    :desc="confirmText.desc"
    :isLoadingConfirm="isLoadingLeave"
    @confirm="handleLeftProject"
    @cancel="
      () => {
        showLeaveConfirm = false;
      }
    "
  ></ConfirmPopup>
</template>
