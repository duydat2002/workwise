<script setup lang="ts">
import ExitIcon from "@icons/exit.svg";
import USelect from "@/components/UI/USelect.vue";
import Avatar from "@/components/Common/Avatar.vue";
import { useProjectStore, useUserStore } from "@/stores";
import { IMember } from "@/types";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import {
  changeProjectMemberRole,
  deleteProjectMember,
} from "@/services/project";
import { leaveProject } from "@/services/user";

const props = defineProps<{
  member: IMember;
  isWaitForAccept?: boolean;
}>();

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());

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

const handleChangeRole = async () => {
  await changeProjectMemberRole(
    project.value!.id,
    props.member.user.id,
    props.member.role
  );
};

const handleLeftProject = async () => {
  if (isUser.value) {
    await leaveProject(project.value!.id);
  } else {
    await deleteProjectMember(project.value!.id, props.member.user.id);
  }
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
    v-if="isAdmin || isUser"
    class="flex flex-center w-8 h-8 bg-bgColor-secondary rounded-md hover:bg-hover cursor-pointer"
    :title="isUser ? 'Rời khỏi dự án' : 'Xóa khỏi dự án'"
    @click="handleLeftProject"
  >
    <ExitIcon class="w-4 fill-textColor-primary" />
  </div>
</template>
