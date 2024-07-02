<script setup lang="ts">
import XIcon from "@icons/x.svg";
import EditIcon from "@icons/edit.svg";
import CheckIcon from "@icons/check.svg";
import UInput from "@/components/UI/UInput.vue";
import { ref } from "vue";
import { ILabel } from "@/types";
import EditLabel from "./EditLabel.vue";

const emit = defineEmits(["close"]);

const tab = ref<"list" | "edit">("list");
const search = ref("");
const activeLabels = ref<ILabel[]>([]);
const labels = ref<ILabel[]>([
  {
    name: "Game",
    color: "#fea362",
    colorName: "Cam",
  },
  {
    name: "Work",
    color: "#7ee2b8",
    colorName: "Xanh lá",
  },
  {
    name: "Frontend",
    color: "#f87168",
    colorName: "Đỏ",
  },
  {
    name: "Backend",
    color: "#9f8fef",
    colorName: "Tím",
  },
]);
const editLabel = ref<ILabel>();

const handleToogleLabel = (label: ILabel) => {
  if (!activeLabels.value.includes(label)) {
    activeLabels.value.push(label);
  } else {
    const newActiveLabels = activeLabels.value.filter(
      (l) => l.name != label.name
    );

    activeLabels.value = newActiveLabels;
  }
};

const handleCreateLabel = () => {
  editLabel.value = undefined;
  tab.value = "edit";
};

const handleEditLabel = (label: ILabel) => {
  editLabel.value = label;
  tab.value = "edit";
};

const closePopup = () => {
  emit("close");
};
</script>

<template>
  <div
    class="absolute left-0 bottom-0 p-3 w-[300px] max-h-[600px] bg-bgColor-primary shadow rounded-lg"
    v-click-outside.short="closePopup"
  >
    <template v-if="tab == 'list'">
      <div class="relative flex flex-center">
        <span class="text-base text-textColor-primary font-semibold">Nhãn</span>
        <div
          class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
          @click="closePopup"
        >
          <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
        </div>
      </div>
      <div class="mt-3">
        <UInput
          class="w-[250px]"
          name="search_label"
          v-model:propValue="search"
          placeholder="Tìm nhãn"
        >
        </UInput>
      </div>
      <div class="mt-3 flex flex-col">
        <span class="mb-1 text-xs font-bold text-textColor-subtitle">Nhãn</span>
        <div class="flex flex-col not-lastchild:mb-1">
          <div
            v-for="label in labels"
            :key="label.name"
            class="flex items-center cursor-pointer"
            :class="{ active: activeLabels.includes(label) }"
            @click="handleToogleLabel(label)"
          >
            <div
              class="w-4 h-4 flex flex-center rounded-sm parent-[.active]:bg-primary border border-textColor-secondary"
            >
              <CheckIcon class="w-3 fill-white" />
            </div>
            <div
              class="flex-1 px-3 mx-2 rounded text-textColor-subtitle font-medium leading-8"
              :style="{ background: label.color }"
            >
              <span>{{ label.name }}</span>
            </div>
            <div
              class="w-8 h-8 flex flex-center rounded hover:bg-bgColor-secondary"
              @click.stop="handleEditLabel(label)"
            >
              <EditIcon class="w-4 fill-textColor-primary" />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <div
          class="px-3 py-[6px] text-sm font-semibold text-center text-textColor-primary bg-bgColor-secondary rounded-md hover:bg-hover active:bg-hover cursor-pointer"
          @click="handleCreateLabel"
        >
          <span>Tạo nhãn mới</span>
        </div>
      </div>
    </template>
    <EditLabel
      v-else
      :label="editLabel"
      @close="
        () => {
          editLabel = undefined;
          tab = 'list';
        }
      "
    />
  </div>
</template>
