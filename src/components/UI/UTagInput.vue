<script setup lang="ts">
import XIcon from "@icons/x.svg";
import CheckIcon from "@icons/check.svg";
import XCircleIcon from "@icons/x-circle.svg";
import DownIcon from "@icons/down.svg";
import { InputTypeHTMLAttribute, computed, ref, useSlots } from "vue";
import { IOption } from "@/types";

const emit = defineEmits([
  "update:selecteds",
  "update:search",
  "focus",
  "blur",
  "choose",
  "deleteItem",
  "deleteAllItem",
]);

const props = withDefaults(
  defineProps<{
    search: string;
    selecteds: IOption[];
    options: IOption[];
    name?: string;
    type?: InputTypeHTMLAttribute;
    placeholder?: string;
    id?: string;
  }>(),
  {
    type: "text",
  }
);

const slots = useSlots();

const optionsShow = ref<IOption[]>(props.options);
const isFocus = ref(false);
const isShowDropdown = ref(false);
const input = ref<HTMLInputElement>();

const searchComp = computed({
  get: () => props.search,
  set: (value) => {
    emit("update:search", value);
  },
});

const selectedsComp = computed({
  get: () => props.selecteds,
  set: (value) => {
    emit("update:selecteds", value);
  },
});

const focusInput = () => {
  isFocus.value = true;
  isShowDropdown.value = true;
  input.value?.focus();
  emit("focus");
};

const blurInput = () => {
  isFocus.value = false;
  isShowDropdown.value = false;
  input.value?.blur();
  emit("blur");
};

const handleDeleteItem = (item: IOption) => {
  const newActiveTags = selectedsComp.value.filter((s) => s.key != item.key);

  selectedsComp.value = newActiveTags;
};

const handleChoose = (item: IOption) => {
  if (selectedsComp.value.findIndex((s) => s.key == item.key) == -1) {
    selectedsComp.value = [...selectedsComp.value, item];
  } else {
    handleDeleteItem(item);
  }
};

const handleDeleteAllTag = () => {
  selectedsComp.value = [];
};

// watch(search, () => {
//   optionsShow.value = props.options.filter((o) =>
//     o.value.toLowerCase().includes(search.value.toLowerCase())
//   );
// });
</script>

<template>
  <div
    class="relative flex items-center px-3 py-1 min-h-[36px] rounded border border-borderColor has-[.focus]:border-primary-light"
    :class="{ focus: isFocus }"
    @click="focusInput"
    v-click-outside.short="blurInput"
  >
    <div class="flex-1 flex flex-wrap items-center gap-1">
      <div
        v-for="item in selectedsComp"
        :key="item.key"
        class="flex items-center px-1 py-[2px] bg-bgColor-secondary rounded"
      >
        <span class="text-xs mr-1 text-textColor-primary">{{
          item.value
        }}</span>
        <div
          class="p-1 group hover:bg-red-200 rounded-full cursor-pointer"
          @click="handleDeleteItem(item)"
        >
          <XIcon class="w-2 fill-textColor-secondary group-hover:fill-error" />
        </div>
      </div>
      <input
        ref="input"
        class="flex-1 h-5 min-w-5 text-textColor-primary"
        :placeholder="placeholder"
        v-model="searchComp"
      />
    </div>
    <div class="flex items-center">
      <div
        v-if="selectedsComp.length > 0"
        class="p-1 group cursor-pointer"
        @click.stop="handleDeleteAllTag"
      >
        <XCircleIcon
          class="w-3 fill-textColor-secondary group-hover:fill-red-400"
        />
      </div>
      <div class="p-1">
        <DownIcon class="w-4 fill-textColor-secondary" />
      </div>
    </div>
    <div
      v-if="isShowDropdown"
      class="absolute top-full left-0 right-0 pt-1 z-10"
    >
      <div class="flex-col bg-bgColor-primary shadow">
        <div
          v-if="!slots.dropdown"
          v-for="option in optionsShow"
          :key="option.key"
          class="w-full flex items-center px-3 py-2 text-sm text-textColor-subtitle hover:bg-hover active:bg-hover has-[.active]:bg-primary-extraLight has-[.active]:text-primary cursor-pointer"
          :class="{ active: selectedsComp.find((s) => s.key == option.key) }"
          @click="handleChoose(option)"
        >
          <div
            class="w-4 h-4 flex flex-center rounded-sm parent-[.active]:bg-primary border border-textColor-secondary"
          >
            <CheckIcon
              v-if="selectedsComp.find((s) => s.key == option.key)"
              class="w-3 fill-white"
            />
          </div>
        </div>
        <slot name="dropdown"></slot>
        <!-- <div v-else class="" v-for="option in optionsShow" :key="option.key">
          <slot name="item" :item="option"></slot>
        </div> -->
      </div>
    </div>
  </div>
</template>
