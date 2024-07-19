<script setup lang="ts">
import SearchIcon from "@icons/search.svg";
import FilterIcon from "@icons/filter.svg";
import MoreIcon from "@icons/more.svg";
import BucketIcon from "@icons/bucket.svg";
import BarIcon from "@icons/bar.svg";
import PlusIcon from "@icons/plus.svg";
import XIcon from "@icons/x.svg";
import UInput from "@/components/UI/UInput.vue";
import { ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import UTextarea from "@/components/UI/UTextarea.vue";
import UButton from "@/components/UI/UButton.vue";
import { storeToRefs } from "pinia";
import { useProjectStore, useThemeStore } from "@/stores";
import {
  createTaskGroups,
  reorderTaskGroup,
  updateTaskGroup,
} from "@/services/taskGroup";
import { createTask } from "@/services/task";
import { ITaskGroup } from "@/types";

const emits = defineEmits(["hiddenInfo"]);

const { isDark } = storeToRefs(useThemeStore());
const { project } = storeToRefs(useProjectStore());

const DEFAULT_COLOR = "#93c5fd";
const search = ref("");
const taskName = ref("");
const taskNameErr = ref<string>();
const taskGroupName = ref("");
const taskGroupNameErr = ref<string>();
const taskGroupColor = ref(DEFAULT_COLOR);
const showCreateTaskGroup = ref(false);
const showCreateTask = ref<string>();

const validateCreateTaskGroup = () => {
  taskGroupNameErr.value = undefined;
  let check = true;

  if (taskGroupName.value.trim() == "") {
    taskGroupNameErr.value = "Không được để trống.";
    check = false;
  }

  return check;
};

const validateCreateTask = () => {
  taskNameErr.value = undefined;
  let check = true;

  if (taskName.value.trim() == "") {
    taskNameErr.value = "Không được để trống.";
    check = false;
  }

  return check;
};

const handleCreateTaskGroup = async () => {
  if (validateCreateTaskGroup()) {
    const data = await createTaskGroups(
      project.value!.id,
      taskGroupName.value,
      taskGroupColor.value
    );

    if (data.success) {
    }
  }
};

const handleCreateTask = async (taskGroupId: string) => {
  if (validateCreateTask()) {
    const data = await createTask(
      project.value!.id,
      taskGroupId,
      taskName.value
    );

    if (data.success) {
      showCreateTask.value = undefined;
    }
  }
};

const changeTaskGroupName = async (event: Event, taskGroup: ITaskGroup) => {
  const target = event.target as HTMLInputElement;
  console.log(target.value, taskGroup);
  const data = await updateTaskGroup(
    taskGroup.id,
    target.value.trim(),
    taskGroup.color
  );
  if (data.success) {
  } else {
  }
};

const changeTaskGroupColor = async (taskGroup: ITaskGroup) => {
  const data = await updateTaskGroup(
    taskGroup.id,
    taskGroup.name,
    taskGroup.color
  );
  if (data.success) {
  } else {
  }
};

const activeCreateTaskGroup = () => {
  emits("hiddenInfo");
  taskGroupNameErr.value = undefined;
  showCreateTaskGroup.value = true;
};

const handleReorderTaskGroup = async () => {
  const orders = project.value!.taskGroups.map((g) => g.id);
  const data = await reorderTaskGroup(project.value!.id, orders);

  if (data.success) {
  }
};

const unactiveCreateTaskGroup = () => {
  showCreateTaskGroup.value = false;
};

const activeCreateTask = (taskGroupId: string) => {
  taskNameErr.value = undefined;
  showCreateTask.value = taskGroupId;
};

const unactiveCreateTask = () => {
  showCreateTask.value = undefined;
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-wrap justify-between px-5 gap-3 pb-3">
      <div class="">
        <UInput
          class="w-[250px]"
          name="search_project"
          v-model:propValue="search"
          placeholder="Tìm kiếm công việc"
        >
          <template #left>
            <SearchIcon class="w-4 fill-textColor-secondary" />
          </template>
        </UInput>
      </div>
      <div class="flex flex-wrap not-lastchild:mr-2">
        <div
          class="relative flex items-center px-2 py-1 rounded-md hover:bg-hover cursor-pointer"
        >
          <FilterIcon class="w-4 fill-textColor-primary mr-1" />
          <span class="text-sm font-semibold text-textColor-primary">Lọc</span>
        </div>
        <div
          class="relative flex items-center px-2 py-1 rounded-md hover:bg-hover cursor-pointer"
        >
          <BarIcon class="w-4 fill-textColor-primary mr-1" />
          <span class="text-sm font-semibold text-textColor-primary"
            >Nhóm theo: Nhóm công việc</span
          >
        </div>
      </div>
    </div>
    <div class="relative flex-1 h-full">
      <div
        class="absolute top-0 left-0 w-full h-full flex items-start px-5 pb-3 overflow-x-scroll"
      >
        <VueDraggable
          class="flex h-full not-lastchild:mr-2"
          :animation="150"
          v-model="project!.taskGroups"
          handle=".header"
          chosenClass="chosen"
          dragClass="drag"
          ghostClass="ghost"
          :onSort="handleReorderTaskGroup"
        >
          <div
            v-for="taskGroup in project!.taskGroups"
            :key="taskGroup.id"
            class="h-full"
          >
            <div
              class="flex-shrink-0 flex flex-col max-h-full w-[250px] rounded-lg bg-bgColor-secondary overflow-hidden"
            >
              <div
                class="header flex items-center p-1"
                :style="{ background: taskGroup.color }"
              >
                <input
                  type="text"
                  class="flex-1 w-full px-2 py-[4px] text-sm font-semibold text-white rounded border border-solid border-transparent focus:border-primary cursor-pointer focus:cursor-auto"
                  :value="taskGroup.name"
                  @change="changeTaskGroupName($event, taskGroup)"
                />
                <div
                  class="relative flex-shrink-0 flex flex-center w-8 h-8 p-1 rounded hover:bg-hover active:bg-hover cursor-pointer ml-2"
                >
                  <BucketIcon class="w-4 fill-white" />
                  <div
                    class="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-0"
                  >
                    <ColorPicker
                      format="hex"
                      shape="square"
                      disable-alpha
                      lang="En"
                      v-on:update:pureColor="(color: string) => {taskGroup.color = color}"
                      v-on:pureColorChange="changeTaskGroupColor(taskGroup)"
                      :theme="isDark ? 'black' : 'white'"
                      :pure-color="taskGroup.color"
                    />
                  </div>
                </div>
                <div
                  class="flex-shrink-0 flex flex-center w-8 h-8 p-1 rounded hover:bg-hover active:bg-hover cursor-pointer ml-1"
                >
                  <MoreIcon class="w-3 fill-white" />
                </div>
              </div>
              <div
                class="flex-[1_1_auto] overflow-x-hidden overflow-y-auto scroll-vert"
              >
                <VueDraggable
                  class="h-full px-2 py-2 not-lastchild:mb-2"
                  v-model="taskGroup.tasks"
                  :animation="150"
                  chosenClass="chosen"
                  dragClass="drag"
                  ghostClass="ghost"
                  group="task"
                  :onSort="(event) => {}"
                >
                  <div v-for="task in taskGroup.tasks" :key="task.id">
                    <div
                      class="w-full px-3 py-2 rounded-md bg-bgColor-primary border border-borderColor cursor-pointer shadow-md"
                    >
                      {{ task.name }}
                    </div>
                  </div>
                  <div v-if="showCreateTask == taskGroup.id" class="py-1">
                    <UTextarea
                      textareaClass="bg-bgColor-primary shadow-md "
                      v-model:value="taskName"
                      name="task_name"
                      placeholder="Nhập tên công việc..."
                      :errorMessage="taskNameErr"
                    ></UTextarea>
                  </div>
                </VueDraggable>
              </div>
              <div class="px-3 mb-1">
                <div
                  v-if="!showCreateTask || showCreateTask != taskGroup.id"
                  class="group py-2 w-full flex items-center cursor-pointer"
                  @click="activeCreateTask(taskGroup.id)"
                >
                  <PlusIcon
                    class="w-3 fill-textColor-secondary group-hover:fill-primary"
                  />
                  <span
                    class="ml-2 text-sm font-semibold text-textColor-subtitle group-hover:text-primary"
                    >Thêm công việc</span
                  >
                </div>
                <div v-else class="flex pb-2">
                  <UButton
                    variantType="primary"
                    class="flex-1"
                    @click="handleCreateTask(taskGroup.id)"
                    ><span class="">Thêm công việc</span></UButton
                  >
                  <div
                    class="ml-2 flex flex-center w-8 h-8 rounded hover:bg-hover cursor-pointer"
                    @click="unactiveCreateTask"
                  >
                    <XIcon class="w-3 fill-textColor-secondary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VueDraggable>
        <div class="relative flex-shrink-0 w-[250px] ml-2">
          <div
            v-if="!showCreateTaskGroup"
            class="flex-shrink-0 px-3 py-[10px] flex items-center rounded-lg bg-bgColor-secondary hover:bg-hover active:bg-hover cursor-pointer"
            @click="activeCreateTaskGroup"
          >
            <PlusIcon class="w-3 fill-textColor-primary" />
            <span class="ml-2 text-sm font-semibold text-textColor-primary"
              >Thêm nhóm công việc khác</span
            >
          </div>
          <div
            v-else
            class="px-3 py-2 bg-bgColor-primary rounded-lg border border-borderColor shadow not-lastchild:mb-2"
            v-click-outside.short="{
              handle: unactiveCreateTaskGroup,
              excludes: ['.vc-colorpicker'],
            }"
          >
            <div class="flex flex-col">
              <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                >Tên nhóm công việc {{ taskGroupColor }}
              </label>
              <UTextarea
                class="bg-bgColor-primary"
                v-model:value="taskGroupName"
                name="taskgroup_name"
                placeholder="Nhập tên..."
                :minHeigth="32"
                :errorMessage="taskGroupNameErr"
              ></UTextarea>
            </div>
            <div class="flex">
              <span class="text-sm text-textColor-primary font-semibold mr-2"
                >Chọn màu:</span
              >
              <ColorPicker
                format="hex"
                shape="square"
                disable-alpha
                lang="En"
                v-on:update:pureColor="(color: string) => {taskGroupColor = color}"
                :theme="isDark ? 'black' : 'white'"
                :pure-color="DEFAULT_COLOR"
              />
            </div>
            <div class="flex">
              <UButton
                variantType="primary"
                class="flex-1"
                @click="handleCreateTaskGroup"
                ><span class="">Thêm nhóm công việc</span></UButton
              >
              <div
                class="ml-2 flex flex-center w-8 h-8 rounded hover:bg-hover cursor-pointer"
                @click="unactiveCreateTaskGroup"
              >
                <XIcon class="w-3 fill-textColor-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drag > div {
  @apply rotate-6;
}

.chosen:hover > div {
  @apply border-primary;
}

.ghost {
  @apply opacity-50;
}
</style>
