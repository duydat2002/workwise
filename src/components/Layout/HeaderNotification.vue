<script setup lang="ts">
import SleepIcon from "@icons/sleeping.svg";
import USwitchButton from "@/components/UI/USwitchButton.vue";
import NotificationItem from "@/components/Pages/Notification/NotificationItem.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores";
import { computed, ref } from "vue";
import { readAllNotification } from "@/services/user";
import { toast } from "vue3-toastify";

const { readAllNotifications } = useUserStore();
const { user, notifications } = storeToRefs(useUserStore());
const showOnlyUnread = ref(false);

const notificationsComp = computed(() => {
  if (showOnlyUnread.value) {
    return notifications.value.filter(
      (n) => !n.readBy.includes(user.value!.id)
    );
  } else {
    return notifications.value;
  }
});

const showReadAll = computed(() => {
  return notifications.value.some((n) => !n.readBy.includes(user.value!.id));
});

const handleReadAll = async () => {
  const data = await readAllNotification();

  if (data.success) {
    readAllNotifications();
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
};
</script>

<template>
  <div class="absolute top-full mt-2 right-0">
    <div
      class="w-[400px] flex flex-col rounded-lg border border-borderColor bg-bgColor-primary dark:bg-bgColor-primary shadow"
    >
      <div
        class="flex p-4 items-center justify-between border-b border-borderColor"
      >
        <span class="text-base font-bold text-textColor-primary"
          >Thông báo</span
        >
        <div class="flex items-center">
          <span class="text-xs text-textColor-secondary mr-1"
            >Chỉ hiện thị chưa đọc</span
          >
          <USwitchButton v-model:value="showOnlyUnread" />
        </div>
      </div>
      <div class="flex-1 h-full max-h-[450px] my-3 overflow-y-auto scroll-vert">
        <div v-if="showReadAll" class="flex justify-end mb-2 px-4">
          <span
            class="text-xs text-textColor-secondary hover:text-primary hover:underline cursor-pointer"
            @click="handleReadAll"
            >Đánh dấu tất cả đã đọc</span
          >
        </div>
        <NotificationItem
          v-if="notificationsComp.length > 0"
          v-for="noti in notificationsComp"
          :key="noti.id"
          :notification="noti"
        />
        <div v-else class="flex flex-col flex-center py-10">
          <SleepIcon class="w-[100px]" />
          <span class="mt-2 text-base font-semibold text-textColor-primary"
            >Không có thông báo nào</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
