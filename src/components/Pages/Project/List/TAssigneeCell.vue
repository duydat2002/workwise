<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import { IUserInfo } from "@/types";
import Avatar from "@/components/Common/Avatar.vue";
import Popper from "vue3-popper";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const assignee = ref<IUserInfo | null>(props.params.value);
</script>

<template>
  <div v-if="assignee" class="flex items-center" :title="assignee?.email">
    <Avatar class="w-6 h-6 mr-1" :avatarUrl="assignee.avatar" />
    <span class="">{{ assignee.fullname }}</span>
  </div>
</template>
