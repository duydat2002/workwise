<script setup lang="ts">
import PlusIcon from "@icons/plus.svg";
import XIcon from "@icons/x.svg";
import { computed, onMounted, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import UTextarea from "@/components/UI/UTextarea.vue";
import UButton from "@/components/UI/UButton.vue";
import { storeToRefs } from "pinia";
import { useProjectStore, useThemeStore } from "@/stores";
import { createTask } from "@/services/task";
import { ITask } from "@/types";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import { toast } from "vue3-toastify";
import TaskItem from "@/components/Pages/Task/TaskItem.vue";

interface IGroupStatus {
  id: string;
  name: string;
  color: string;
  tasks?: ITask[];
}

const { isDark } = storeToRefs(useThemeStore());
const { project, showProjectInfo } = storeToRefs(useProjectStore());

const taskName = ref("");
const taskNameErr = ref<string>();
const showCreateTask = ref<string>();
const showTaskGroupDropdown = ref(false);
const isLoadingAction = ref(false);
const isLoadingCreateTask = ref(false);
const taskGroupSelected = ref<IGroupStatus>();

const groups = ref<IGroupStatus[]>([]);
const taskGroups = computed(() => {
  return (
    project.value?.taskGroups.map(
      (g) =>
        ({
          id: g.id,
          name: g.name,
          color: g.color,
        } as IGroupStatus)
    ) ?? []
  );
});

const validateCreateTask = () => {
  taskNameErr.value = undefined;
  let check = true;

  if (taskName.value.trim() == "") {
    taskNameErr.value = "Không được để trống.";
    check = false;
  }

  return check;
};

const chooseTaskGroupCreate = (taskGroup: IGroupStatus) => {
  taskGroupSelected.value = taskGroup;
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

const activeCreateTask = (taskGroupId: string) => {
  taskNameErr.value = undefined;
  showCreateTask.value = taskGroupId;
};

const unactiveCreateTask = () => {
  showCreateTask.value = undefined;
};

onMounted(() => {
  let todoTasks: ITask[] = [];
  let inprogressTasks: ITask[] = [];
  let completedTasks: ITask[] = [];
  const tasks = project.value?.taskGroups.flatMap((g) => g.tasks);
  tasks?.forEach((t) => {
    if (t.status == "todo") {
      todoTasks.push(t);
    } else if (t.status == "inprogress") {
      inprogressTasks.push(t);
    } else {
      completedTasks.push(t);
    }
  });

  groups.value = [
    {
      id: "todo",
      name: "Cần thực hiện",
      color: "#64b5f6",
      tasks: todoTasks,
    },
    {
      id: "inprogress",
      name: "Đang thực hiện",
      color: "#f4c701",
      tasks: inprogressTasks,
    },
    {
      id: "completed",
      name: "Đã hoàn thành",
      color: "#83c683",
      tasks: completedTasks,
    },
  ];
});
</script>

<template>
  <div
    class="absolute top-0 left-0 w-full h-full flex items-start px-5 pb-3 overflow-x-scroll"
  >
    <VueDraggable
      class="flex h-full not-lastchild:mr-2"
      :animation="150"
      v-model="groups"
      handle=".header"
      chosenClass="chosen"
      dragClass="drag"
      ghostClass="ghost"
    >
      <div v-for="group in groups" :key="group.id" class="h-full">
        <div
          class="flex-shrink-0 flex flex-col max-h-full w-[250px] rounded-lg bg-bgColor-secondary overflow-visible"
        >
          <div
            class="header flex items-center p-1 rounded-tl-lg rounded-tr-lg"
            :style="{ background: group.color }"
          >
            <span
              class="flex-1 w-full px-2 py-[4px] text-sm font-semibold text-white rounded border border-solid border-transparent focus:border-primary cursor-pointer focus:cursor-auto"
              >{{ group.name }}</span
            >
          </div>
          <div
            class="flex-[1_1_auto] overflow-x-hidden overflow-y-auto scroll-vert"
          >
            <VueDraggable
              class="h-full px-2 py-2 not-lastchild:mb-2"
              v-model="group.tasks"
              :animation="150"
              chosenClass="chosen"
              dragClass="drag"
              ghostClass="ghost"
              group="task"
              :data-taskGroupId="group.id"
            >
              <div
                v-for="task in group.tasks?.filter((t) => !t.isArchived)"
                :key="task.id"
                :data-taskId="task.id"
              >
                <TaskItem :task showTaskGroup />
              </div>
              <div
                v-if="showCreateTask == group.id"
                class="flex flex-col p-2 bg-bgColor-primary rounded-lg"
              >
                <UTextarea
                  textareaClass="bg-bgColor-primary shadow-md "
                  v-model:value="taskName"
                  name="task_name"
                  placeholder="Nhập tên công việc..."
                  :errorMessage="taskNameErr"
                ></UTextarea>
                <div class="relative mt-3">
                  <div class="flex">
                    <span
                      class="text-sm px-2 py-[2px] bg-hover rounded-md font-medium text-textColor-primary cursor-pointer"
                      @click="
                        () => {
                          showTaskGroupDropdown = !showTaskGroupDropdown;
                        }
                      "
                      v-click-outside.short="{
                        handle: () => {
                          showTaskGroupDropdown = false;
                        },
                        excludes: ['.choose_dropdown'],
                      }"
                      >{{ taskGroupSelected?.name ?? taskGroups[0].name }}</span
                    >
                  </div>
                  <div
                    v-if="showTaskGroupDropdown"
                    class="choose_dropdown absolute bottom-full pb-2 left-0 min-w-full w-max z-10"
                  >
                    <div
                      class="flex flex-col p-2 bg-bgColor-primary rounded shadow overflow-hidden"
                    >
                      <div
                        v-for="tg in taskGroups"
                        :key="tg.id"
                        class="flex items-center px-2 py-[6px] rounded hover:bg-hover active:bg-hover cursor-pointer"
                        @click="chooseTaskGroupCreate(tg)"
                      >
                        {{ tg.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </VueDraggable>
          </div>
          <div class="px-3 mb-1">
            <div
              v-if="!showCreateTask || showCreateTask != group.id"
              class="group py-2 w-full flex items-center cursor-pointer"
              @click="activeCreateTask(group.id)"
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
  </div>
</template>
