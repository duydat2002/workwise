<script lang="ts" setup>
import Modal from "@/components/Modal/Modal.vue";
import UButton from "@/components/UI/UButton.vue";

const emit = defineEmits(["confirm", "cancel", "click-outside"]);
withDefaults(
  defineProps<{
    id?: string;
    class?: string;
    title?: string;
    desc?: string;
    confirmMessage?: string;
    cancelMessage?: string;
    isLoadingConfirm?: boolean;
  }>(),
  {
    confirmMessage: "Đồng ý",
    cancelMessage: "Hủy",
  }
);

const onConfirm = () => {
  emit("confirm");
};
const onCancel = () => {
  emit("cancel");
};

const onClickOutside = () => {
  emit("cancel");
  emit("click-outside");
};
</script>

<template>
  <Modal :id="id" isShow @click-outside="onClickOutside">
    <div
      class="p-3 w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden"
      v-click-outside.short="onClickOutside"
    >
      <div class="py-2">
        <span v-if="title" class="block text-xl">{{ title }}</span>
        <span v-if="desc" class="block py-2 text-textColor-secondary">{{
          desc
        }}</span>
        <slot />
      </div>
      <div class="flex mt-2 gap-2">
        <UButton class="flex-1" variantType="secondary" @click="onCancel"
          ><span class="">{{ cancelMessage }}</span></UButton
        >
        <UButton
          class="flex-1"
          variantType="error"
          @click="onConfirm"
          :isLoading="isLoadingConfirm"
          ><span class="">{{ confirmMessage }}</span></UButton
        >
      </div>
    </div>
  </Modal>
</template>
