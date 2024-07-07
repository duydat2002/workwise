<script setup lang="ts">
import KanbanIcon from "@icons/kanban.svg";
import ListIcon from "@icons/list.svg";
import CalendarIcon from "@icons/calendar.svg";
import TimelineIcon from "@icons/timeline.svg";
import AttachIcon from "@icons/attach.svg";
import AddUserIcon from "@icons/add-user.svg";
import MoreIcon from "@icons/more.svg";
import { ref } from "vue";
import UButton from "@/components/UI/UButton.vue";
import { useRoute } from "vue-router";

type ITab = "Kanban" | "List" | "Calendar" | "Timeline" | "Attach";

const route = useRoute();

const projectName = ref("Dự án");
// const tabView = ref<ITab>("kanban");
const TABS: { name: ITab; icon: any; text: string }[] = [
  {
    name: "Kanban",
    icon: KanbanIcon,
    text: "Kanban",
  },
  {
    name: "List",
    icon: ListIcon,
    text: "Danh sách",
  },
  {
    name: "Calendar",
    icon: CalendarIcon,
    text: "Lịch",
  },
  {
    name: "Timeline",
    icon: TimelineIcon,
    text: "Lịch trình",
  },
  {
    name: "Attach",
    icon: AttachIcon,
    text: "Tài liệu",
  },
];

// const handleChangeTab = (tab: ITab) => {
//   tabView.value = tab;
// };
</script>

<template>
  <div class="pt-5 h-full flex flex-col">
    <div class="px-6 flex flex-col pb-3 border-b border-borderColor">
      <div class="flex items-center justify-between">
        <input
          type="text"
          class="px-2 py-[2px] text-lg font-semibold text-textColor-primary rounded border border-solid border-transparent focus:border-primary"
          v-model="projectName"
        />
        <!-- <UButton2><span class="">Tùy chỉnh dự án</span></UButton2> -->
      </div>
      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center not-lastchild:mr-2">
          <RouterLink
            v-for="tab in TABS"
            :key="tab.name"
            :to="{ name: tab.name }"
            class="flex items-center px-2 py-1 hover:bg-bgColor-secondary active:bg-bgColor-secondary exact-link:bg-bgColor-secondary rounded-md cursor-pointer"
            :class="{ active: route.name == tab.name }"
          >
            <component
              :is="tab.icon"
              class="w-4 fill-textColor-secondary parent-[.active]:fill-primary mr-1"
            />
            <span
              class="text-sm font-semibold text-textColor-secondary parent-[.active]:text-primary"
              >{{ tab.text }}</span
            >
          </RouterLink>
        </div>
        <div class="flex items-center">
          <UButton variant="outlined" size="small">
            <div class="flex items-center">
              <AddUserIcon class="w-4 fill-textColor-primary mr-1" />
              <span class="">Thành viên</span>
            </div>
          </UButton>
          <div
            class="flex flex-center ml-2 p-2 hover:bg-bgColor-secondary active:bg-bgColor-secondary rounded cursor-pointer"
          >
            <MoreIcon class="w-4 fill-textColor-primary" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <RouterView></RouterView>
    </div>
  </div>
</template>
