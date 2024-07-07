<script setup lang="ts">
import XIcon from "@icons/x.svg";
import EditIcon from "@icons/edit.svg";
import CheckIcon from "@icons/check.svg";
import UInput from "@/components/UI/UInput.vue";
import { ref, watch } from "vue";
import { ILabel } from "@/types";
import EditLabel from "./EditLabel.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores";
import { computed } from "vue";

const emit = defineEmits(["update:labels", "close"]);

const props = defineProps<{
  labels: ILabel[];
}>();

const { user } = storeToRefs(useUserStore());

const tab = ref<"list" | "edit">("list");
const search = ref("");
const createdProjectLabels = ref<ILabel[]>(
  user.value!.createdProjectLabels || []
);
const editLabel = ref<ILabel>();

const activedLabels = computed({
  get: () => props.labels,
  set: (value) => {
    emit("update:labels", value);
  },
});

const handleToogleLabel = (label: ILabel) => {
  if (!activedLabels.value.includes(label)) {
    activedLabels.value.push(label);
  } else {
    const newActiveLabels = activedLabels.value.filter(
      (l) => l.name != label.name
    );

    activedLabels.value = newActiveLabels;
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

const sloseEditPopup = () => {
  closePopup();
  editLabel.value = undefined;
  tab.value = "list";
};

watch(search, () => {
  createdProjectLabels.value =
    user.value!.createdProjectLabels?.filter((l) =>
      l.name.toLowerCase().includes(search.value.toLowerCase())
    ) || [];
});

watch(
  () => user.value?.createdProjectLabels,
  (labels) => {
    search.value = "";
    createdProjectLabels.value =
      labels?.sort((l1, l2) =>
        l1.name.toLowerCase().localeCompare(l2.name.toLowerCase())
      ) || [];
  },
  { deep: true }
);
</script>

<template>
  <div
    class="absolute left-0 bottom-full mb-2 p-3 w-[300px] max-h-[600px] bg-bgColor-primary shadow rounded-lg"
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
            v-for="label in createdProjectLabels"
            :key="label.id"
            class="flex items-center cursor-pointer"
            :class="{ active: activedLabels.find((l) => l.id == label.id) }"
            @click="handleToogleLabel(label)"
          >
            <div
              class="w-4 h-4 flex flex-center rounded-sm parent-[.active]:bg-primary border border-textColor-secondary"
            >
              <CheckIcon
                v-if="activedLabels.find((l) => l.id == label.id)"
                class="w-3 fill-white"
              />
            </div>
            <div
              class="flex-1 px-3 mx-2 rounded text-[#44546f] font-medium leading-8"
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
      @close="sloseEditPopup"
      @back="
        () => {
          editLabel = undefined;
          tab = 'list';
        }
      "
    />
  </div>
</template>
