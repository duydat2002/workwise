<script lang="ts" setup>
import ExclamationIcon from "@icons/exclamation-mark.svg";
import ShowIcon from "@icons/show.svg";
import HideIcon from "@icons/hide.svg";
import XIcon from "@icons/x.svg";
import CheckIcon from "@icons/check.svg";

import { ref, computed, InputTypeHTMLAttribute, useSlots } from "vue";

const emit = defineEmits([
  "update:propValue",
  "focus",
  "blur",
  "cancel",
  "confirm",
]);

const props = withDefaults(
  defineProps<{
    type?: InputTypeHTMLAttribute;
    propValue: string | number;
    placeholder?: string;
    id?: string;
    name?: string;
    errorMessage?: string;
    disabled?: boolean;
    autocomplete?: string;
    padding?: string;
    hasBorder?: boolean;
    fontSize?: string;
    hasButtons?: boolean;
  }>(),
  {
    type: "text",
    autocomplete: "off",
    padding: "px-3 py-1 min-h-[36px]",
    fontSize: "text-sm",
    hasBorder: true,
    hasButtons: false,
  }
);

const slots = useSlots();

const inputType = ref(props.type);
const isFocus = ref(false);
const showPassword = ref(false);
const showButtons = ref(false);
const input = ref<HTMLInputElement>();

const inputValue = computed({
  get: () => props.propValue,
  set: (value) => {
    emit("update:propValue", value);
  },
});

const focusInput = () => {
  isFocus.value = true;
  input.value?.focus();
  showButtons.value = true;
  emit("focus");
};

const blurInput = () => {
  if (isFocus.value) {
    isFocus.value = false;
    input.value?.blur();
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

const togglePasswordVisibility = () => {
  inputType.value = showPassword.value ? "password" : "text";
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="relative">
    <div
      class="flex flex-col"
      @click="focusInput"
      v-click-outside.short="{ handle: blurInput, excludes: ['.buttons'] }"
    >
      <div
        class="w-full flex flex-wrap items-center rounded border"
        :class="[
          isFocus
            ? 'border-primary-light'
            : hasBorder
            ? 'border-borderColor'
            : 'border-transparent',
          padding,
        ]"
      >
        <div v-if="slots.left" class="flex-shrink-0 mr-2">
          <slot name="left" />
        </div>
        <div class="flex-1 flex flex-center min-w-5">
          <input
            ref="input"
            :id="id"
            :type="inputType"
            :name="name"
            :autocomplete="autocomplete"
            class="w-full h-5 min-w-5 text-textColor-primary"
            :class="[fontSize]"
            :placeholder="placeholder"
            v-model="inputValue"
            :disabled="disabled"
          />
        </div>
        <div v-if="slots.right" class="flex-shrink-0 ml-2">
          <slot name="right" />
        </div>
        <component
          v-if="type == 'password'"
          :is="inputType == 'password' ? ShowIcon : HideIcon"
          class="w-4 fill-textColor-secondary cursor-pointer"
          @click="togglePasswordVisibility"
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
