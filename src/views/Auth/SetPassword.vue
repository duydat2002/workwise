<script setup lang="ts">
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";
import { useAuth } from "@/composables";
import { validatePassword } from "@/helpers";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { linkGoogleWithEmailUser, signOut } = useAuth();
const router = useRouter();

const { user } = storeToRefs(useUserStore());
const password = ref("");
const passwordError = ref<string>();
const confirmPassword = ref("");
const confirmPasswordError = ref<string>();
const loadingSetPassword = ref<boolean>();

const validate = () => {
  let check = true;

  passwordError.value = undefined;
  confirmPasswordError.value = undefined;

  if (!validatePassword(password.value)) {
    passwordError.value = "Mật khẩu không đúng định dạng.";
    check = false;
  }

  if (confirmPassword.value != password.value) {
    confirmPasswordError.value = "Mật khẩu xác nhận không khớp.";
    check = false;
  }

  return check;
};

const handleSetPassword = async () => {
  if (validate()) {
    loadingSetPassword.value = true;
    await linkGoogleWithEmailUser(user.value!.email, password.value);
    loadingSetPassword.value = false;
  }
};

const handleSigninOtherAccount = async () => {
  await signOut();

  router.push({ name: "Signin" });
};
</script>

<template>
  <div class="no-dark">
    <div
      class="w-full min-[500px]:w-[400px] my-0 min-[500px]:my-8 mx-auto px-10 py-8 flex flex-col items-center bg-white rounded-lg shadow-none min-[500px]:shadow"
    >
      <div class="flex items-center">
        <img src="@/assets/images/Logo.png" class="w-[60px]" />
        <span class="logo-text big">WorkWise</span>
      </div>
      <span class="pt-4 pb-2 text-base font-semibold"
        >Đặt mật khẩu cho tài khoản của bạn</span
      >
      <span class="text-base font-semibold mb-4">{{ user?.email }}</span>
      <div class="">
        <div class="flex flex-col w-full">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Mật khẩu
          </label>
          <UInput
            name="password"
            type="password"
            v-model:propValue="password"
            placeholder="Nhập mật khẩu"
            :error-message="passwordError"
          >
          </UInput>
        </div>
        <div class="flex flex-col w-full mt-2">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Xác nhận mật khẩu
          </label>
          <UInput
            name="confirm_password"
            type="password"
            v-model:propValue="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            :error-message="confirmPasswordError"
          >
          </UInput>
        </div>
        <span class="block mt-3 text-xs text-textColor-secondary"
          >Mật khẩu từ 8 ký tự trở lên, bao gồm chữ hoa, chữ thường, số và ký tự
          đặc biệt.</span
        >
      </div>
      <UButton
        variantType="primary"
        class="w-full mt-4"
        @click="handleSetPassword"
        :isLoading="loadingSetPassword"
        ><span class="font-medium">Đặt mật khẩu</span>
      </UButton>
      <div
        class="mt-6 flex items-center text-sm text-link font-semibold cursor-pointer"
        @click="handleSigninOtherAccount"
      >
        <span class="">Đăng nhập bằng tài khoản khác </span>
      </div>
    </div>
  </div>
</template>
