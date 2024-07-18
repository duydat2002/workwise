<script setup lang="ts">
import MenuIcon from "@icons/menu.svg";
import ChartIcon from "@icons/pie-chart.svg";
import PlusIcon from "@icons/plus.svg";
import ProjectIcon from "@icons/project.svg";
import TaskIcon from "@icons/task.svg";
import LeftIcon from "@icons/left.svg";
import { storeToRefs } from "pinia";
import { useCommonStore, useProjectStore, useResizeStore } from "@/stores";
import { shallowRef, watch } from "vue";

const { narrowSidebar } = storeToRefs(useCommonStore());
const { dimensions } = storeToRefs(useResizeStore());
const { showCreateProject } = storeToRefs(useProjectStore());

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
    link: { name: "Signin" },
  },
]);

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
          <div class="mt-1 flex flex-col">
            <RouterLink
              v-for="i in 5"
              :key="i"
              :to="{ name: 'Project', params: { projectId: i } }"
              class="flex px-4 py-2 items-center hover:bg-hover rounded-md cursor-pointer transition-colors"
            >
              <div
                class="w-8 h-6 mr-2 border border-borderColor rounded bg-[#f8a3a3]"
              ></div>
              <span class="font-medium text-dots">Tên dự án</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
