<script setup lang="ts">
import SearchIcon from "@icons/search.svg";
import { ref, computed } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { storeToRefs } from "pinia";
import { useProjectStore, useUserStore } from "@/stores";
import UInput from "@/components/UI/UInput.vue";
import { IMember, IUserInfo } from "@/types";
import Avatar from "@/components/Common/Avatar.vue";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());
const assignee = ref<IUserInfo | null>(props.params.value);

const searchAssignee = ref("");

const members = computed(() => {
  return (
    project.value?.members.filter(
      (m) =>
        (m.user.fullname.includes(searchAssignee.value.trim()) ||
          m.user.email.includes(searchAssignee.value.trim())) &&
        m.status == "accepted"
    ) ?? []
  );
});

const handleChooseAssignee = async (member?: IMember) => {
  console.log(member);
  assignee.value = member?.user as IUserInfo;
  props.params.api.stopEditing();
};

const getValue = () => {
  return assignee.value;
};
</script>

<template>
  <div class="absolute top-full left-0 min-w-full w-[250px] pt-1 z-10">
    <div
      class="flex flex-col px-2 py-3 bg-bgColor-primary rounded shadow overflow-hidden z-10"
    >
      <UInput
        v-model:propValue="searchAssignee"
        placeholder="Tìm người thực hiện"
        padding="px-2 py-1 min-h-auto"
      >
        <template #left>
          <SearchIcon class="w-4 flex-shrink-0 fill-textColor-secondary" />
        </template>
      </UInput>
      <div class="flex flex-col max-h-[200px] overflow-y-auto scroll-vert mt-3">
        <div
          class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
          @click="handleChooseAssignee()"
        >
          <Avatar class="w-6 mr-2 flex-shrink-0" />
          <span class="text-dots font-medium"> Không chỉ định </span>
        </div>
        <div
          v-for="member in members"
          :key="member.id"
          class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
          @click="handleChooseAssignee(member)"
        >
          <Avatar
            class="w-6 mr-2 flex-shrink-0"
            :avatarUrl="member.user.avatar"
          />
          <div class="flex flex-col">
            <span class="text-sm text-textColor-primary font-medium text-dots"
              >{{ member.user.fullname
              }}{{ user!.id == member.user.id ? " (bạn)" : "" }}</span
            >
            <span class="text-sm text-textColor-secondary text-dots">{{
              member.user.email
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
