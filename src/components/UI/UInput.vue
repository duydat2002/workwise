<script lang="ts" setup>
import ExclamationIcon from "@icons/exclamation-mark.svg";
import ShowIcon from "@icons/show.svg";
import HideIcon from "@icons/hide.svg";
import { ref, computed, InputTypeHTMLAttribute, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    type?: InputTypeHTMLAttribute;
    propValue: string | number;
    placeholder?: string;
    id?: string;
    name: string;
    errorMessage?: string;
    disabled?: boolean;
    autocomplete?: string;
  }>(),
  {
    type: "text",
  }
);

const slots = useSlots();

const inputType = ref(props.type);
const isFocus = ref(false);
const showPassword = ref(false);
const input = ref<HTMLInputElement>();

const emit = defineEmits(["update:propValue", "focus", "blur"]);

const inputValue = computed({
  get: () => props.propValue,
  set: (value) => {
    emit("update:propValue", value);
  },
});

const focusInput = () => {
  isFocus.value = true;
  input.value?.focus();
  emit("focus");
};

const blurInput = () => {
  isFocus.value = false;
  input.value?.blur();
  if (emit) emit("blur");
};

const togglePasswordVisibility = () => {
  inputType.value = showPassword.value ? "password" : "text";
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div
    class="flex flex-col"
    @click="focusInput"
    v-click-outside.short="blurInput"
  >
    <div
      class="w-full flex items-center px-3 py-1 min-h-[36px] rounded border border-borderColor has-[.focus]:border-primary-light"
      :class="{ focus: isFocus }"
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
</template>
