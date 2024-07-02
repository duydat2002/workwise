<script setup lang="ts">
import XIcon from "@icons/x.svg";
import XCircleIcon from "@icons/x-circle.svg";
import DownIcon from "@icons/down.svg";
import { InputTypeHTMLAttribute, computed, ref, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    tags: string[];
    type?: InputTypeHTMLAttribute;
    propValue: string;
    placeholder?: string;
    id?: string;
    name: string;
  }>(),
  {
    type: "text",
  }
);

const emit = defineEmits([
  "update:propValue",
  "focus",
  "blur",
  "deleteItem",
  "deleteAllItem",
]);
const slots = useSlots();

const isFocus = ref(false);
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
  emit("focus");
};

const blurInput = () => {
  isFocus.value = false;
  input.value?.blur();
  emit("blur");
};

const handleDeleteItem = (tag: string, index: number) => {
  emit("deleteItem", tag, index);
};

const handleDeleteAllTag = () => {
  emit("deleteAllItem");
};
</script>

<template>
  <div
    class="relative flex items-center px-3 py-1 min-h-[36px] rounded border border-borderColor has-[.focus]:border-primary-light"
    :class="{ focus: isFocus }"
    @click="focusInput"
    v-click-outside.short="blurInput"
  >
    <div class="flex flex-wrap items-center">
      <div
        v-for="(tag, i) in tags"
        :key="i"
        class="flex items-center px-1 py-[2px] bg-bgColor-secondary rounded mr-1"
      >
        <span class="text-xs mr-1 text-textColor-primary">{{ tag }}</span>
        <div
          class="p-1 group hover:bg-red-200 rounded-full cursor-pointer"
          @click="handleDeleteItem(tag, i)"
        >
          <XIcon class="w-2 fill-textColor-secondary group-hover:fill-error" />
        </div>
      </div>
      <input
        ref="input"
        class="h-5 min-w-5 text-textColor-primary"
        placeholder="placeholder"
        v-model="inputValue"
      />
    </div>
    <div class="flex items-center">
      <div class="p-1 group cursor-pointer" @click.stop="handleDeleteAllTag">
        <XCircleIcon
          class="w-3 fill-textColor-secondary group-hover:fill-red-400"
        />
      </div>
      <div class="p-1">
        <DownIcon class="w-4 fill-textColor-secondary" />
      </div>
    </div>
    <div v-if="slots.dropdown" class="absolute top-full left-0 right-0">
      <slot name="dropdown" />
    </div>
  </div>
</template>
