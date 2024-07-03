<script setup lang="ts">
import EmailIcon from "@icons/email-big.svg";
import UButton from "@/components/UI/UButton.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { reload } from "firebase/auth";
import { auth } from "@/plugins/firebase";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables";
import { storeToRefs } from "pinia";
import { useCommonStore, useUserStore } from "@/stores";
import { differenceInSeconds } from "date-fns";
import { verifyUserEmail } from "@/services/user";
import { toast } from "vue3-toastify";

const router = useRouter();
const { sendVerifyEmail, signOut } = useAuth();

const { user } = storeToRefs(useUserStore());
const { verifyEmail } = storeToRefs(useCommonStore());
const intervalVerifyId = ref<NodeJS.Timeout>();
const isLoadingSendVerify = ref(false);
const cooldown = ref(30);
const intervalCooldownId = ref<NodeJS.Timeout>();

const handleSendVerifyEmail = async () => {
  isLoadingSendVerify.value = true;
  if (auth.currentUser) {
    await sendVerifyEmail();
    cooldown.value = 30;
    toast.success("Đã gửi email xác minh cho bạn.");
  }
  isLoadingSendVerify.value = false;
};

const handleSigninOtherAccount = async () => {
  await signOut();

  router.push({ name: "Signin" });
};

onMounted(async () => {
  if (
    verifyEmail.value &&
    differenceInSeconds(new Date(), verifyEmail.value.lastResend!) > 30
  ) {
    console.log("send");
    await sendVerifyEmail();
  }

  intervalCooldownId.value = setInterval(() => {
    if (cooldown.value == 0) clearInterval(intervalCooldownId.value);
    else cooldown.value--;
  }, 1000);

  intervalVerifyId.value = setInterval(async () => {
    console.log("interval");
    if (auth.currentUser) {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        if (user.value && !user.value.emailVerified) {
          const data = await verifyUserEmail(user.value.uid);

          if (data.success) {
            clearInterval(intervalVerifyId.value);
            user.value.emailVerified = true;
            router.push({ name: "Home" });
          }
        }
      }
    }
  }, 5000);
});

onBeforeUnmount(async () => {
  clearInterval(intervalCooldownId.value);
  clearInterval(intervalVerifyId.value);
});
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
        >Kiểm tra hộp thư đến để đăng nhập</span
      >
      <EmailIcon class="w-[100px] my-4" />
      <span class="text-textColor-secondary"
        >Để hoàn thành quá trình thiết lập và đăng nhập, hãy nhấp vào liên kết
        xác minh trong email mà chúng tôi đã gửi.</span
      >
      <span class="text-base font-semibold">{{ auth.currentUser?.email }}</span>
      <UButton
        class="w-full mt-4"
        variantType="primary"
        :isLoading="isLoadingSendVerify"
        :isDisabled="cooldown > 0"
        @click="handleSendVerifyEmail"
        ><span class="font-medium"
          >Gửi lại email xác minh sau {{ cooldown > 0 ? cooldown : "" }}</span
        >
      </UButton>
      <div class="mt-6 flex items-center text-sm text-link font-semibold">
        <div class="cursor-pointer" @click="handleSigninOtherAccount">
          Đăng nhập bằng tài khoản khác
        </div>
      </div>
    </div>
  </div>
</template>
