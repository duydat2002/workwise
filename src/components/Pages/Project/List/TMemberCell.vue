<script setup lang="ts">
import { ref } from "vue";
import { ICellRendererParams } from "ag-grid-community";
import Avatar from "@/components/Common/Avatar.vue";
import { IUserInfo } from "@/types";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const member = ref<IUserInfo | null>(props.params.value);
</script>

<template>
  <div class="flex items-center" :title="member?.email">
    <Avatar class="w-6 h-6 mr-1 flex-shrink-0" :avatarUrl="member?.avatar" />
    <span class="">{{ member?.fullname ?? "Chưa giao" }}</span>
  </div>
</template>
