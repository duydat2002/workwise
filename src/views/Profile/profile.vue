<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";
import { deleteAvatar, updateAvatar, updateUsserInfo } from "@/services/user";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { toast, type ToastOptions } from "vue3-toastify";

const { user } = storeToRefs(useUserStore());

const email = ref(user.value?.email || "");
const fullname = ref(user.value?.fullname || "");
const avatar = ref(user.value?.avatar || "");
const inputAvatar = ref<HTMLInputElement>();

const showButtons = computed(
  () => fullname.value.trim() != user.value?.fullname
);

const handleChangeAvatar = () => {
  inputAvatar.value?.click();
};

const getInputAvatar = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files![0];

  if (!file.type.includes("image")) {
    toast.error("Ảnh đại diện phải là ảnh!");
    return;
  }
  if (file.size <= 5 * 1024 * 124) {
    toast.error("Ảnh đại diện phải có dung lượng tối đa 5MB!");
    return;
  }

  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const data = await updateAvatar(formData);
    if (data.success) {
      avatar.value = data.result!.avatar;
    } else {
      toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
    }
  }
};

const handleDeleteAvatar = async () => {
  const data = await deleteAvatar();
  if (data.success) {
    avatar.value = "";
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
};

const cancelUpdateInfo = () => {
  fullname.value = user.value?.fullname || "";
};

const updateInfo = async () => {
  const data = await updateUsserInfo(fullname.value);
  if (data.success) {
    user.value!.fullname = fullname.value;
    toast.success("Cập nhật thông tin thành công.");
  } else {
    toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
  }
};
</script>

<template>
  <div class="mt-2 not-lastchild:mb-3">
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle"
        >Hình đại diện
      </span>
      <div class="flex items-center">
        <Avatar class="w-[80px] h-[80px]" :avatarUrl="avatar" />
        <input
          class="hidden"
          ref="inputAvatar"
          accept="image/jpeg,image/png,image/jpg"
          type="file"
          @change="getInputAvatar"
        />
        <div class="ml-3 h-[80px] flex flex-col justify-between">
          <span class="text-xs text-textColor-secondary opacity-0">.</span>
          <div class="flex items-center">
            <UButton
              variantType="secondary"
              class="mr-2"
              @click="handleChangeAvatar"
              ><span class="">Đổi ảnh đại diện</span></UButton
            >
            <UButton variantType="error" @click="handleDeleteAvatar"
              ><span class="">Xóa ảnh đại diện</span></UButton
            >
          </div>
          <span class="text-xs text-textColor-secondary">
            Chọn một bức ảnh có dung lượng tối đa 5MB.
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle"
        >Họ tên
      </span>
      <UInput name="fullname" v-model:propValue="fullname"> </UInput>
    </div>
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle">Email </span>
      <UInput name="email" :disabled="true" v-model:propValue="email"> </UInput>
    </div>
    <div
      v-if="showButtons"
      class="flex items-center justify-end mt-5 not-lastchild:mr-2"
    >
      <UButton variantType="secondary" @click="cancelUpdateInfo"
        ><span>Hủy</span></UButton
      >
      <UButton variantType="primary" @click="updateInfo"
        ><span>Lưu</span></UButton
      >
    </div>
    <!-- <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle">Liên kết với</span>
    </div> -->
  </div>
</template>
