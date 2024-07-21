divdiv
<script setup lang="ts">
import XIcon from "@icons/x.svg";
import MoreIcon from "@icons/more.svg";
import ListIcon from "@icons/list.svg";
import PlusIcon from "@icons/plus.svg";
import SearchIcon from "@icons/search.svg";
import DownIcon from "@icons/down.svg";
import UploadIcon from "@icons/upload.svg";
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
  assignTask,
  changeStatusTask,
  getTaskById,
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
        class="flex flex-col h-[calc(100vh-40px)] w-full max-w-[1000px] bg-bgColor-primary py-3 rounded-lg"
      >
        <div v-if="isLoadingTask" class="flex-1 h-full flex flex-center">
          <LoadingIcon class="w-6 fill-textColor-secondary animate-spin" />
        </div>
        <template v-else-if="taskTemp && task">
          <div class="px-4 flex items-center justify-between">
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
                class="mr-2 flex flex-center h-8 w-8 rounded-md hover:bg-hover active:bg-hover cursor-pointer"
                title="Thêm"
              >
                <MoreIcon class="w-4 fill-textColor-secondary" />
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
                                showAssigneeDropdown = true;
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
                                showPriorityDropdown = true;
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
