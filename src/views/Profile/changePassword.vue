<script setup lang="ts">
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";
import { useAuth } from "@/composables";
import { validatePassword } from "@/helpers";
import { ref } from "vue";

const { changePassword, authError } = useAuth();

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const oldPasswordError = ref<string>();
const newPasswordError = ref<string>();
const confirmPasswordError = ref<string>();
const loadingChangePassword = ref(false);

const validate = () => {
  let check = true;

  oldPasswordError.value = undefined;
  newPasswordError.value = undefined;
  confirmPasswordError.value = undefined;

  // if (!validatePassword(oldPassword.value)) {
  //   oldPasswordError.value = "Mật khẩu không đúng định dạng.";
  //   check = false;
  // }

  if (!validatePassword(newPassword.value)) {
    newPasswordError.value = "Mật khẩu không đúng định dạng.";
    check = false;
  }

  if (newPassword.value != confirmPassword.value) {
    confirmPasswordError.value = "Mật khẩu xác nhận không khớp.";
    check = false;
  }

  return check;
};

const handleChangePassword = async () => {
  if (validate()) {
    loadingChangePassword.value = true;
    await changePassword(oldPassword.value, newPassword.value);
    loadingChangePassword.value = false;
  }
};
</script>

<template>
  <div class="mt-2 not-lastchild:mb-3">
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-bold text-textColor-subtitle"
        >Mật khẩu hiện tại
      </span>
      <UInput
        class="w-[300px]"
        type="password"
        name="old_password"
        v-model:propValue="oldPassword"
        :errorMessage="oldPasswordError"
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
        :errorMessage="newPasswordError"
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
        :errorMessage="confirmPasswordError"
      >
      </UInput>
    </div>
    <div class="mt-3">
      <span class="text-xs text-textColor-secondary"
        >Mật khẩu từ 8 ký tự trở lên, bao gồm chữ hoa, chữ thường, số và ký tự
        đặc biệt.</span
      >
      <p v-if="authError" class="text-sm text-error mt-3">{{ authError }}</p>
    </div>
    <div class="flex items-center mt-5 not-lastchild:mr-2">
      <UButton variantType="secondary"><span>Hủy</span></UButton>
      <UButton
        variantType="primary"
        @click="handleChangePassword"
        :isLoading="loadingChangePassword"
        ><span>Đổi mật khẩu</span></UButton
      >
    </div>
  </div>
</template>
