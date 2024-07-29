<script setup lang="ts">
import MenuIcon from "@icons/menu.svg";
import DeleteIcon from "@icons/delete.svg";
import PlusIcon from "@icons/plus.svg";
import ProjectIcon from "@icons/project.svg";
import TaskIcon from "@icons/task.svg";
import LeftIcon from "@icons/left.svg";
import { storeToRefs } from "pinia";
import {
  useCommonStore,
  useProjectStore,
  useResizeStore,
  useUserStore,
} from "@/stores";
import { computed, shallowRef, watch } from "vue";
import { cloneDeep } from "lodash";
import { RouterLink } from "vue-router";

const { narrowSidebar } = storeToRefs(useCommonStore());
const { user } = storeToRefs(useUserStore());
const { dimensions } = storeToRefs(useResizeStore());
const { projects, showCreateProject } = storeToRefs(useProjectStore());

const tabs = shallowRef([
  {
    name: "Tổng quan",
    icon: MenuIcon,
    link: { name: "Home" },
  },
  {
    name: "Dự án",
    icon: ProjectIcon,
    link: { name: "Projects" },
  },
  {
    name: "Công việc",
    icon: TaskIcon,
    link: { name: "Tasks" },
  },
]);

const projectsMostRecent = computed(() => {
  const projectTemp = cloneDeep(projects.value);
  return projectTemp
    .filter((p) => !p.isArchived)
    .sort((p1, p2) => {
      return (
        new Date(p1.updatedAt).getTime() - new Date(p2.updatedAt).getTime()
      );
    });
});

const tasksForYou = computed(() => {
  const projectTemp = cloneDeep(projects.value);
  return projectTemp
    .flatMap((p) => p.taskGroups)
    .flatMap((g) => g.tasks)
    .filter((t) => !t.isArchived && t.dueDate)
    .sort((t1, t2) => {
      if (!t1.dueDate) return 1;
      if (!t2.dueDate) return -1;
      return new Date(t1.dueDate).getTime() - new Date(t2.dueDate).getTime();
    });
});

const handleToggleSidebar = () => {
  narrowSidebar.value = !narrowSidebar.value;
};

const handleTouchSidebar = (direction: "top" | "right" | "bottom" | "left") => {
  console.log(direction);
  if (direction == "left") {
    narrowSidebar.value = true;
  } else if (direction == "right") {
    narrowSidebar.value = false;
  }
};

watch(
  () => dimensions.value.width,
  () => {
    narrowSidebar.value =
      dimensions.value.width <= 800 ? true : narrowSidebar.value;
  }
);
</script>

<template>
  <div
    class="relative group w-sidebar-normal has-[.narrow]:w-sidebar-narrow border-r border-borderColor bg-bgColor-primary transition-all duration-300 z-20"
    :class="{ narrow: narrowSidebar }"
    v-touch:swipe="handleTouchSidebar"
  >
    <div
      class="absolute flex md:hidden parent-[.narrow]:flex group-hover:flex top-10 right-0 w-6 h-6 -mr-3 flex-center rounded-full border border-borderColor bg-white hover:bg-primary text-textColor-primary hover:text-white cursor-pointer transition-all duration-300 z-10"
      @click="handleToggleSidebar"
    >
      <LeftIcon class="w-4 parent-[.narrow]:rotate-180 fill-current" />
    </div>
    <div class="h-full py-3 parent-[.narrow]:opacity-0">
      <div
        class="w-full h-full flex flex-col items-center pl-4 pr-2 parent-[.narrow]:pr-0 overflow-y-scroll scroll-vert none"
        :class="{ 'no-scrollbar': narrowSidebar }"
      >
        <div class="w-full flex flex-col">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.link"
            class="flex items-center min-w-max mb-2 py-2 px-4 hover:bg-hover rounded-md cursor-pointer transition-colors exact-link:bg-[#5577FF]"
          >
            <component
              :is="tab.icon"
              class="w-5 fill-textColor-secondary parent-[.exact-link-active]:fill-white"
            />
            <span
              class="ml-2 font-medium text-textColor-secondary parent-[.exact-link-active]:text-white"
              >{{ tab.name }}</span
            >
          </RouterLink>
        </div>
        <div class="w-full border-t border-borderColor">
          <div class="flex px-4 py-2 items-center justify-between">
            <span
              class="text-textColor-secondary font-medium uppercase whitespace-nowrap"
              >Dự án gần đây</span
            >
            <div>
              <title>Tạo dự án mới</title>
              <PlusIcon
                class="w-5 p-1 rounded-sm bg-primary-light fill-white cursor-pointer"
                @click="
                  () => {
                    showCreateProject = true;
                  }
                "
              />
            </div>
          </div>
          <div
            class="mb-1 flex flex-col max-h-[160px] overflow-y-scroll scroll-vert"
          >
            <RouterLink
              v-for="project in projectsMostRecent"
              :key="project.id"
              :to="{ name: 'Project', params: { projectId: project.id ?? 1 } }"
              class="flex px-4 py-2 items-center hover:bg-primary-extraLight rounded-md cursor-pointer transition-colors"
            >
              <div
                class="w-8 h-6 bg-cover bg-center aspect-video mr-2"
                :style="{
                  backgroundImage: `url(${project.background})`,
                }"
              ></div>
              <span class="font-medium text-dots">{{ project.name }}</span>
            </RouterLink>
          </div>
          <RouterLink
            :to="{ name: 'ProjectsArchived' }"
            class="flex items-center min-w-max mb-2 py-2 px-4 hover:bg-hover rounded-md cursor-pointer transition-colors exact-link:bg-[#5577FF]"
          >
            <DeleteIcon
              class="w-5 fill-textColor-secondary parent-[.exact-link-active]:fill-white"
            />
            <span
              class="ml-2 font-medium text-textColor-secondary parent-[.exact-link-active]:text-white"
              >Dự án đã lưu trữ</span
            >
          </RouterLink>
        </div>
        <div class="w-full mt-2 border-t border-borderColor">
          <div class="flex px-4 py-2 items-center justify-between">
            <span
              class="text-textColor-secondary font-medium uppercase whitespace-nowrap"
              >Công việc sắp tới hạn</span
            >
          </div>
          <div
            v-if="tasksForYou.length > 0"
            class="mb-1 flex flex-col max-h-[160px] overflow-y-scroll scroll-vert"
          >
            <RouterLink
              v-for="task in tasksForYou"
              :key="task.id"
              :to="{
                name: 'Project',
                params: { projectId: task.project.id ?? 2 },
                query: { taskSelected: task.id },
              }"
              class="flex px-4 py-2 items-center hover:bg-hover rounded-md cursor-pointer transition-colors"
            >
              <span class="font-medium text-dots">{{ task.name }}</span>
            </RouterLink>
          </div>
          <div v-else class="px-4 text-textColor-secondary">
            Không có công việc nào sắp tới hạn.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
