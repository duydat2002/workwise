<script setup lang="ts">
import ExclamationIcon from "@icons/exclamation-mark.svg";

import { ref, computed, onMounted, nextTick } from "vue";

const emit = defineEmits(["update:value", "focus", "blur", "enter"]);

const props = withDefaults(
  defineProps<{
    id?: string;
    name: string;
    value: string;
    placeholder?: string;
    errorMessage?: string;
    disabled?: boolean;
    minHeigth?: number;
    maxHeigth?: number;
    textareaClass?: string;
  }>(),
  {
    minHeigth: 36,
    maxHeigth: 80,
  }
);

const isFocus = ref(false);
const textareaRef = ref<HTMLTextAreaElement>();

const inputValue = computed({
  get: () => props.value,
  set: (value) => {
    emit("update:value", value);
  },
});

const handleInput = () => {
  textareaRef.value!.style.height = props.minHeigth + "px";
  textareaRef.value!.style.height =
    Math.min(textareaRef.value!.scrollHeight, props.maxHeigth) + "px";
};

const handleEnter = () => {
  emit("enter");
};

const handleFocus = () => {
  isFocus.value = true;
  emit("focus");
};

const handleBlur = () => {
  isFocus.value = false;
  emit("blur");
};

onMounted(() => {
  nextTick(() => {
    textareaRef.value!.style.height = props.minHeigth + "px";
  });
});
</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex rounded-md overflow-hidden border border-solid border-borderColor has-[.focus]:border-primary-light"
      :class="{ focus: isFocus }"
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
        @input="handleInput"
        @keydown.enter.exact.prevent="handleEnter"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    <div v-if="errorMessage" class="flex items-center">
      <ExclamationIcon class="w-4 fill-error mr-1 flex-shrink-0" />
      <span class="text-sm text-error">{{ errorMessage }}</span>
    </div>
  </div>
</template>
