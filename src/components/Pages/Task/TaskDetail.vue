<script setup lang="ts">
import XIcon from "@icons/x.svg";
import MoreIcon from "@icons/more.svg";
import ListIcon from "@icons/list.svg";
import PlusIcon from "@icons/plus.svg";
import SearchIcon from "@icons/search.svg";
import InfoIcon from "@icons/info-circle.svg";
import DownIcon from "@icons/down.svg";
import UploadIcon from "@icons/upload.svg";
import ArchiveIcon from "@icons/archive.svg";
import UnarchiveIcon from "@icons/unarchive.svg";
import DeleteIcon from "@icons/delete.svg";
import PriorityLowestIcon from "@icons/priority-lowest.svg";
import PriorityLowIcon from "@icons/priority-low.svg";
import PriorityMediumIcon from "@icons/priority-medium.svg";
import PriorityHighIcon from "@icons/priority-high.svg";
import LoadingIcon from "@icons/loading.svg";
import Modal from "@/components/Modal/Modal.vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useProjectStore, useThemeStore, useUserStore } from "@/stores";
import { computed, shallowRef, watch } from "vue";
import { ref } from "vue";
import {
  archiveTask,
  assignTask,
  changeStatusTask,
  deleteTask,
  getTaskById,
  unarchiveTask,
  updateTask,
} from "@/services/task";
import UInput from "@/components/UI/UInput.vue";
import { ILabel, IMember, IOption, ITask } from "@/types";
import UTextarea from "@/components/UI/UTextarea.vue";
import USelect from "@/components/UI/USelect.vue";
import LabelPopup from "@/components/Popup/LabelPopup/LabelPopup.vue";
import Avatar from "@/components/Common/Avatar.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { formatDate } from "@/helpers";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const { user } = storeToRefs(useUserStore());
const { theme } = storeToRefs(useThemeStore());
const { project, task } = storeToRefs(useProjectStore());

const taskTemp = ref<ITask | null>(null);
const searchAssignee = ref("");
const isLoadingTask = ref(false);
const activeLabelPopup = ref(false);
const showSelected = ref<"activities" | "comments">("activities");
const showOptions = ref<IOption[]>([
  { key: "activities", value: "Lịch sử hoạt động" },
  { key: "comments", value: "Bình luận" },
]);
const priorities = shallowRef([
  { key: "high", name: "Cao", icon: PriorityHighIcon },
  { key: "medium", name: "Trung bình", icon: PriorityMediumIcon },
  { key: "low", name: "Thấp", icon: PriorityLowIcon },
  { key: "none", name: "Không", icon: PriorityLowestIcon },
]);
const showStatusDropdown = ref(false);
const showAssigneeDropdown = ref(false);
const showPriorityDropdown = ref(false);
const showTaskOption = ref(false);
const showArchiveConfirm = ref(false);
const showDeleteConfirm = ref(false);
const isLoadingAction = ref(false);

const isAdmin = computed(() => {
  return project.value?.members.some(
    (m) => m.role == "admin" && m.user.id == user.value?.id
  );
});

const members = computed(() => {
  return (
    project.value?.members.filter(
      (m) =>
        (m.user.fullname.includes(searchAssignee.value.trim()) ||
          m.user.email.includes(searchAssignee.value.trim())) &&
        m.status == "accepted"
    ) ?? []
  );
});

const hasPermission = computed(() => {
  return (
    project.value &&
    !project.value.isArchived &&
    !task.value?.isArchived &&
    project.value.members.some(
      (m) => m.role == "admin" && m.user.id == user.value?.id
    )
  );
});

const prioritySelected = computed(() => {
  return (
    priorities.value.find((p) => p.key == taskTemp.value?.priority ?? "none") ||
    priorities.value[0]
  );
});

const handleChangeName = async () => {
  if (taskTemp.value?.name != task.value?.name)
    await updateTask({
      id: taskTemp.value!.id,
      name: taskTemp.value!.name,
    } as ITask);
};

const handleChangeDesc = async () => {
  if (taskTemp.value?.description != task.value?.description)
    await updateTask({
      id: taskTemp.value!.id,
      description: taskTemp.value!.description,
    } as ITask);
};

const handleChangeStatus = async (
  status: "todo" | "inprogress" | "completed"
) => {
  taskTemp.value!.status = status;
  showStatusDropdown.value = false;
  if (task.value?.status != status)
    await changeStatusTask(taskTemp.value!.id, status);
};

const handleChooseAssignee = async (member?: IMember) => {
  const oldAssignee = taskTemp.value!.assignee;

  if (member) {
    taskTemp.value!.assignee = member.user;
  } else {
    taskTemp.value!.assignee = null;
  }
  showAssigneeDropdown.value = false;

  if (oldAssignee?.id != member?.user?.id) {
    await assignTask(task.value!.id, member?.user?.id);
  }
};

const handleChoosePriority = async (priority: string) => {
  taskTemp.value!.priority = priority as "none" | "low" | "medium" | "high";
  showPriorityDropdown.value = false;
  if (priority != task.value?.priority) {
    await updateTask({ id: taskTemp.value!.id, priority: priority } as ITask);
  }
};

const handleUpdateLabel = async (labels: ILabel[]) => {
  await updateTask(
    {
      id: taskTemp.value!.id,
    } as ITask,
    JSON.stringify(labels.map((l) => l.id))
  );
};

const handleArchiveTask = async () => {
  isLoadingAction.value = true;
  const data = await archiveTask(task.value!.id);

  if (data.success) {
    toast.success("Đã lưu trữ công việc.");
  }

  showTaskOption.value = false;
  isLoadingAction.value = false;
};

const handleUnarchiveTask = async () => {
  isLoadingAction.value = true;
  const data = await unarchiveTask(task.value!.id);

  if (data.success) {
    toast.success("Đã khôi phục công việc.");
  }

  showTaskOption.value = false;
  isLoadingAction.value = false;
};

const handleDeleteTask = async () => {
  isLoadingAction.value = true;
  const data = await deleteTask(task.value!.id);

  if (data.success) {
    toast.success("Đã xóa công việc.");
  }

  showTaskOption.value = false;
  isLoadingAction.value = false;
};

const closeModal = () => {
  task.value = null;
  if (route.meta.isFromProject) {
    router.back();
  } else {
    router.push({
      name: "Project",
      params: { projectId: project.value!.id },
    });
  }
};

watch(
  () => route.query.taskSelected,
  async () => {
    if (route.query.taskSelected) {
      isLoadingTask.value = true;
      const data = await getTaskById(route.query.taskSelected.toString());

      if (data.success) {
        task.value = data.result!.task;
        taskTemp.value = Object.assign({}, task.value);
      } else {
        task.value = null;
      }

      isLoadingTask.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => task,
  () => {
    console.log("task updated");
    taskTemp.value = Object.assign({}, task.value);
  },
  { deep: true }
);

watch(
  () => taskTemp.value?.startDate,
  async (startDate) => {
    if (task.value && startDate != task.value!.startDate) {
      await updateTask({ id: taskTemp.value!.id, startDate } as ITask);
    }
  }
);

watch(
  () => taskTemp.value?.dueDate,
  async (dueDate) => {
    if (task.value && dueDate != task.value!.dueDate) {
      await updateTask({ id: taskTemp.value!.id, dueDate } as ITask);
    }
  }
);
</script>

<template>
  <Modal @click-outside="closeModal" margin="my-5 mx-10">
    <div class="flex flex-center w-full">
      <div
        class="flex flex-col h-[calc(100vh-40px)] w-full max-w-[1000px] bg-bgColor-primary pb-3 rounded-lg"
      >
        <div v-if="isLoadingTask" class="flex-1 h-full flex flex-center">
          <LoadingIcon class="w-6 fill-textColor-secondary animate-spin" />
        </div>
        <template v-else-if="taskTemp && task && project">
          <div
            v-if="task.isArchived"
            class="px-3 py-2 flex flex-center bg-primary-extraLight rounded-tl-lg rounded-tr-lg"
          >
            <InfoIcon class="w-5 fill-primary-light" />
            <span class="mx-2"
              >Công việc này đã được lưu trữ. Khôi phục công việc để thực hiện
              thay đổi.</span
            >
            <template v-if="isAdmin">
              <span
                v-if="!isLoadingAction"
                class="text-link hover:underline active:underline cursor-pointer"
                @click="handleUnarchiveTask"
                >Khôi phục công việc</span
              >
              <span v-else class="text-textColor-secondary"
                >Đang khôi phục công việc...</span
              >
            </template>
          </div>
          <div class="px-4 mt-3 flex items-center justify-between">
            <div class="flex flex-center">
              <div
                class="w-8 h-6 bg-cover bg-center aspect-video mr-2"
                :style="{
                  backgroundImage: `url(${taskTemp?.project?.background})`,
                }"
              ></div>
              <span
                class="text-sm font-semibold text-textColor-primary text-dots mr-2"
                >{{ taskTemp?.project?.name }} /</span
              >
              <ListIcon class="w-4 fill-textColor-secondary mx-1" />
              <span
                class="text-sm font-semibold text-textColor-primary text-dots mr-2"
                >{{ taskTemp.taskGroup.name }}</span
              >
            </div>
            <div class="flex">
              <div
                class="relative"
                v-click-outside.short="{
                  handle: () => {
                    showTaskOption = false;
                  },
                  excludes: ['#confirm_archive_task', '#confirm_delete_task'],
                }"
              >
                <div
                  class="flex flex-center h-8 w-8 rounded-md hover:bg-hover active:bg-hover cursor-pointer"
                  @click.stop="
                    () => {
                      console.log('object');
                      showTaskOption = !showTaskOption;
                    }
                  "
                >
                  <MoreIcon class="w-4 fill-textColor-primary" />
                </div>
                <div
                  v-if="showTaskOption"
                  class="absolute mt-1 top-full right-0 w-max bg-bgColor-primary overflow-hidden rounded-lg shadow z-10"
                >
                  <div class="flex flex-col">
                    <template v-if="isAdmin">
                      <div
                        v-if="!task.isArchived"
                        class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                        @click="
                          () => {
                            showArchiveConfirm = true;
                          }
                        "
                      >
                        <ArchiveIcon class="w-4 fill-textColor-primary mr-2" />
                        <span class="text-sm text-textColor-primary"
                          >Lưu trữ công việc</span
                        >
                      </div>
                      <div
                        v-else
                        class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                        @click="handleUnarchiveTask"
                      >
                        <UnarchiveIcon
                          class="w-4 fill-textColor-primary mr-2"
                        />
                        <span class="text-sm text-textColor-primary"
                          >Khôi phục công việc</span
                        >
                      </div>
                    </template>
                    <div
                      v-if="isAdmin"
                      class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                      @click="
                        () => {
                          showDeleteConfirm = true;
                        }
                      "
                    >
                      <DeleteIcon class="w-4 fill-error mr-2" />
                      <span class="text-sm text-error">Xóa công việc</span>
                    </div>
                  </div>
                  <ConfirmPopup
                    v-if="showArchiveConfirm"
                    id="confirm_archive_task"
                    title="Lưu trữ công việc?"
                    confirmMessage="Lưu trữ"
                    :isLoadingConfirm="isLoadingAction"
                    @confirm="handleArchiveTask"
                    @cancel="
                      () => {
                        showArchiveConfirm = false;
                        showTaskOption = false;
                      }
                    "
                  >
                    <div class="w-full py-2">
                      <span class="text-textColor-secondary mr-1"
                        >Bạn có thể tìm và khôi phục lại các công việc đã lưu
                        trữ.
                        <br />
                        Xem các công việc đã lưu trữ ở trang chi tiết dự án ->
                        cài đặt -> các mục đã lưu trữ
                      </span>
                    </div>
                  </ConfirmPopup>
                  <ConfirmPopup
                    v-if="showDeleteConfirm"
                    id="confirm_delete_task"
                    title="Xóa công việc?"
                    confirmMessage="Xóa"
                    desc="Tất cả bình luận và hành động sẽ bị xóa. Không thể hoàn tác."
                    :isLoadingConfirm="isLoadingAction"
                    @confirm="handleDeleteTask"
                    @cancel="
                      () => {
                        showDeleteConfirm = false;
                        showTaskOption = false;
                      }
                    "
                  ></ConfirmPopup>
                </div>
              </div>
              <div
                class="flex flex-center h-8 w-8 rounded-md hover:bg-hover active:bg-hover cursor-pointer"
                title="Thoát"
                @click="closeModal"
              >
                <XIcon class="w-3 fill-textColor-secondary" />
              </div>
            </div>
          </div>
          <div class="flex-1 flex mt-3 overflow-hidden">
            <div
              class="flex-1 flex flex-col not-lastchild:mb-3 px-4 overflow-y-auto scroll-vert border-r border-borderColor"
            >
              <div class="-ml-2">
                <UInput
                  v-model:propValue="taskTemp.name"
                  placeholder="Nhập tên công việc"
                  padding="p-2"
                  fontSize="text-base font-semibold"
                  :hasBorder="false"
                  hasButtons
                  :disabled="!hasPermission"
                  @confirm="handleChangeName"
                  @cancel="() => {taskTemp!.name = task!.name}"
                />
              </div>
              <div class="relative flex flex-col">
                <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                  >Nhãn
                </label>
                <div class="flex items-center not-lastchild:mr-1">
                  <span
                    v-for="label in taskTemp.labels"
                    :key="label.name"
                    class="px-3 py-1 text-sm font-semibold text-[#44546f] rounded-md cursor-pointer"
                    :style="{ background: label.color }"
                    >{{ label.name }}</span
                  >
                  <span
                    v-if="hasPermission"
                    class="add-label px-3 py-2 bg-bgColor-secondary hover:bg-hover rounded-md cursor-pointer"
                    title="Thêm nhãn"
                    @click="
                      () => {
                        activeLabelPopup = true;
                      }
                    "
                    ><PlusIcon class="w-3 fill-textColor-primary"
                  /></span>
                </div>
                <LabelPopup
                  v-if="activeLabelPopup"
                  :labels="project!.createdTaskLabels"
                  placement="top-full left-0 mt-2"
                  v-model:labelSelected="taskTemp.labels"
                  labelFor="Task"
                  @choose="handleUpdateLabel"
                  @close="
                    () => {
                      activeLabelPopup = false;
                    }
                  "
                />
              </div>
              <div class="flex flex-col">
                <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                  >Mô tả
                </label>
                <UTextarea
                  v-model:value="taskTemp.description!"
                  placeholder="Công việc này chưa có mô tả, hãy thêm mô tả cho công việc..."
                  :minHeigth="60"
                  :maxHeigth="120"
                  hasButtons
                  :disabled="!hasPermission"
                  @confirm="handleChangeDesc"
                  @cancel="() => {taskTemp!.description = task!.description}"
                />
              </div>
              <div class="flex flex-col">
                <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                  >Tài liệu đính kèm
                </label>
                <div
                  class="relative p-4 flex flex-col border rounded-md border-dashed border-borderColor"
                >
                  <div class=""></div>
                  <div class="group p-2 flex w-full flex-center cursor-pointer">
                    <UploadIcon
                      class="group-hover:fill-primary w-4 fill-textColor-primary mr-2"
                    />
                    <span
                      class="text-textColor-primary group-hover:text-primary"
                      >Tải tệp hoặc tải lên tại đây</span
                    >
                    <input
                      v-if="hasPermission"
                      type="file"
                      name="attachment"
                      class="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center justify-between">
                  <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                    >Hoạt động
                  </label>
                  <div class="flex items-center">
                    <span class="text-textColor-secondary mr-2">Hiển thị</span>
                    <USelect
                      class="min-h-6 !w-auto"
                      v-model:selected="showSelected"
                      :options="showOptions"
                      padding="px-1 py-[1px]"
                      placement="top-full min-w-full w-max right-0 pt-1"
                    />
                  </div>
                </div>
                <div class="flex-1">cac</div>
              </div>
            </div>
            <div
              class="h-full w-[380px] px-4 overflow-x-hidden overflow-y-auto scroll-vert"
            >
              <div class="flex flex-col">
                <div class="flex">
                  <div
                    class="relative"
                    v-click-outside.short="
                      () => {
                        showStatusDropdown = false;
                      }
                    "
                  >
                    <div
                      class="flex items-center px-[10px] py-[6px] hover:opacity-80 active:opacity-80 rounded cursor-pointer"
                      :class="[
                        taskTemp.status == 'todo'
                          ? 'bg-bgColor-secondary text-textColor-primary'
                          : taskTemp.status == 'inprogress'
                          ? 'bg-primary text-white'
                          : 'bg-green-500 text-white',
                      ]"
                      @click="
                        () => {
                          if (!project!.isArchived && !task?.isArchived)
                          showStatusDropdown = true;
                        }
                      "
                    >
                      <span class="text-sm font-semibold mr-2">{{
                        taskTemp.status == "todo"
                          ? "Cần thực hiện"
                          : taskTemp.status == "inprogress"
                          ? "Đang thực hiện"
                          : "Đã hoàn thành"
                      }}</span>
                      <DownIcon class="w-4 fill-current" />
                    </div>
                    <div
                      v-if="showStatusDropdown"
                      class="absolute top-full left-0 min-w-full w-max pt-1 z-10"
                    >
                      <div
                        class="flex flex-col bg-bgColor-primary rounded shadow overflow-hidden z-10"
                      >
                        <div
                          class="px-[10px] py-[6px] text-textColor-secondary font-medium hover:bg-hover active:bg-hover cursor-pointer"
                          @click="handleChangeStatus('todo')"
                        >
                          Cần thực hiện
                        </div>
                        <div
                          class="px-[10px] py-[6px] text-primary font-medium hover:bg-hover active:bg-hover cursor-pointer"
                          @click="handleChangeStatus('inprogress')"
                        >
                          Đang thực hiện
                        </div>
                        <div
                          class="px-[10px] py-[6px] text-green-500 font-medium hover:bg-hover active:bg-hover cursor-pointer"
                          @click="handleChangeStatus('completed')"
                        >
                          Đã hoàn thành
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col mt-4 rounded border border-borderColor p-3"
                >
                  <label
                    class="text-sm font-bold text-textColor-subtitle mb-2 pb-2 border-b border-borderColor"
                    >Chi tiết
                  </label>
                  <div class="flex flex-col py-1 not-lastchild:mb-4">
                    <div class="flex items-center">
                      <div class="w-2/5 font-medium text-textColor-subtitle">
                        Người thực hiện
                      </div>
                      <div class="w-3/5">
                        <div
                          class="relative"
                          v-click-outside.short="
                            () => {
                              showAssigneeDropdown = false;
                            }
                          "
                        >
                          <div
                            class="flex items-center px-2 py-1 bg-bgColor-secondary rounded hover:bg-hover active:bg-hover cursor-pointer"
                            @click="
                              () => {
                                if (hasPermission) showAssigneeDropdown = true;
                              }
                            "
                          >
                            <Avatar
                              class="w-6 mr-2"
                              :avatarUrl="taskTemp.assignee?.avatar"
                            />
                            <span class="text-dots">{{
                              taskTemp.assignee?.fullname ??
                              "Chọn người thực hiện"
                            }}</span>
                          </div>
                          <div
                            v-if="showAssigneeDropdown"
                            class="absolute top-full right-0 min-w-full w-[250px] pt-1 z-10"
                          >
                            <div
                              class="flex flex-col px-2 py-3 bg-bgColor-primary rounded shadow overflow-hidden z-10"
                            >
                              <UInput
                                v-model:propValue="searchAssignee"
                                placeholder="Tìm người thực hiện"
                                padding="px-2 py-1 min-h-auto"
                              >
                                <template #left>
                                  <SearchIcon
                                    class="w-4 flex-shrink-0 fill-textColor-secondary"
                                  />
                                </template>
                              </UInput>
                              <div
                                class="flex flex-col max-h-[200px] overflow-y-auto scroll-vert mt-3"
                              >
                                <div
                                  class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
                                  @click="handleChooseAssignee()"
                                >
                                  <Avatar class="w-6 mr-2" />
                                  <span class="text-dots font-medium">
                                    Không chỉ định
                                  </span>
                                </div>
                                <div
                                  v-for="member in members"
                                  :key="member.id"
                                  class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
                                  @click="handleChooseAssignee(member)"
                                >
                                  <Avatar
                                    class="w-6 mr-2"
                                    :avatarUrl="member.user.avatar"
                                  />
                                  <div class="flex flex-col">
                                    <span
                                      class="text-sm text-textColor-primary font-medium text-dots"
                                      >{{ member.user.fullname
                                      }}{{
                                        user!.id == member.user.id
                                          ? " (bạn)"
                                          : ""
                                      }}</span
                                    >
                                    <span
                                      class="text-sm text-textColor-secondary text-dots"
                                      >{{ member.user.email }}</span
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-2/5 font-medium text-textColor-subtitle">
                        Độ ưu tiên
                      </div>
                      <div class="w-3/5">
                        <div
                          class="relative"
                          v-click-outside.short="
                            () => {
                              showPriorityDropdown = false;
                            }
                          "
                        >
                          <div
                            class="flex items-center px-2 py-[6px] bg-bgColor-secondary rounded hover:bg-hover active:bg-hover cursor-pointer"
                            @click="
                              () => {
                                if (hasPermission) showPriorityDropdown = true;
                              }
                            "
                          >
                            <component
                              :is="prioritySelected.icon"
                              class="w-4 mr-2"
                            />
                            <span class="text-textColor-primary">{{
                              prioritySelected.name
                            }}</span>
                          </div>
                          <div
                            v-if="showPriorityDropdown"
                            class="absolute top-full right-0 min-w-full pt-1 z-10"
                          >
                            <div
                              class="flex flex-col p-2 bg-bgColor-primary rounded shadow overflow-hidden z-10"
                            >
                              <div
                                v-for="priority in priorities"
                                :key="priority.key"
                                class="flex items-center px-2 py-[6px] rounded hover:bg-hover active:bg-hover cursor-pointer"
                                @click="handleChoosePriority(priority.key)"
                              >
                                <component
                                  :is="priority.icon"
                                  class="w-4 mr-2"
                                />
                                <span class="text-textColor-primary">{{
                                  priority.name
                                }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-2/5 font-medium text-textColor-subtitle">
                        Ngày bắt đầu
                      </div>
                      <div class="w-3/5">
                        <VueDatePicker
                          v-model="taskTemp.startDate"
                          auto-apply
                          partial-flow
                          :enable-time-picker="false"
                          placeholder="mm/dd/yyyy"
                          format="dd/MM/yyyy"
                          :dark="theme == 'dark'"
                          position="right"
                          :disabled="!hasPermission"
                        ></VueDatePicker>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-2/5 font-medium text-textColor-subtitle">
                        Ngày kết thúc
                      </div>
                      <div class="w-3/5">
                        <VueDatePicker
                          v-model="taskTemp.dueDate"
                          auto-apply
                          partial-flow
                          :enable-time-picker="false"
                          placeholder="mm/dd/yyyy"
                          format="dd/MM/yyyy"
                          :dark="theme == 'dark'"
                          :disabled="!hasPermission"
                          position="right"
                        ></VueDatePicker>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="w-2/5 font-medium text-textColor-subtitle">
                        Ngày hoàn thành
                      </div>
                      <div class="w-3/5">
                        <VueDatePicker
                          v-model="taskTemp.finishDate"
                          auto-apply
                          partial-flow
                          :enable-time-picker="false"
                          placeholder="mm/dd/yyyy"
                          format="dd/MM/yyyy"
                          :dark="theme == 'dark'"
                          position="right"
                          disabled
                        ></VueDatePicker>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col text-xs text-textColor-secondary mt-4 not-lastchild:mb-1"
                >
                  <div class="flex items-center">
                    <span class="">Tạo bởi: </span>
                    <Avatar
                      class="w-4 mx-1"
                      :avatarUrl="task.createdBy.avatar"
                    />
                    <span>{{ task.createdBy.fullname }}</span>
                  </div>
                  <span class=""
                    >Tạo vào ngày {{ formatDate(task.createdAt) }}</span
                  >
                  <span class=""
                    >Cập nhật gần nhất ngày
                    {{ formatDate(task.updatedAt) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="">Khoogn có task</div>
      </div>
    </div>
  </Modal>
</template>
