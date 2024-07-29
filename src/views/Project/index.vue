<script setup lang="ts">
import SearchIcon from "@icons/search.svg";
import UInput from "@/components/UI/UInput.vue";
import UTagInput from "@/components/UI/UTagInput.vue";
import UButton from "@/components/UI/UButton.vue";
import { onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useProjectStore, useUserStore } from "@/stores";
import ProjectItem from "@/components/Pages/Project/ProjectItem.vue";
import { IOption, IProject } from "@/types";
import USelect from "@/components/UI/USelect.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { user } = storeToRefs(useUserStore());
const { projects, showCreateProject } = storeToRefs(useProjectStore());

const showProjects = ref<IProject[]>([]);
const yourProjects = ref<IProject[]>([]);
const teamProjects = ref<IProject[]>([]);
const search = ref("");
const sortSelected = ref<string>("dueSoon");
const sortOptions = ref<IOption[]>([
  { key: "dueSoon", value: "Sắp tới hạn" },
  { key: "latest", value: "Được tạo mới nhất" },
  { key: "earliest", value: "Được tạo sớm nhất" },
  { key: "mostRecent", value: "Hoạt động gần đây nhất" },
  { key: "leastRecent", value: "Ít hoạt động gần đây nhất" },
  { key: "atoz", value: "Theo bảng chữ cái A-Z" },
  { key: "ztoa", value: "Theo bảng chữ cái Z-A" },
]);
const searchLabel = ref("");
const labelsSelected = ref<IOption[]>([]);
const labelOptions = ref<IOption[]>(
  user.value?.createdProjectLabels.map((l) => {
    return { key: l.id, value: l.name, data: l };
  }) || []
);

const handleClickCreateProject = () => {
  showCreateProject.value = true;
};

const handleChooseSort = (option: IOption) => {
  switch (option.key) {
    case "dueSoon":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        if (!p1.dueDate) return 1;
        if (!p2.dueDate) return -1;
        return new Date(p1.dueDate).getTime() - new Date(p2.dueDate).getTime();
      });
      break;
    case "earliest":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        return (
          new Date(p1.createdAt).getTime() - new Date(p2.createdAt).getTime()
        );
      });
      break;
    case "latest":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        return (
          new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime()
        );
      });
      break;
    case "mostRecent":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        return (
          new Date(p1.updatedAt).getTime() - new Date(p2.updatedAt).getTime()
        );
      });
      break;
    case "leastRecent":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        return (
          new Date(p2.updatedAt).getTime() - new Date(p1.updatedAt).getTime()
        );
      });
      break;
    case "atoz":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        return p1.name.toLowerCase().localeCompare(p2.name.toLowerCase());
      });
      break;
    case "ztoa":
      showProjects.value = showProjects.value.sort((p1, p2) => {
        return p2.name.toLowerCase().localeCompare(p1.name.toLowerCase());
      });
      break;
    default:
      return 0;
  }
};

const handleChooseLabel = (option: IOption) => {
  if (!labelsSelected.value.some((l) => l.key == option.key)) {
    searchLabel.value = "";
    labelsSelected.value.push(option);
  }
};

const filterProjects = () => {
  const isArchived = route.meta.isArchived ?? false;
  const filterTagIds = labelsSelected.value.map((t) => t.key);
  showProjects.value = projects.value.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.value.toLowerCase());

    if (filterTagIds.length == 0)
      return nameMatch && p.isArchived == isArchived;

    const tagMatch = p.labels.some((l) => filterTagIds.includes(l.id));

    console.log("object", p.isArchived);
    return nameMatch && tagMatch && p.isArchived == isArchived;
  });
};

watchEffect(() => {
  filterProjects();
});

onMounted(() => {
  const isArchived = route.meta.isArchived ?? false;
  showProjects.value = projects.value.filter((p) => p.isArchived == isArchived);
  handleChooseSort({ key: "dueSoon", value: "Sắp tới hạn" });
});
</script>

<template>
  <div class="px-6 pb-6 flex flex-col h-full">
    <div class="pt-6 mb-4 flex items-center justify-between">
      <span class="text-xl font-medium text-textColor-primary"
        >Tất cả dự án</span
      >
      <div class="flex items-center">
        <UButton variantType="primary" @click="handleClickCreateProject"
          ><span class="font-semibold">Tạo dự án mới</span></UButton
        >
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-between">
      <div class="flex flex-col pr-10 mt-1">
        <label class="mb-1 text-xs font-bold text-textColor-subtitle"
          >Tìm kiếm</label
        >
        <UInput
          class="w-[250px]"
          name="search_project"
          v-model:propValue="search"
          placeholder="Tìm kiếm dự án"
        >
          <template #left>
            <SearchIcon class="w-4 fill-textColor-secondary" />
          </template>
        </UInput>
      </div>
      <div class="flex flex-wrap mt-1">
        <div class="flex flex-col w-[200px] mr-2">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Sắp xếp</label
          >
          <USelect
            v-model:selected="sortSelected"
            :options="sortOptions"
            @choose="handleChooseSort"
            placeholder="Chọn sắp xếp theo"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Lọc theo nhãn</label
          >
          <UTagInput
            v-model:search="searchLabel"
            v-model:selecteds="labelsSelected"
            :options="labelOptions"
            placeholder="Tìm kiếm nhãn"
          >
            <template #dropdown>
              <div class="p-2 bg-bgColor-primary rounded-lg shadow">
                <div class="flex flex-col">
                  <div
                    v-for="label in labelOptions"
                    :key="label.key"
                    class="flex items-center flex-1 p-2 rounded-lg hover:bg-hover active:bg-hover has-[.block]:cursor-not-allowed cursor-pointer"
                    :class="{
                      block: labelsSelected.some((l) => l.key == label.key),
                    }"
                    @click="handleChooseLabel(label)"
                  >
                    <div
                      class="w-8 h-5 rounded mr-2"
                      :style="{ background: label.data.color }"
                    ></div>
                    <span class="text-textColor-primary">{{
                      label.value
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </UTagInput>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-wrap mt-5 -mx-2 bg-bgColor-secondary">
      <div
        v-for="project in showProjects"
        :key="project.id"
        class="w-1/4 max-[1000px]:w-1/3 max-[768px]:w-1/2 max-[500px]:w-full p-2"
      >
        <ProjectItem :project />
      </div>
    </div>
  </div>
</template>
