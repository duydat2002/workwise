<script setup lang="ts">
import XIcon from "@icons/x.svg";
import LeftIcon from "@icons/left.svg";
import UInput from "@/components/UI/UInput.vue";
import { ILabel } from "@/types";
import { ref } from "vue";
import UButton from "@/components/UI/UButton.vue";

interface IColor {
  color: string;
  colorName: string;
}

const emit = defineEmits(["close"]);
const props = defineProps<{
  label?: ILabel;
}>();

const name = ref<string>(props.label?.name || "");
const colorSelected = ref<IColor>(
  props.label
    ? { color: props.label?.color, colorName: props.label?.colorName }
    : { color: "#7ee2b8", colorName: "Xanh lá" }
);
const colors = ref<IColor[]>([
  { color: "#7ee2b8", colorName: "Xanh lá" },
  { color: "#e2b203", colorName: "Vàng" },
  { color: "#fea362", colorName: "Cam" },
  { color: "#f87168", colorName: "Đỏ" },
  { color: "#9f8fef", colorName: "Tím" },
]);

const handleChooseColor = (color: IColor) => {
  colorSelected.value = color;
};

const closeEdit = () => {
  emit("close");
};
</script>

<template>
  <div class="relative flex flex-center">
    <div
      class="group absolute left-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
      @click="closeEdit"
    >
      <LeftIcon class="w-5 fill-textColor-secondary group-hover:fill-primary" />
    </div>
    <span class="text-base text-textColor-primary font-semibold">{{
      label ? "Chỉnh sửa nhãn" : "Tạo nhãn mới"
    }}</span>
    <div
      class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
    >
      <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
    </div>
  </div>
  <div class="mt-3 flex flex-col">
    <label class="mb-1 text-xs font-bold text-textColor-subtitle"
      >Tên nhãn
    </label>
    <UInput
      class="w-[250px]"
      name="name"
      v-model:propValue="name"
      placeholder="Tên nhãn"
    >
    </UInput>
  </div>
  <div class="mt-3 flex flex-col">
    <div class="mb-1 text-xs font-bold text-textColor-subtitle">
      Chọn màu nhãn
    </div>
    <div class="grid grid-cols-5 -mx-1">
      <div
        v-for="color in colors"
        :key="color.color"
        class="m-1 border border-borderColor hover:border-primary cursor-pointer rounded overflow-hidden has-[.active]:border-primary"
        :class="{ active: colorSelected?.color == color.color }"
        :title="color.colorName"
        @click="handleChooseColor(color)"
      >
        <div class="h-8" :style="{ background: color.color }"></div>
      </div>
    </div>
  </div>
  <div class="mt-3 flex flex-center">
    <UButton variantType="primary"><span class="">Tạo nhãn</span></UButton>
  </div>
</template>
