<script lang="ts" setup>
import ExclamationIcon from "@icons/exclamation-mark.svg";
import { ref, computed, InputTypeHTMLAttribute } from "vue";

const props = withDefaults(
  defineProps<{
    type?: InputTypeHTMLAttribute;
    propValue: string | number;
    placeholder?: string;
    id?: string;
    name: string;
    minLength?: string | number;
    errorMessage?: string;
  }>(),
  {
    type: "text",
  }
);

const inputType = ref(props.type);
const showPassword = ref(false);
const isFocus = ref(false);

const emit = defineEmits(["update:propValue", "focus", "blur"]);

const inputValue = computed({
  get: () => props.propValue,
  set: (value) => {
    emit("update:propValue", value);
  },
});

const togglePasswordVisibility = () => {
  inputType.value = showPassword.value ? "password" : "text";
  showPassword.value = !showPassword.value;
};

const focusInput = () => {
  isFocus.value = true;
  emit("focus");
};

const blurInput = () => {
  isFocus.value = false;
  if (emit) emit("blur");
};
</script>

<template>
  <div class="flex flex-col w-full">
    <div
      class="flex items-center relative w-full h-9 rounded-[3px] bg-bgColor-secondary box-content border border-borderColor has-[.focus]::border-borderColor-dark"
      :class="[{ 'active-label': inputValue != '' }, { focus: isFocus }]"
    >
      <div class="flex-auto">
        <input
          class="input w-full p-2 text-base leading-5 truncate bg-bgColor-secondary transition-[padding] duration-100 ease-out"
          :id="id"
          :type="inputType"
          :name="name"
          :minlength="minLength"
          v-model="inputValue"
          @focus="focusInput"
          @blur="blurInput"
        />
        <span
          class="placeholder absolute ml-2 left-0 right-0 top-1/2 -translate-y-1/2 origin-top-left text-xs truncate text-left text-textColor-secondary transition-transform duration-100 ease-out pointer-events-none"
          >{{ placeholder }}</span
        >
      </div>
      <div
        v-if="type == 'password' && inputValue != ''"
        class="mr-2 text-sm leading-[18px] font-semibold text-[#262626] select-none cursor-pointer hover:opacity-50"
        @click="togglePasswordVisibility"
      >
        <span>{{ showPassword ? "Ẩn" : "Hiển thị" }}</span>
      </div>
    </div>
    <div v-if="errorMessage" class="flex items-center">
      <ExclamationIcon class="w-4 fill-error mr-1 flex-shrink-0" />
      <span class="text-sm text-error">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<style scoped>
.active-label .input {
  font-size: 12px;
  padding: 14px 8px 2px;
}

.active-label .placeholder {
  transform: translateY(-100%) scale(calc(10 / 12));
}
</style>
