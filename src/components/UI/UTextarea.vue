<script setup lang="ts">
import ExclamationIcon from "@icons/exclamation-mark.svg";
import XIcon from "@icons/x.svg";
import CheckIcon from "@icons/check.svg";

import { ref, computed, onMounted, nextTick, watch } from "vue";

const emit = defineEmits([
  "update:value",
  "focus",
  "blur",
  "enter",
  "cancel",
  "confirm",
]);

const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    value: string;
    placeholder?: string;
    errorMessage?: string;
    disabled?: boolean;
    minHeight?: number;
    maxHeigth?: number;
    textareaClass?: string;
    hasButtons?: boolean;
  }>(),
  {
    minHeight: 36,
    maxHeigth: 80,
    hasButtons: false,
  }
);

const isFocus = ref(false);
const showButtons = ref(false);
const textareaRef = ref<HTMLTextAreaElement>();

const inputValue = computed({
  get: () => props.value,
  set: (value) => {
    emit("update:value", value);
  },
});

const handleEnter = () => {
  emit("enter");
};

const handleFocus = () => {
  isFocus.value = true;
  showButtons.value = true;
  emit("focus");
};

const handleBlur = () => {
  blurInput();
  emit("blur");
};

const blurInput = () => {
  if (isFocus.value) {
    isFocus.value = false;
    showButtons.value = false;
    if (emit) emit("blur");
  }
};

const handleCancel = () => {
  blurInput();
  emit("cancel");
};

const handleConfirm = () => {
  blurInput();
  emit("confirm");
};

watch(inputValue, () => {
  nextTick(() => {
    textareaRef.value!.style.height = props.minHeight + "px";
    textareaRef.value!.style.height =
      Math.min(textareaRef.value!.scrollHeight, props.maxHeigth) + "px";
  });
});

onMounted(() => {
  nextTick(() => {
    textareaRef.value!.style.height = props.minHeight + "px";
  });
});
</script>

<template>
  <div class="relative">
    <div class="flex flex-col">
      <div
        class="flex rounded-md overflow-hidden border border-solid border-borderColor has-[.focus]:border-primary-light"
        :class="{ focus: isFocus }"
        v-click-outside.short="{ handle: handleBlur, excludes: ['.buttons'] }"
      >
        <textarea
          class="w-full py-1 px-3 resize-none overflow-y-auto scroll-vert"
          :class="textareaClass"
          ref="textareaRef"
          :id="id"
          :name="name"
          :placeholder="placeholder"
          v-model="inputValue"
          :disabled="disabled"
          @keydown.enter.exact.prevent="handleEnter"
          @focus="handleFocus"
        />
      </div>
      <div v-if="errorMessage" class="flex items-center">
        <ExclamationIcon class="w-4 fill-error mr-1 flex-shrink-0" />
        <span class="text-sm text-error">{{ errorMessage }}</span>
      </div>
    </div>
    <div
      v-if="hasButtons && showButtons"
      class="buttons absolute top-full right-0 mt-1 z-10"
    >
      <div class="flex">
        <div
          class="w-8 h-8 rounded-md flex flex-center bg-bgColor-primary hover:bg-bgColor-secondary shadow-item cursor-pointer mr-2"
          @click="handleConfirm"
        >
          <CheckIcon class="w-3 fill-primary" />
        </div>
        <div
          class="w-8 h-8 rounded-md flex flex-center bg-bgColor-primary hover:bg-bgColor-secondary shadow-item cursor-pointer"
          @click="handleCancel"
        >
          <XIcon class="w-3 fill-error" />
        </div>
      </div>
    </div>
  </div>
</template>
