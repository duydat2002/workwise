<script setup lang="ts">
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";
import { ref } from "vue";

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
</script>

<template>
  <div class="mt-2 not-lastchild:mb-3">
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle"
        >Mật khẩu cũ
      </span>
      <UInput
        class="w-[300px]"
        type="password"
        name="old_password"
        v-model:propValue="oldPassword"
      >
      </UInput>
    </div>
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle"
        >Mật khẩu mới
      </span>
      <UInput
        class="w-[300px]"
        type="password"
        name="new_password"
        v-model:propValue="newPassword"
      >
      </UInput>
    </div>
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle"
        >Xác nhận mật khẩu
      </span>
      <UInput
        class="w-[300px]"
        type="password"
        name="confirm_password"
        v-model:propValue="confirmPassword"
      >
      </UInput>
    </div>
    <div class="mt-3">
      <span class="text-xs text-textColor-secondary"
        >Mật khẩu từ 8 ký tự trở lên, bao gồm chữ hoa, chữ thường, số và ký tự
        đặc biệt.</span
      >
    </div>
    <div class="flex items-center mt-5 not-lastchild:mr-2">
      <UButton variantType="secondary"><span>Hủy</span></UButton>
      <UButton variantType="primary"><span>Đổi mật khẩu</span></UButton>
    </div>
  </div>
</template>
