<script setup lang="ts">
import XIcon from "@icons/x.svg";
import LeftIcon from "@icons/left.svg";
import UInput from "@/components/UI/UInput.vue";
import { ILabel } from "@/types";
import { ref } from "vue";
import UButton from "@/components/UI/UButton.vue";
import { LABEL_COLORS } from "@/constants";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores";
import {
  createUserProjectLabel,
  deleteUserProjectLabel,
  updateUserProjectLabel,
} from "@/services/user";

const emit = defineEmits(["close", "back"]);
const props = defineProps<{
  label?: ILabel;
}>();

const { user } = storeToRefs(useUserStore());
const name = ref<string>(props.label?.name || "");
const colorSelected = ref<string>(props.label ? props.label!.color : "#7ee2b8");
const nameError = ref<string>();
const isLoading = ref(false);
const isLoadingDelete = ref(false);

const handleChooseColor = (color: string) => {
  colorSelected.value = color;
};

const validate = () => {
  nameError.value = undefined;
  let check = true;

  if (name.value.trim() == "") {
    nameError.value = "Tên nhãn không được để trống.";
    check = false;
  }

  return check;
};

const handleCreateLabel = async () => {
  if (validate()) {
    isLoading.value = true;
    const data = await createUserProjectLabel(
      name.value.trim(),
      colorSelected.value
    );

    if (data.success) {
      user.value!.createdProjectLabels.push(data.result!.label);
      backToList();
    } else {
      nameError.value = "Nhãn đã tồn tại.";
    }
    isLoading.value = false;
  }
};

const handleUpdateLabel = async () => {
  if (validate() && props.label) {
    isLoading.value = true;
    const data = await updateUserProjectLabel(
      props.label.id,
      name.value.trim(),
      colorSelected.value
    );

    if (data.success) {
      const labelIndex = user.value!.createdProjectLabels.findIndex(
        (l) => l.id == data.result!.label.id
      );
      user.value!.createdProjectLabels[labelIndex] = data.result!.label;
      backToList();
    } else {
      nameError.value = "Nhãn đã tồn tại.";
    }
    isLoading.value = false;
  }
};

const handleDeleteLabel = async () => {
  if (props.label) {
    isLoadingDelete.value = true;
    const data = await deleteUserProjectLabel(props.label.id);
    if (data.success) {
      user.value!.createdProjectLabels =
        user.value!.createdProjectLabels.filter((l) => l.id != props.label!.id);
      backToList();
    } else {
    }
    isLoadingDelete.value = false;
  }
};

const closeEdit = () => {
  emit("close");
};

const backToList = () => {
  emit("back");
};
</script>

<template>
  <div class="relative flex flex-center">
    <div
      class="group absolute left-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
      @click="backToList"
    >
      <LeftIcon class="w-5 fill-textColor-secondary group-hover:fill-primary" />
    </div>
    <span class="text-base text-textColor-primary font-semibold">{{
      label ? "Chỉnh sửa nhãn" : "Tạo nhãn mới"
    }}</span>
    <div
      class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
      @click="closeEdit"
    >
      <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
    </div>
  </div>
  <div class="mt-3 h-[100px] p-5 bg-bgColor-secondary flex flex-center">
    <div class="w-full h-8 px-3 py-1" :style="{ background: colorSelected }">
      <span class="text-sm text-[#44546f] font-medium">{{ name }}</span>
    </div>
  </div>
  <div class="mt-3 flex flex-col">
    <label class="mb-1 text-xs font-bold text-textColor-subtitle"
      >Tên nhãn
    </label>
    <UInput
      name="name"
      v-model:propValue="name"
      placeholder="Tên nhãn"
      :errorMessage="nameError"
    >
    </UInput>
  </div>
  <div class="mt-3 flex flex-col">
    <div class="mb-1 text-xs font-bold text-textColor-subtitle">
      Chọn màu nhãn
    </div>
    <div
      class="grid grid-cols-5 -mx-1 max-h-[150px] overflow-y-scroll scroll-vert"
    >
      <div
        v-for="color in LABEL_COLORS"
        :key="color"
        class="m-1 border-2 border-transparent hover:border-primary cursor-pointer rounded overflow-hidden has-[.active]:border-primary"
        :class="{ active: colorSelected == color }"
        :title="color"
        @click="handleChooseColor(color)"
      >
        <div class="h-8" :style="{ background: color }"></div>
      </div>
    </div>
  </div>
  <div class="mt-3 flex items-center justify-between">
    <template v-if="!label">
      <UButton
        class="w-full"
        variantType="primary"
        @click="handleCreateLabel"
        :isLoading
        ><span class="">Tạo nhãn</span></UButton
      >
    </template>
    <template v-else>
      <UButton
        variantType="error"
        @click="handleDeleteLabel"
        :isLoading="isLoadingDelete"
        ><span class="">Xóa</span></UButton
      >
      <UButton variantType="primary" @click="handleUpdateLabel" :isLoading
        ><span class="">Lưu</span></UButton
      >
    </template>
  </div>
</template>
