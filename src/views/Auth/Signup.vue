<script setup lang="ts">
import GoogleIcon from "@icons/google.svg";
import DownloadIcon from "@icons/downloads.svg";
import UInputFloat from "@/components/UI/UInputFloat.vue";
import UButton from "@/components/UI/UButton.vue";
import { ref } from "vue";
import { useAuth, useInstallApp } from "@/composables";
import { validateEmail, validatePassword } from "@/helpers";

const { handleInstallApp } = useInstallApp();
const { signUp, signInWithGoogle, authError } = useAuth();

const fullname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoadingSignup = ref(false);
const isLoadingGoogleSignup = ref(false);
const fullnameError = ref<string>();
const emailError = ref<string>();
const passwordError = ref<string>();
const confirmPasswordError = ref<string>();

const validate = () => {
  fullnameError.value = undefined;
  emailError.value = undefined;
  passwordError.value = undefined;

  let check = true;

  if (fullname.value == "") {
    fullnameError.value = "Tên không được để trống.";
    check = false;
  }

  if (!validateEmail(email.value)) {
    emailError.value = "Email không đúng định dạng.";
    check = false;
  }

  if (!validatePassword(password.value)) {
    passwordError.value =
      "Mật khẩu từ 8 ký tự trở lên, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    check = false;
  }

  if (confirmPassword.value != password.value) {
    confirmPasswordError.value = "Mật khẩu xác nhận không khớp.";
    check = false;
  }

  return check;
};

const handleSignUp = async () => {
  isLoadingSignup.value = true;
  if (validate()) await signUp(fullname.value, email.value, password.value);
  isLoadingSignup.value = false;
};

const handleGoogleSignin = async () => {
  isLoadingGoogleSignup.value = true;
  await signInWithGoogle();
  isLoadingGoogleSignup.value = false;
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
      <span class="py-4 text-base font-semibold">Đăng ký để tiếp tục</span>
      <UInputFloat
        class="mb-2"
        name="fullname"
        placeholder="Nhập họ tên"
        v-model:propValue="fullname"
        :errorMessage="fullnameError"
      />
      <UInputFloat
        class="mb-2"
        name="email"
        placeholder="Nhập email"
        v-model:propValue="email"
        :errorMessage="emailError"
      />
      <UInputFloat
        class="mb-2"
        name="password"
        placeholder="Nhập mật khẩu"
        type="password"
        v-model:propValue="password"
        :errorMessage="passwordError"
      />
      <UInputFloat
        class="mb-2"
        name="confirmpassword"
        placeholder="Xác nhận mật khẩu"
        type="password"
        v-model:propValue="confirmPassword"
        :errorMessage="confirmPasswordError"
      />
      <UButton
        class="mt-2 w-full"
        variantType="primary"
        :isLoading="isLoadingSignup"
        @click="handleSignUp"
        ><span class="font-medium">Đăng ký</span></UButton
      >
      <div class="flex w-full items-center my-4">
        <div class="w-full h-[1px] bg-borderColor"></div>
        <span
          class="mx-4 text-[13px] uppercase font-semibold text-textColor-secondary"
          >Hoặc</span
        >
        <div class="w-full h-[1px] bg-borderColor"></div>
      </div>
      <UButton
        variant="outlined"
        class="w-full"
        @click="handleGoogleSignin"
        :isLoading="isLoadingGoogleSignup"
        loadingClass="text-textColor-primary"
      >
        <GoogleIcon class="w-4" />
        <span class="ml-2 text-link font-medium">Đăng ký bằng Google</span>
      </UButton>
      <p v-if="authError" class="text-sm text-error mt-3">{{ authError }}</p>
      <div class="mt-6 flex items-center text-sm text-link font-semibold">
        <RouterLink to="/signin">Bạn đã có tài khoản? Đăng nhập</RouterLink>
      </div>
      <div class="mt-6 flex items-center">
        <span class="mr-2">Chưa có ứng dụng?</span>
        <UButton variantType="secondary" @click="handleInstallApp">
          <DownloadIcon class="w-4 fill-textColor-primary mr-2" />
          <span>Cài ứng dụng</span></UButton
        >
      </div>
    </div>
  </div>
</template>
