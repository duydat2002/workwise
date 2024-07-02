<script setup lang="ts">
import GoogleIcon from "@icons/google.svg";
import DownloadIcon from "@icons/downloads.svg";
import UInputFloat from "@/components/UI/UInputFloat.vue";
import UButton from "@/components/UI/UButton.vue";
import { ref } from "vue";
import { useAuth, useInstallApp } from "@/composables";
import { validateEmail } from "@/helpers";

const { handleInstallApp } = useInstallApp();
const { signIn, signInWithGoogleRedirect, signInWithGoogle, authError } =
  useAuth();

const email = ref("");
const password = ref("");
const isLoadingSignin = ref(false);
const isLoadingGoogleSignin = ref(false);
const emailError = ref<string>();
const passwordError = ref<string>();

const validate = () => {
  emailError.value = undefined;
  passwordError.value = undefined;
  let check = true;

  if (!validateEmail(email.value)) {
    emailError.value = "Email không đúng định dạng.";
    check = false;
  }

  if (password.value.length < 8) {
    passwordError.value = "Mật khẩu phải hơn 8 ký tự.";
    check = false;
  }

  return check;
};

const handleSignIn = async () => {
  isLoadingSignin.value = true;
  if (validate()) await signIn(email.value, password.value);
  isLoadingSignin.value = false;
};

const handleGoogleSignin = async () => {
  isLoadingGoogleSignin.value = true;
  await signInWithGoogle();
  isLoadingGoogleSignin.value = false;
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
      <span class="py-4 text-base font-semibold">Đăng nhập để tiếp tục</span>
      <UInputFloat
        class="mb-2"
        name="email"
        placeholder="Nhập email của bạn"
        v-model:propValue="email"
        :errorMessage="emailError"
      />
      <UInputFloat
        class="mb-4"
        name="password"
        placeholder="Mật khẩu"
        type="password"
        v-model:propValue="password"
        :errorMessage="passwordError"
      />
      <UButton
        class="w-full"
        type="submit"
        variantType="primary"
        :isLoading="isLoadingSignin"
        @click="handleSignIn"
        ><span class="font-medium">Đăng nhập</span></UButton
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
        class="w-full"
        variant="outlined"
        @click="handleGoogleSignin"
        :isLoading="isLoadingGoogleSignin"
        loadingClass="text-textColor-primary"
      >
        <GoogleIcon class="w-4" />
        <span class="ml-2 text-link font-medium">Đăng nhập bằng Google</span>
      </UButton>
      <p v-if="authError" class="text-sm text-error mt-3">{{ authError }}</p>
      <div class="mt-6 flex items-center text-sm text-link font-semibold">
        <RouterLink :to="{ name: 'ForgotPassword' }">Quên mật khẩu?</RouterLink>
        <span class="px-2">•</span>
        <RouterLink to="/signup">Đăng ký</RouterLink>
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
