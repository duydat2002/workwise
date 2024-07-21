<script setup lang="ts">
import MoreIcon from "@icons/more.svg";
import BucketIcon from "@icons/bucket.svg";
import PlusIcon from "@icons/plus.svg";
import XIcon from "@icons/x.svg";
import ArchiveIcon from "@icons/archive.svg";
import DeleteIcon from "@icons/delete.svg";
import { ref } from "vue";
import { SortableEvent, VueDraggable } from "vue-draggable-plus";
import UTextarea from "@/components/UI/UTextarea.vue";
import UButton from "@/components/UI/UButton.vue";
import { storeToRefs } from "pinia";
import { useProjectStore, useThemeStore } from "@/stores";
import {
  archiveTaskGroup,
  createTaskGroups,
  deleteTaskGroup,
  reorderTaskGroup,
  updateTaskGroup,
} from "@/services/taskGroup";
import { createTask, reorderTask } from "@/services/task";
import { ITaskGroup } from "@/types";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import { toast } from "vue3-toastify";
import TaskItem from "@/components/Pages/Task/TaskItem.vue";

const { isDark } = storeToRefs(useThemeStore());
const { project, showProjectInfo } = storeToRefs(useProjectStore());

const DEFAULT_COLOR = "#93c5fd";
const taskName = ref("");
const taskNameErr = ref<string>();
const taskGroupName = ref("");
const taskGroupNameErr = ref<string>();
const taskGroupColor = ref(DEFAULT_COLOR);
const showCreateTaskGroup = ref(false);
const showCreateTask = ref<string>();
const showOptionTaskGroup = ref<string>("");
const showArchiveTaskGroup = ref<string>("");
const showDeleteTaskGroup = ref<string>("");
const isLoadingAction = ref(false);
const isLoadingCreateTaskGroup = ref(false);
const isLoadingCreateTask = ref(false);

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
  isLoadingCreateTaskGroup.value = true;
  if (validateCreateTaskGroup()) {
    const data = await createTaskGroups(
      project.value!.id,
      taskGroupName.value,
      taskGroupColor.value
    );

    if (data.success) {
      taskGroupName.value = "";
    }
  }
  isLoadingCreateTaskGroup.value = false;
};

const handleCreateTask = async (taskGroupId: string) => {
  isLoadingCreateTask.value = true;
  if (validateCreateTask()) {
    const data = await createTask(
      project.value!.id,
      taskGroupId,
      taskName.value
    );

    if (data.success) {
      taskName.value = "";
      showCreateTask.value = undefined;
    }
  }
  isLoadingCreateTask.value = false;
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
  showProjectInfo.value = false;
  taskGroupNameErr.value = undefined;
  showCreateTaskGroup.value = true;
};

const handleReorderTaskGroup = async () => {
  const orders = project.value!.taskGroups.map((g) => g.id);
  const data = await reorderTaskGroup(project.value!.id, orders);

  if (data.success) {
  }
};

const handleReorderTask = async (event: SortableEvent) => {
  console.log(event);
  const taskId = event.item.dataset.taskid;
  const fromTaskGroupId = event.from.dataset.taskgroupid;
  const toTaskGroupId = event.to.dataset.taskgroupid;
  const orders = project
    .value!.taskGroups.find((g) => g.id == toTaskGroupId)
    ?.tasks.map((t) => t.id);

  if (taskId && fromTaskGroupId && toTaskGroupId && orders) {
    const data = await reorderTask(
      taskId,
      fromTaskGroupId,
      toTaskGroupId,
      orders
    );

    if (data.success) {
    }
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

const handleArchiveTaskGroup = async (taskGroupId: string) => {
  isLoadingAction.value = true;
  const data = await archiveTaskGroup(taskGroupId);

  if (data.success) {
    toast.success("Đã lưu trữ nhóm công việc.");
  }

  showOptionTaskGroup.value = "";
  showArchiveTaskGroup.value = "";
  isLoadingAction.value = false;
};

const handleDeleteTaskGroup = async (taskGroupId: string) => {
  isLoadingAction.value = true;
  const data = await deleteTaskGroup(taskGroupId);

  if (data.success) {
    toast.success("Đã xóa nhóm công việc.");
  }

  showOptionTaskGroup.value = "";
  showDeleteTaskGroup.value = "";
  isLoadingAction.value = false;
};
</script>

<template>
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
        v-for="taskGroup in project!.taskGroups.filter(g => !g.isArchived)"
        :key="taskGroup.id"
        class="h-full"
      >
        <div
          class="flex-shrink-0 flex flex-col max-h-full w-[250px] rounded-lg bg-bgColor-secondary overflow-visible"
        >
          <div
            class="header flex items-center p-1 rounded-tl-lg rounded-tr-lg"
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
                class="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-0 overflow-hidden"
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
              class="relative"
              v-click-outside.short="{
                handle: () => {
                  showOptionTaskGroup = '';
                },
                excludes: [
                  '.taskgroup_options',
                  '.confirm_archive_taskgroup',
                  '.confirm_delete_taskgroup',
                ],
              }"
            >
              <div
                class="flex-shrink-0 flex flex-center w-8 h-8 p-1 rounded hover:bg-hover active:bg-hover cursor-pointer ml-1"
                @click.stop="
                  () => {
                    showOptionTaskGroup = taskGroup.id;
                  }
                "
              >
                <MoreIcon class="w-3 fill-white" />
              </div>
              <div
                v-if="showOptionTaskGroup == taskGroup.id"
                class="taskgroup_options absolute mt-1 top-full right-0 w-max bg-bgColor-primary overflow-hidden rounded-lg shadow z-10"
              >
                <div class="flex flex-col">
                  <div
                    class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                    @click="
                      () => {
                        showArchiveTaskGroup = taskGroup.id;
                      }
                    "
                  >
                    <ArchiveIcon class="w-4 fill-textColor-primary mr-2" />
                    <span class="text-sm text-textColor-primary"
                      >Lưu trữ nhóm công việc</span
                    >
                  </div>
                  <div
                    class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                    @click="
                      () => {
                        showDeleteTaskGroup = taskGroup.id;
                      }
                    "
                  >
                    <DeleteIcon class="w-4 fill-error mr-2" />
                    <span class="text-sm text-error">Xóa nhóm công việc</span>
                  </div>
                </div>
              </div>
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
              :data-taskGroupId="taskGroup.id"
              :onEnd="handleReorderTask"
            >
              <div
                v-for="task in taskGroup.tasks.filter((t) => !t.isArchived)"
                :key="task.id"
                :data-taskId="task.id"
              >
                <TaskItem :task />
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
                :isLoading="isLoadingCreateTask"
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
            >Tên nhóm công việc
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
            :isLoading="isLoadingCreateTaskGroup"
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
  <ConfirmPopup
    v-if="showArchiveTaskGroup != ''"
    id="confirm_archive_taskgroup"
    title="Lưu trữ nhóm công việc?"
    confirmMessage="Lưu trữ"
    :isLoadingConfirm="isLoadingAction"
    @confirm="handleArchiveTaskGroup(showArchiveTaskGroup)"
    @cancel="
      () => {
        showArchiveTaskGroup = '';
        showOptionTaskGroup = '';
      }
    "
  >
    <div class="w-full py-2">
      <span class="text-textColor-secondary mr-1"
        >Bạn có thể tìm và khôi phục lại các nhóm công việc đã lưu trữ ở trang
        chi tiết dự án -> cài đặt -> các mục đã lưu trữ
      </span>
    </div>
  </ConfirmPopup>
  <ConfirmPopup
    v-if="showDeleteTaskGroup != ''"
    id="confirm_delete_taskgroup"
    title="Xóa nhóm công việc?"
    confirmMessage="Xóa"
    desc="Tất cả mọi công việc và hành động liên quan sẽ bị xóa. Không thể hoàn tác."
    :isLoadingConfirm="isLoadingAction"
    @confirm="handleDeleteTaskGroup(showDeleteTaskGroup)"
    @cancel="
      () => {
        showDeleteTaskGroup = '';
        showOptionTaskGroup = '';
      }
    "
  ></ConfirmPopup>
</template>
