<script setup lang="ts">
import { computed, ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { ITask, IUserInfo } from "@/types";
import Avatar from "@/components/Common/Avatar.vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";

const props = defineProps<{
  params: ICellRendererParams<ITask>;
}>();

const { project } = storeToRefs(useProjectStore());

const assignee = ref<IUserInfo | null>(props.params.value);

const assigneeComp = computed(() => {
  const members = project.value?.members ?? [];
  return (
    assignee.value ?? members.find((m) => m.user.id == props.params.value)?.user
  );
});
</script>

<template>
  <div
    v-if="assigneeComp"
    class="flex items-center"
    :title="assigneeComp?.email"
  >
    <Avatar
      class="flex-shrink-0 w-6 h-6 mr-1"
      :avatarUrl="assigneeComp?.avatar"
    />
    <span class="">{{ assigneeComp?.fullname }}</span>
  </div>
</template>
