<script setup lang="ts">
import { IOption } from "@/types";
import DownIcon from "@icons/down.svg";
import { ref } from "vue";

const emit = defineEmits(["update:selected", "choose", "change"]);

defineProps<{
  placeholder?: string;
  selected?: string;
  options: IOption[];
  isDisabled?: boolean;
}>();

const isShowDropdown = ref(false);

const handleClick = (option: IOption) => {
  if (!option.disabled) {
    emit("update:selected", option.key);
    emit("choose", option);
    emit("change");
    handleHidden();
  }
};

const handleShow = () => {
  isShowDropdown.value = !isShowDropdown.value;
};

const handleHidden = () => {
  isShowDropdown.value = false;
};
</script>

<template>
  <div
    class="relative flex flex-center w-full min-h-[36px] rounded border border-borderColor has-[.focus]:border-primary-light cursor-pointer has-[.disabled]:pointer-events-none has-[.disabled]:opacity-80"
    :class="{ disabled: isDisabled }"
    v-click-outside.short="handleHidden"
  >
    <div class="flex w-full h-full items-center px-3 py-1" @click="handleShow">
      <span
        v-if="!selected"
        class="flex-1 text-sm text-textColor-secondary text-dots"
        >{{ placeholder }}</span
      >
      <span v-else class="flex-1 text-sm text-textColor-primary text-dots">{{
        options.find((o) => o.key == selected)?.value
      }}</span>
      <DownIcon class="w-4 fill-textColor-secondary ml-2" />
    </div>
    <div
      v-if="isShowDropdown"
      class="absolute left-0 right-0 top-full pt-1 z-10"
    >
      <div class="flex-col bg-bgColor-primary shadow">
        <div
          v-for="option in options"
          :key="option.key"
          class="px-3 py-2 text-sm text-textColor-subtitle hover:bg-hover active:bg-hover has-[.active]:bg-primary-extraLight has-[.active]:text-primary has-[.disabled]:op-75 has-[.disabled]:cursor-not-allowed cursor-pointer"
          :class="{ active: selected == option.key, disabled: option.disabled }"
          @click="handleClick(option)"
        >
          {{ option.value }}
        </div>
      </div>
    </div>
  </div>
</template>
