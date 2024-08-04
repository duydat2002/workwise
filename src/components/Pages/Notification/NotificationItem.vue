<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import { formatDate } from "@/helpers";
import {
  acceptInviteProject,
  readNotification,
  unacceptInviteProject,
  unreadNotification,
} from "@/services/user";
import { useUserStore } from "@/stores";
import { INotification, IProject, ITask } from "@/types";
import { cloneDeep } from "lodash";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";
import Popper from "vue3-popper";
import { toast } from "vue3-toastify";

const props = defineProps<{
  notification: INotification;
}>();

const router = useRouter();

const { updateNotification } = useUserStore();
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

const projectRender = (project: IProject) => {
  return `<a class='link' href='/projects/${project.id}'>${project.name}</a>`;
};

const taskRender = (project: IProject, task: ITask) => {
  return `<a class='link' href='/projects/${project.id}?taskSelected=${task.id}'>${task.name}</a>`;
};

const content = computed(() => {
  const project =
    props.notification.datas.project ?? props.notification.project;
  const task = props.notification.datas.task;
  const approval = props.notification.datas.approval;
  switch (props.notification.action) {
    case "invite_to_project":
      return `Đã mời bạn tham gia vào dự án ${projectRender(project)}.`;
    case "accept_join_project":
      return `Đã tham gia vào dự án ${projectRender(project)}.`;
    case "unaccept_join_project":
      return `Đã từ chối tham gia vào dự án ${projectRender(project)}.`;
    case "left_project":
      return `Đã rời khỏi dự án ${projectRender(project)}.`;
    case "was_kicked_project":
      return `Đã xóa bạn khỏi vào dự án ${projectRender(project)}.`;
    case "request_approval":
      return `Đã gửi yêu cầu phê duyệt công việc ${taskRender(
        project,
        task
      )} trong dự án ${projectRender(project)}.`;
    case "accept_approval":
      return `Đã mời bạn tham gia vào dự án ${projectRender(project)}.`;
    case "reject_approval":
      return `Đã mời bạn tham gia vào dự án ${projectRender(project)}.`;
    case "task_assigned":
      return `Đã mời bạn tham gia vào dự án ${projectRender(project)}.`;
    default:
      return props.notification.action;
      break;
  }
});

const handleAccept = async () => {
  const project = props.notification.project;

  switch (props.notification.action) {
    case "invite_to_project":
      await acceptInviteProject(
        project!.id,
        props.notification.sender.id,
        props.notification.id
      );
      break;
    default:
      break;
  }
};

const handleDeny = async () => {
  const project = props.notification.project;

  switch (props.notification.action) {
    case "invite_to_project":
      await unacceptInviteProject(
        project!.id,
        props.notification.sender.id,
        props.notification.id
      );
      break;
    default:
      break;
  }
};

const handleReadNoti = async () => {
  let data;
  if (isRead.value) {
    data = await unreadNotification(props.notification.id);
  } else {
    data = await readNotification(props.notification.id);
  }

  if (data.success) {
    const noti = cloneDeep(props.notification);
    if (isRead.value)
      noti.readBy = noti.readBy.filter((r) => r != user.value!.id);
    else noti.readBy.push(user.value!.id);
    updateNotification(noti);
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
};

const openProject = () => {
  router.push({
    name: "Project",
    params: {
      projectId:
        props.notification.datas.project.id ??
        props.notification?.project?.id ??
        0,
    },
  });
};
</script>

<template>
  <div
    v-if="notification"
    class="px-4 py-2 mb-1"
    :class="[isRead ? 'bg-transparent' : 'bg-bgColor-secondary']"
  >
    <div class="px-2 py-2 flex flex-col bg-bgColor-primary rounded-md shadow">
      <div class="flex items-center pb-2 border-b border-borderColor">
        <div
          class="flex-1 flex items-center cursor-pointer"
          @click="openProject"
        >
          <div
            class="w-8 h-6 bg-cover bg-center aspect-video mr-2"
            :style="{
              backgroundImage: `url(${
                notification.project?.background ??
                notification.datas.project?.background
              })`,
            }"
          ></div>
          <span
            class="text-sm font-semibold text-textColor-primary text-dots mr-2"
            >{{
              notification.project?.name ?? notification.datas.project?.name
            }}</span
          >
        </div>
        <Popper
          hover
          :content="isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'"
          offsetDistance="4"
        >
          <div
            class="w-6 h-6 flex flex-center rounded hover:bg-primary-extraLight active:bg-primary-extraLight cursor-pointer"
            @click="handleReadNoti"
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
          <span class="text-xs text-textColor-secondary">{{}}</span>
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
:deep(.bold) {
  font-weight: 700;
}

:deep(.link) {
  color: var(--link-color);
}

:deep(.link:hover) {
  text-decoration: underline;
}
</style>
