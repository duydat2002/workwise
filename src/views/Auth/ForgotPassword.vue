<script setup lang="ts">
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";
import { useAuth } from "@/composables";
import { ref } from "vue";

const { sendResetPasswordEmail } = useAuth();

const email = ref("");
const emailError = ref<string>();

const sendMailResetPassword = async () => {
  console.log("object");
  if (email.value.trim() == "") {
    emailError.value = "Email không được để trống.";
    return;
  }

  try {
    await sendResetPasswordEmail(email.value);
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
      <div class="flex flex-col w-full">
        <label class="mb-1 text-xs font-bold text-textColor-subtitle"
          >Chúng tôi sẽ gửi liên kết khôi phục đến
        </label>
        <UInput
          class="w-[250px]"
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
        @click="sendMailResetPassword"
        ><span class="font-medium">Gửi liên kết khôi phục</span>
      </UButton>
      <RouterLink
        :to="{ name: 'Signin' }"
        class="mt-6 flex items-center text-sm text-link font-semibold"
      >
        <span class=""> Đăng nhập bằng tài khoản khác </span>
      </RouterLink>
    </div>
  </div>
</template>
