<script setup lang="ts">
import SearchIcon from "@icons/search.svg";
import RecoveryIcon from "@icons/recovery.svg";
import DeleteIcon from "@icons/delete.svg";
import SidebarRight from "@/components/Layout/SidebarRight.vue";
import UInput from "@/components/UI/UInput.vue";
import { useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import UButton from "@/components/UI/UButton.vue";
import TaskItem from "../Task/TaskItem.vue";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import { deleteTaskGroup, unarchiveTaskGroup } from "@/services/taskGroup";
import { toast } from "vue3-toastify";
import { deleteTask, unarchiveTask } from "@/services/task";
import ArchiveTaskGroupItem from "./ArchiveTaskGroupItem.vue";

const emit = defineEmits(["close"]);

const { project } = storeToRefs(useProjectStore());
const search = ref("");
const tab = ref<"taskgroup" | "task">("taskgroup");
const isLoadingAction = ref("");
const showDeleteTaskGroup = ref("");
const showDeleteTask = ref("");

const taskGroups = computed(() => {
  return project.value?.taskGroups.filter(
    (g) =>
      g.isArchived && g.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const tasks = computed(() => {
  return project.value?.taskGroups
    .filter((g) => !g.isArchived)
    .flatMap((g) => g.tasks)
    .filter(
      (t) =>
        t.isArchived &&
        t.name.toLowerCase().includes(search.value.toLowerCase())
    );
});

const handleDeleteTaskGroup = async (taskGroupId: string) => {
  isLoadingAction.value = taskGroupId;
  const data = await deleteTaskGroup(taskGroupId);

  if (data.success) {
    toast.success("Đã xóa nhóm công việc.");
  }

  showDeleteTaskGroup.value = "";
  isLoadingAction.value = "";
};

const handleDeleteTask = async (taskId: string) => {
  isLoadingAction.value = taskId;
  const data = await deleteTask(taskId);

  if (data.success) {
    toast.success("Đã xóa công việc.");
  }

  showDeleteTask.value = "";
  isLoadingAction.value = "";
};

const handleUnarchiveTaskGroup = async (taskGroupId: string) => {
  isLoadingAction.value = taskGroupId;
  const data = await unarchiveTaskGroup(taskGroupId);

  if (data.success) {
    toast.success("Đã khôi phục nhóm công việc.");
  }

  isLoadingAction.value = "";
};

const handleUnarchiveTask = async (taskId: string) => {
  isLoadingAction.value = taskId;
  const data = await unarchiveTask(taskId);

  if (data.success) {
    toast.success("Đã khôi phục công việc.");
  }

  isLoadingAction.value = "";
};

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <SidebarRight title="Các mục đã lưu trữ" @close="handleClose">
    <div class="border-b-2 border-borderColor mb-2">
      <div class="-mb-[2px] flex items-center not-lastchild:mr-2">
        <div
          class="p-2 text-sm font-semibold transition-all duration-150 border-b-2 cursor-pointer"
          :class="
            tab == 'taskgroup'
              ? 'text-primary border-primary'
              : 'text-textColor-primary border-borderColor'
          "
          @click="
            () => {
              tab = 'taskgroup';
            }
          "
        >
          <span>Nhóm công việc</span>
        </div>
        <div
          class="p-2 text-sm font-semibold transition-all duration-150 border-b-2 cursor-pointer"
          :class="
            tab == 'task'
              ? 'text-primary border-primary'
              : 'text-textColor-primary border-borderColor'
          "
          @click="
            () => {
              tab = 'task';
            }
          "
        >
          <span>Công việc</span>
        </div>
      </div>
    </div>
    <div class="flex items-center px-3">
      <UInput
        class="flex-1"
        name="search_project"
        v-model:propValue="search"
        placeholder="Tìm kiếm theo tên"
      >
        <template #left>
          <SearchIcon class="w-4 fill-textColor-secondary" />
        </template>
      </UInput>
    </div>
    <div class="flex-1 h-full mt-4 mb-2 overflow-y-auto scroll-vert">
      <div class="flex flex-col px-3">
        <div v-if="tab == 'taskgroup'" class="">
          <div
            v-if="!taskGroups || taskGroups?.length > 0"
            v-for="taskGroup in taskGroups"
            :key="taskGroup.id"
            class="flex flex-col pb-2 border-b border-borderColor"
          >
            <ArchiveTaskGroupItem :taskGroup />
            <div class="flex items-center justify-end mt-2">
              <UButton
                class="mr-2"
                variantType="secondary"
                :isLoading="isLoadingAction == taskGroup.id"
                @click="handleUnarchiveTaskGroup(taskGroup.id)"
              >
                <div class="flex">
                  <RecoveryIcon class="w-4 fill-textColor-primary mr-1" />
                  <span class="text-textColor-primary">Khôi phục</span>
                </div>
              </UButton>
              <UButton
                variantType="error"
                @click="
                  () => {
                    showDeleteTaskGroup = taskGroup.id;
                  }
                "
              >
                <div class="flex">
                  <DeleteIcon class="w-4 fill-white mr-1" />
                  <span class="text-white">Xóa</span>
                </div>
              </UButton>
            </div>
          </div>
          <div v-else class="bg-bgColor-secondary p-3 rounded-lg">
            <span class="text-textColor-secondary"
              >Không có nhóm công việc nào đã lưu trữ</span
            >
          </div>
        </div>
        <div v-if="tab == 'task'" class="">
          <div
            v-if="!tasks || tasks?.length > 0"
            v-for="task in tasks"
            :key="task.id"
            class="flex flex-col pb-2 border-b border-borderColor"
          >
            <TaskItem :task />
            <div class="flex items-center justify-end mt-2">
              <UButton
                class="mr-2"
                variantType="secondary"
                :isLoading="isLoadingAction == task.id"
                @click="handleUnarchiveTask(task.id)"
              >
                <div class="flex">
                  <RecoveryIcon class="w-4 fill-textColor-primary mr-1" />
                  <span class="text-textColor-primary">Khôi phục</span>
                </div>
              </UButton>
              <UButton
                variantType="error"
                @click="
                  () => {
                    showDeleteTask = task.id;
                  }
                "
              >
                <div class="flex">
                  <DeleteIcon class="w-4 fill-white mr-1" />
                  <span class="text-white">Xóa</span>
                </div>
              </UButton>
            </div>
          </div>
          <div v-else class="bg-bgColor-secondary p-3 rounded-lg">
            <span class="text-textColor-secondary"
              >Không có công việc nào đã lưu trữ</span
            >
          </div>
        </div>
      </div>
    </div>
    <ConfirmPopup
      v-if="showDeleteTaskGroup != ''"
      id="confirm_delete_taskgroup"
      title="Xóa nhóm công việc?"
      confirmMessage="Xóa"
      desc="Tất cả mọi công việc và hành động liên quan sẽ bị xóa. Không thể hoàn tác."
      :isLoadingConfirm="isLoadingAction == showDeleteTaskGroup"
      @confirm="handleDeleteTaskGroup(showDeleteTaskGroup)"
      @cancel="
        () => {
          showDeleteTaskGroup = '';
        }
      "
    ></ConfirmPopup>
    <ConfirmPopup
      v-if="showDeleteTask != ''"
      id="confirm_delete_task"
      title="Xóa công việc?"
      confirmMessage="Xóa"
      desc="Tất cả mọi tài liệu, hành động liên quan sẽ bị xóa. Không thể hoàn tác."
      :isLoadingConfirm="isLoadingAction == showDeleteTask"
      @confirm="handleDeleteTask(showDeleteTask)"
      @cancel="
        () => {
          showDeleteTask = '';
        }
      "
    ></ConfirmPopup>
  </SidebarRight>
</template>
