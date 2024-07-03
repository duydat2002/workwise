<script setup lang="ts">
import EmailIcon from "@icons/email-big.svg";
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";
import { useAuth } from "@/composables";
import { ref } from "vue";
import { findUsersByEmail } from "@/services/user";

const { sendResetPasswordEmail } = useAuth();

const email = ref("");
const emailError = ref<string>();
const loadingSend = ref(false);
const isSent = ref(false);

const sendMailResetPassword = async () => {
  console.log("object");
  if (email.value.trim() == "") {
    emailError.value = "Email không được để trống.";
    return;
  }

  const data = await findUsersByEmail(email.value);
  if (!data.success || (data.result && data.result.users?.length == 0)) {
    emailError.value =
      "Chúng tôi không tìm thấy tài khoản cho địa chỉ email đó.";
    return;
  }

  try {
    loadingSend.value = true;
    await sendResetPasswordEmail(email.value);
    loadingSend.value = false;
    isSent.value = true;
  } catch (error: any) {
    console.log(error);
    switch (error.code) {
      case "auth/missing-email":
        emailError.value = "Email không được để trống.";
        break;
      case "auth/invalid-email":
        emailError.value = "Email không hợp lệ.";
        break;
      default:
        break;
    }
  }
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
      <span class="py-4 text-base font-semibold"
        >Bạn không đăng nhập được?</span
      >
      <template v-if="!isSent">
        <div class="flex flex-col w-full">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Chúng tôi sẽ gửi liên kết khôi phục đến
          </label>
          <UInput
            name="email"
            v-model:propValue="email"
            placeholder="Nhập địa chỉ email"
            :error-message="emailError"
          >
          </UInput>
        </div>
        <UButton
          variantType="primary"
          class="w-full mt-4"
          :isLoading="loadingSend"
          @click="sendMailResetPassword"
          ><span class="font-medium">Gửi liên kết khôi phục</span>
        </UButton>
        <div class="mt-6 flex items-center text-sm text-link font-semibold">
          <RouterLink :to="{ name: 'Signin' }"
            >Đăng nhập bằng tài khoản khác</RouterLink
          >
        </div>
      </template>
      <template v-else>
        <EmailIcon class="w-[100px] my-4" />
        <span class="text-textColor-secondary"
          >Chúng tôi đã gửi liên kết khôi phục cho bạn theo địa chỉ</span
        >
        <span class="text-base font-semibold">{{ email }}</span>
        <div class="mt-6 flex items-center text-sm text-link font-semibold">
          <RouterLink :to="{ name: 'Signin' }">Quay lại đăng nhập</RouterLink>
          <span class="px-2">•</span>
          <RouterLink :to="{ name: 'ForgotPassword' }"
            >Gửi lại liên kết khôi phục</RouterLink
          >
        </div>
      </template>
    </div>
  </div>
</template>
