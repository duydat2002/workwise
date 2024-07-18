<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import { formatDate } from "@/helpers";
import { acceptInviteProject, unacceptInviteProject } from "@/services/user";
import { useUserStore } from "@/stores";
import { INotification } from "@/types";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import Popper from "vue3-popper";

const props = defineProps<{
  notification: INotification;
}>();

const { user } = storeToRefs(useUserStore());

const isRead = computed(() =>
  props.notification.readBy.some((r) => r == user.value!.id)
);

const isShowButtons = computed(() => {
  return (
    props.notification.type == "invitation" &&
    !props.notification.respondedBy?.includes(user.value!.id)
  );
});

const content = computed(() => {
  const project = props.notification.datas.project;
  switch (props.notification.action) {
    case "invite_to_project":
      return `Đã mời bạn tham gia vào dự án <a href='/projects/${project._id}'>${project.name}</a>.`;
    default:
      return props.notification.action;
      break;
  }
});

const handleAccept = async () => {
  const project = props.notification.datas.project;

  switch (props.notification.action) {
    case "invite_to_project":
      await acceptInviteProject(
        project._id,
        props.notification.sender.id,
        props.notification.id
      );
      break;
    default:
      break;
  }
};

const handleDeny = async () => {
  const project = props.notification.datas.project;

  switch (props.notification.action) {
    case "invite_to_project":
      await unacceptInviteProject(
        project._id,
        props.notification.sender.id,
        props.notification.id
      );
      break;
    default:
      break;
  }
};
</script>

<template>
  <div
    class="px-4 py-2 mb-1"
    :class="[isRead ? 'bg-transparent' : 'bg-bgColor-secondary']"
  >
    <div class="px-2 py-2 flex flex-col bg-bgColor-primary rounded-md shadow">
      <div class="flex items-center pb-2 border-b border-borderColor">
        <div class="flex-1 flex items-center">
          <div
            class="w-8 h-6 bg-cover bg-center aspect-video mr-2"
            :style="{
              backgroundImage: `url(${notification.project?.background})`,
            }"
          ></div>
          <span
            class="text-sm font-semibold text-textColor-primary text-dots mr-2"
            >{{ notification.project?.name }}</span
          >
        </div>
        <Popper
          hover
          :content="isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'"
          offsetDistance="4"
        >
          <div
            class="w-6 h-6 flex flex-center rounded hover:bg-primary-extraLight active:bg-primary-extraLight cursor-pointer"
          >
            <div
              class="w-4 h-4 rounded-full border"
              :class="[
                isRead
                  ? 'border-primary-light bg-primary-light'
                  : 'border-borderColor',
              ]"
            ></div>
          </div>
        </Popper>
      </div>
      <div class="flex items-start mt-2">
        <div class="mr-2">
          <Avatar class="w-6" :avatarUrl="notification.sender.avatar" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-textColor-primary">{{
            notification.sender.fullname
          }}</span>
          <span
            class="text-sm text-textColor-primary py-1"
            v-html="content"
          ></span>
          <span class="text-xs text-textColor-secondary">{{
            formatDate(notification.createdAt)
          }}</span>
          <div v-if="isShowButtons" class="flex mt-1">
            <UButton
              class="mr-2"
              variantType="primary"
              size="small"
              @click="handleAccept"
              ><span class="text-sm">Chấp nhận</span></UButton
            >
            <UButton variant="outlined" size="small" @click="handleDeny"
              ><span class="text-sm">Từ chối</span></UButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(a) {
  color: var(--link-color);
}

:deep(a:hover) {
  text-decoration: underline;
}
</style>
