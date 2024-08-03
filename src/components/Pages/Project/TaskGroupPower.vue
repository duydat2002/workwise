<script setup lang="ts">
import PowerIcon from "@icons/power.svg";
import USelect from "@/components/UI/USelect.vue";
import { IOption, ITaskGroup } from "@/types";
import { ref } from "vue";
import Popper from "vue3-popper";

const showPowerTaskGroup = ref<string>("");

const props = defineProps<{
  taskGroup: ITaskGroup;
  hasPermission: boolean | null;
}>();

const autoSelected = ref<"none" | "todo" | "inprogress" | "completed">("none");
const autoOptions = ref<IOption[]>([
  { key: "none", value: "Không tự động" },
  { key: "completed", value: "Đã hoàn thành" },
  { key: "inprogress", value: "Đang thực hiện" },
  { key: "todo", value: "Cần thực hiện" },
]);
</script>

<template>
  <div
    class="relative"
    v-click-outside.short="{
      handle: () => {
        showPowerTaskGroup = '';
      },
      excludes: ['.taskgroup_power'],
    }"
  >
    <Popper hover offsetDistance="8" content="Tự động">
      <div
        class="relative flex-shrink-0 flex flex-center w-7 h-7 p-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
        @click.stop="
          () => {
            showPowerTaskGroup = taskGroup.id;
          }
        "
      >
        <PowerIcon class="w-4 fill-white" />
      </div>
    </Popper>
    <div
      v-if="showPowerTaskGroup == taskGroup.id && hasPermission"
      class="taskgroup_power absolute mt-1 top-full left-1/2 -translate-x-1/2 min-w-full w-max max-w-[300px] bg-bgColor-primary rounded-lg shadow z-10"
    >
      <div class="flex flex-col px-3 py-2">
        <span class="font-semibold text-textColor-primary mb-2"
          >Quy trình tự động</span
        >
        <span class="text-textColor-secondary mb-2"
          >Hệ thống tự động chuyển trạng thái công việc khi công việc được
          chuyển đến cột này.</span
        >
        <div class="flex flex-col">
          <div class="flex items-center justify-between">
            <span class="text-textColor-primary mr-2">Trạng thái tự động</span>
            <USelect
              class="!min-h-8 !w-auto"
              v-model:selected="autoSelected"
              :options="autoOptions"
              padding="px-1 py-[1px]"
              placement="top-full min-w-full w-max right-0 pt-1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
