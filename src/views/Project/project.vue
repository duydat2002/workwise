<script setup lang="ts">
import LoadingIcon from "@icons/loading.svg";
import EditIcon from "@icons/edit.svg";
import MoreIcon from "@icons/more.svg";
import ClockIcon from "@icons/clock.svg";
import TagsIcon from "@icons/tag.svg";
import OwnerIcon from "@icons/group-users.svg";
import KanbanIcon from "@icons/kanban.svg";
import DashboardIcon from "@icons/dashboard.svg";
import ListIcon from "@icons/list.svg";
import CalendarIcon from "@icons/calendar.svg";
import TimelineIcon from "@icons/timeline.svg";
import ApprovedIcon from "@icons/approved.svg";
import AttachIcon from "@icons/attach.svg";
import ActivityIcon from "@icons/history.svg";
import InboxIcon from "@icons/inbox.svg";
import ChartIcon from "@icons/pie-chart.svg";
import DragIcon from "@icons/drag.svg";
import WaitIcon from "@icons/wait.svg";
import InfoIcon from "@icons/info-circle.svg";
import AddUserIcon from "@icons/add-user.svg";
import AdminUserIcon from "@icons/user-gear.svg";
import ArchiveIcon from "@icons/archive.svg";
import UnarchiveIcon from "@icons/unarchive.svg";
import DeleteIcon from "@icons/delete.svg";
import NotFoundIcon from "@icons/not-found.svg";
import Avatar from "@/components/Common/Avatar.vue";
import { computed, nextTick, shallowRef, watch } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useActivityStore, useProjectStore, useUserStore } from "@/stores";
import { formatDate } from "@/helpers";
import { ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import UButton from "@/components/UI/UButton.vue";
import ProjectMembersModal from "@/components/Modal/ProjectMembersModal.vue";
import UpdateProjectModal from "@/components/Modal/UpdateProjectModal.vue";
import ActivitiesSidebar from "@/components/Pages/Activities/ActivitiesSidebar.vue";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import {
  archiveProject,
  deleteProject,
  unarchiveProject,
} from "@/services/project";
import { toast } from "vue3-toastify";
import TaskDetail from "@/components/Pages/Task/TaskDetail.vue";
import ArchivesSidebar from "@/components/Pages/ArchivesSidebar/ArchivesSidebar.vue";
import Popper from "vue3-popper";
import { cloneDeep } from "lodash";

const router = useRouter();
const route = useRoute();

const { deleteProjectStore } = useProjectStore();

const { user } = storeToRefs(useUserStore());
const { projects, project, showProjectInfo } = storeToRefs(useProjectStore());
const { projectActivities, taskActivities } = storeToRefs(useActivityStore());

const isLoadingProject = ref(true);
const isLoadingAction = ref(false);
const projectInfoRef = ref<HTMLDivElement>();
const tabs = shallowRef([
  { name: "Tổng quan", link: "Sumary", icon: DashboardIcon },
  { name: "Bảng", link: "Kanban", icon: KanbanIcon },
  { name: "Danh sách", link: "List", icon: ListIcon },
  // { name: "Lịch", link: "Calendar", icon: CalendarIcon },
  // { name: "Lịch trình", link: "Timeline", icon: TimelineIcon },
  // { name: "Phê duyệt", link: "Approvals", icon: ApprovedIcon },
  // { name: "Tài liệu", link: "Attachments", icon: AttachIcon },
  { name: "Báo cáo", link: "Statistics", icon: ChartIcon },
]);
const sidebarRightTabs = ref<"activities" | "archives">();
const showProjectMemberModal = ref(false);
const showUpdateProject = ref(false);
const showProjectOption = ref(false);
const showArchiveConfirm = ref(false);
const showDeleteConfirm = ref(false);

const isAdmin = computed(() => {
  return project.value?.members.some(
    (m) => m.role == "admin" && m.user.id == user.value?.id
  );
});

const hasPermission = computed(() => {
  return (
    project.value &&
    !project.value.isArchived &&
    project.value.members.some(
      (m) => m.role == "admin" && m.user.id == user.value?.id
    )
  );
});

const process = computed(() => {
  const tasks =
    project.value?.taskGroups
      .flatMap((g) => g.tasks)
      .filter((t) => !t.isArchived) ?? [];
  const taskDone = tasks.filter((t) => t.status == "completed");

  let processCount = 0;
  if (taskDone.length != 0) {
    processCount = Math.round((taskDone.length / tasks.length) * 100);
  }
  return {
    value: processCount,
    detail: `Công việc đã hoàn thành/ tổng số công việc: ${taskDone.length}/${tasks.length}`,
  };
});

const members = computed(() => {
  const projectTemp = cloneDeep(project.value);
  return (
    projectTemp?.members.sort((a, b) => {
      if (a.user.id == user.value!.id) return -1;
      if (b.user.id == user.value!.id) return 1;

      if (a.status !== b.status) {
        return a.status === "accepted" ? -1 : 1;
      }

      if (a.status === "accepted" && b.status === "accepted") {
        return a.role === "admin" ? -1 : 1;
      }

      return 0;
    }) ?? []
  );
});

const handleArchiveProject = async () => {
  isLoadingAction.value = true;
  const data = await archiveProject(project.value!.id);

  if (data.success) {
    toast.success(
      "Lưu trữ dự án thành công! Bạn có thể tìm và mở lại ở trang các dự án của bạn."
    );
    showArchiveConfirm.value = false;
    showProjectOption.value = false;
  }

  isLoadingAction.value = false;
};

const handleUnarchiveProject = async () => {
  isLoadingAction.value = true;

  const data = await unarchiveProject(project.value!.id);

  if (data.success) {
    toast.success("Khôi phục dự án thành công!");
    showProjectOption.value = false;
  }

  isLoadingAction.value = false;
};

const handleDeleteProject = async () => {
  isLoadingAction.value = true;

  const data = await deleteProject(project.value?.id ?? "1");

  if (data.success) {
    showProjectOption.value = false;
    router.push({ name: "Projects" });
    deleteProjectStore(project.value!.id);
  }

  isLoadingAction.value = false;
};

const toggleProjectInfo = () => {
  showProjectInfo.value = !showProjectInfo.value;
};

const changeHeightInfo = () => {
  if (projectInfoRef.value) {
    if (showProjectInfo.value) {
      projectInfoRef.value!.style.maxHeight =
        projectInfoRef.value!.scrollHeight + "px";
    } else {
      projectInfoRef.value!.style.maxHeight = "0px";
    }
  }
};

const getProject = (projectId: string) => {
  isLoadingProject.value = true;
  project.value = projects.value.find((p) => p.id == projectId) || null;

  if (project.value) {
    const projectTemp = cloneDeep(project.value);
    projectTemp.members.sort((a, b) => {
      if (a.user.id == user.value!.id) return -1;
      if (b.user.id == user.value!.id) return 1;

      if (a.status !== b.status) {
        return a.status === "accepted" ? -1 : 1;
      }

      if (a.status === "accepted" && b.status === "accepted") {
        return a.role === "admin" ? -1 : 1;
      }

      return 0;
    });
  }
  isLoadingProject.value = false;

  nextTick(() => {
    changeHeightInfo();
  });
};

watch(
  projects,
  () => {
    getProject(route.params.projectId as string);
  },
  { immediate: true }
);

watch(
  showProjectInfo,
  () => {
    changeHeightInfo();
  },
  { immediate: true }
);

watch(
  () => route.params.projectId,
  () => {
    if (projectActivities.value[0]?.project?.id != project.value?.id) {
      projectActivities.value = [];
      taskActivities.value = [];
    }
  },
  { immediate: true }
);

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.projectId != from.params.projectId) {
    projectActivities.value = [];
    taskActivities.value = [];
    getProject(to.params.projectId as string);
  }
});
</script>

<template>
  <div v-if="isLoadingProject" class="flex-1 h-full flex flex-center">
    <LoadingIcon class="w-6 fill-textColor-secondary animate-spin" />
  </div>
  <div v-else-if="project" class="flex h-full">
    <div class="flex-grow flex flex-col h-full overflow-hidden">
      <div
        v-if="project.isArchived"
        class="px-3 py-2 flex flex-center bg-primary-extraLight"
      >
        <InfoIcon class="w-5 fill-primary-light" />
        <span class="mx-2"
          >Dự án này đã được lưu trữ. Khôi phục dự án để thực hiện thay
          đổi.</span
        >
        <template v-if="isAdmin">
          <span
            v-if="!isLoadingAction"
            class="text-link hover:underline active:underline cursor-pointer"
            @click="handleUnarchiveProject"
            >Khôi phục dự án</span
          >
          <span v-else class="text-textColor-secondary"
            >Đang khôi phục dự án...</span
          >
        </template>
      </div>
      <div class="relative group/desc mb-3">
        <div class="px-5 py-2 flex flex-wrap items-center justify-between">
          <span
            class="px-2 py-[2px] text-lg font-semibold text-textColor-primary"
            >{{ project.name }}</span
          >
          <div class="flex">
            <div class="flex mr-2">
              <div class="flex mr-3">
                <div
                  v-for="(member, i) in members"
                  :key="member.user.id"
                  class="relative -mr-1 cursor-pointer"
                  :style="{ zIndex: members.length - i }"
                  :title="`${member.user.fullname} (${member.user.email}) ${
                    member.status == 'pending'
                      ? '- đang chờ'
                      : member.role == 'admin'
                      ? '- quản lý'
                      : ' - thành viên'
                  }`"
                >
                  <Avatar :avatarUrl="member.user.avatar" class="w-8" />
                  <div
                    v-if="member.status == 'pending'"
                    class="absolute flex flex-center bg-white rounded-full -bottom-[2px] -right-[2px]"
                  >
                    <WaitIcon class="w-4 fill-error" />
                  </div>
                  <div
                    v-else-if="member.role == 'admin'"
                    class="absolute flex flex-center bg-white rounded-full -bottom-[2px] -right-[2px]"
                  >
                    <AdminUserIcon class="w-4 fill-black" />
                  </div>
                </div>
              </div>
              <UButton
                variantType="secondary"
                @click="
                  () => {
                    showProjectMemberModal = true;
                  }
                "
                ><AddUserIcon class="w-4 fill-textColor-primary" /><span
                  class="ml-1 text-textColor-primary font-semibold text-dots"
                  >Chia sẻ</span
                ></UButton
              >
            </div>

            <div
              v-if="hasPermission"
              class="mr-1 flex flex-center h-8 w-8 rounded-md hover:bg-hover active:bg-hover cursor-pointer"
              @click="
                () => {
                  showUpdateProject = true;
                }
              "
            >
              <EditIcon class="w-4 fill-textColor-primary" />
            </div>
            <div
              class="relative"
              v-click-outside.short="{
                handle: () => {
                  showProjectOption = false;
                },
                excludes: [
                  '#confirm_archive_project',
                  '#confirm_delete_project',
                ],
              }"
            >
              <div
                class="flex flex-center h-8 w-8 rounded-md hover:bg-hover active:bg-hover cursor-pointer"
                @click.stop="
                  () => {
                    showProjectOption = !showProjectOption;
                  }
                "
              >
                <MoreIcon class="w-4 fill-textColor-primary" />
              </div>
              <div
                v-if="showProjectOption"
                class="absolute mt-1 top-full right-0 w-max bg-bgColor-primary overflow-hidden rounded-lg shadow z-10"
              >
                <div class="flex flex-col">
                  <div
                    class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                    @click="
                      () => {
                        sidebarRightTabs = 'activities';
                        showProjectOption = false;
                      }
                    "
                  >
                    <ActivityIcon class="w-4 fill-textColor-primary mr-2" />
                    <span class="text-sm text-textColor-primary"
                      >Lịch sử hoạt động</span
                    >
                  </div>
                  <div
                    class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                    @click="
                      () => {
                        sidebarRightTabs = 'archives';
                        showProjectOption = false;
                      }
                    "
                  >
                    <InboxIcon class="w-4 fill-textColor-primary mr-2" />
                    <span class="text-sm text-textColor-primary"
                      >Các mục đã lưu trữ</span
                    >
                  </div>
                  <template v-if="isAdmin">
                    <div
                      v-if="!project.isArchived"
                      class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                      @click="
                        () => {
                          showArchiveConfirm = true;
                        }
                      "
                    >
                      <ArchiveIcon class="w-4 fill-textColor-primary mr-2" />
                      <span class="text-sm text-textColor-primary"
                        >Lưu trữ dự án</span
                      >
                    </div>
                    <div
                      v-else
                      class="px-2 py-2 flex items-center hover:bg-hover active:bg-hover cursor-pointer"
                      @click="handleUnarchiveProject"
                    >
                      <UnarchiveIcon class="w-4 fill-textColor-primary mr-2" />
                      <span class="text-sm text-textColor-primary"
                        >Khôi phục dự án</span
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
                    <span class="text-sm text-error">Xóa dự án</span>
                  </div>
                </div>
                <ConfirmPopup
                  v-if="showArchiveConfirm"
                  id="confirm_archive_project"
                  title="Lưu trữ dự án?"
                  confirmMessage="Lưu trữ"
                  :isLoadingConfirm="isLoadingAction"
                  @confirm="handleArchiveProject"
                  @cancel="
                    () => {
                      showArchiveConfirm = false;
                      showProjectOption = false;
                    }
                  "
                >
                  <div class="w-full py-2">
                    <span class="text-textColor-secondary mr-1"
                      >Bạn có thể tìm và khôi phục lại các dự án đã lưu trữ.
                      <br />
                      Xem các dự án đã lưu trữ ở trang
                    </span>
                    <RouterLink
                      :to="{ name: 'Projects' }"
                      class="text-link underline"
                      >Các dự án của bạn</RouterLink
                    >
                  </div>
                </ConfirmPopup>
                <ConfirmPopup
                  v-if="showDeleteConfirm"
                  id="confirm_delete_project"
                  title="Xóa dự án?"
                  confirmMessage="Xóa"
                  desc="Tất cả mọi nhóm công việc, công việc và hành động sẽ bị xóa. Không thể hoàn tác."
                  :isLoadingConfirm="isLoadingAction"
                  @confirm="handleDeleteProject"
                  @cancel="
                    () => {
                      showDeleteConfirm = false;
                      showProjectOption = false;
                    }
                  "
                ></ConfirmPopup>
              </div>
            </div>
          </div>
        </div>
        <div
          ref="projectInfoRef"
          class="px-4 overflow-hidden transition-all duration-200"
        >
          <div
            class="relative h-[200px] bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
            :style="{
              backgroundImage: `url(${encodeURI(project.background)})`,
            }"
          >
            <div
              class="absolute flex items-center justify-between px-3 pb-3 bottom-0 left-0 right-0"
            >
              <span></span>
              <div
                class="bg-[#ffffff75] p-2 rounded-lg backdrop-blur-md flex not-lastchild:mr-3"
              >
                <div class="flex flex-col">
                  <span class="text-sm text-black font-medium"
                    >Ngày bắt đầu</span
                  >
                  <span class="text-base text-black font-semibold">{{
                    project.startDate
                      ? formatDate(project.startDate)
                      : "--/--, --:--"
                  }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm text-black font-medium"
                    >Ngày kết thúc</span
                  >
                  <span class="text-base text-black font-semibold">{{
                    project.dueDate
                      ? formatDate(project.dueDate)
                      : "--/--, --:--"
                  }}</span>
                </div>
                <Popper
                  hover
                  :placement="'bottom'"
                  offsetDistance="4"
                  :content="process.detail"
                >
                  <div class="flex flex-col">
                    <span class="text-sm text-black font-medium"
                      >Tiến trình</span
                    >
                    <span class="block text-base text-black font-semibold"
                      >{{ process.value }}%</span
                    >
                  </div>
                </Popper>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap px-2 py-3">
            <div class="flex-1 flex flex-col">
              <div class="flex items-center py-1">
                <ClockIcon class="w-4 fill-textColor-secondary mr-2" />
                <span
                  class="w-[100px] text-sm font-semibold text-textColor-secondary"
                  >Thời gian tạo</span
                >
                <span class="flex-1">{{
                  formatDate(project.createdAt, "dd/MM/yyyy, HH:mm")
                }}</span>
              </div>
              <div class="flex items-center py-1">
                <OwnerIcon class="w-4 fill-textColor-secondary mr-2" />
                <span
                  class="w-[100px] text-sm font-semibold text-textColor-secondary"
                  >Người tạo</span
                >
                <div class="flex items-center">
                  <div class="w-6 mr-2">
                    <Avatar :avatarUrl="project.createdBy.avatar" />
                  </div>
                  <span class="text-sm text-textColor-primary">{{
                    project.createdBy.fullname
                  }}</span>
                </div>
              </div>
              <div class="flex items-center py-1">
                <TagsIcon class="w-4 fill-textColor-secondary mr-2" />
                <span
                  class="w-[100px] text-sm font-semibold text-textColor-secondary"
                  >Nhãn</span
                >
                <div class="flex flex-wrap not-lastchild:mr-2">
                  <template v-if="project.labels.length > 0">
                    <div
                      v-for="label in project.labels"
                      class="px-2 rounded cursor-pointer text-sm text-[#44546f]"
                      :style="{
                        background: label.color,
                      }"
                    >
                      {{ label.name }}
                    </div>
                  </template>
                  <div v-else class="text-sm text-textColor-secondary">
                    Không có
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-1 flex flex-col">
              <span class="text-sm font-semibold text-textColor-secondary"
                >Mô tả</span
              >
              <span
                v-if="project.description"
                class="text-sm text-textColor-primary line-clamp-3"
                >{{ project.description }}</span
              >
              <span v-else class="text-sm text-textColor-secondary"
                >Chưa có mô tả.</span
              >
            </div>
          </div>
        </div>
        <div class="relative mx-5">
          <div class="w-full h-[1px] bg-borderColor"></div>
          <div
            class="group-hover/desc:block hidden absolute-center px-2 rounded-lg bg-primary-light cursor-pointer"
            @click="toggleProjectInfo"
          >
            <span class="text-xs text-bgColor-primary">{{
              showProjectInfo ? "Ẩn đi" : "Xem chi tiết"
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <div class="px-5">
          <VueDraggable
            class="flex w-full pb-1 overflow-x-scroll scroll-hori border-b border-borderColor not-lastchild:mr-2"
            :animation="150"
            v-model="tabs"
            handle=".drag-trigger"
            chosenClass="chosen"
            dragClass="drag"
            ghostClass="ghost"
          >
            <div class="flex-shrink-0" v-for="tab in tabs" :key="tab.name">
              <RouterLink
                :to="{ name: tab.link }"
                class="tab flex items-center px-2 py-1 hover:bg-bgColor-secondary active:bg-bgColor-secondary exact-link:bg-primary rounded-md cursor-pointer"
                :class="{ active: route.name == tab.link }"
              >
                <div class="group mr-1 drag-trigger">
                  <component
                    :is="tab.icon"
                    class="group-hover:hidden block w-4 fill-textColor-secondary parent-[.tab.active]:fill-white"
                  />
                  <DragIcon
                    class="group-hover:block hidden w-4 fill-textColor-secondary parent-[.tab.active]:fill-white cursor-grab"
                  />
                </div>
                <span
                  class="text-sm font-semibold text-textColor-secondary parent-[.tab.active]:text-white"
                  >{{ tab.name }}</span
                >
              </RouterLink>
            </div>
          </VueDraggable>
        </div>
        <div class="flex-1">
          <RouterView></RouterView>
          <!-- <RouterView name="modal"></RouterView> -->
        </div>
      </div>
      <ProjectMembersModal
        v-if="showProjectMemberModal"
        @close="
          () => {
            showProjectMemberModal = false;
          }
        "
      />
      <UpdateProjectModal
        v-if="showUpdateProject"
        :project="project!"
        @close="
          () => {
            showUpdateProject = false;
          }
        "
      />
    </div>
    <transition name="slideRight">
      <ActivitiesSidebar
        v-if="sidebarRightTabs == 'activities'"
        @close="
          () => {
            sidebarRightTabs = undefined;
          }
        "
      />
    </transition>
    <transition name="slideRight">
      <ArchivesSidebar
        v-if="sidebarRightTabs == 'archives'"
        @close="
          () => {
            sidebarRightTabs = undefined;
          }
        "
      />
    </transition>
  </div>
  <div v-else class="flex-1 h-full flex flex-center">
    <div class="flex flex-col items-center">
      <NotFoundIcon class="w-20" />
      <span class="text-2xl font-semibold text-textColor-primary"
        >Không tìm thấy dự án</span
      >
      <span class="my-6 text-base text-textColor-secondary"
        >Dự án này có thể đã bị xóa hoặc bạn không có quyền xem</span
      >
      <div class="">
        <UButton
          variantType="primary"
          @click="
            () => {
              router.push({ name: 'Projects' });
            }
          "
          ><span class="">Xem tất cả dự án của bạn</span></UButton
        >
      </div>
    </div>
  </div>
  <TaskDetail v-if="route.query.taskSelected" />
</template>
