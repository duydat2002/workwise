<script setup lang="ts">
import SearchIcon from "@icons/search.svg";
import UInput from "@/components/UI/UInput.vue";
import UTagInput from "@/components/UI/UTagInput.vue";
import UButton from "@/components/UI/UButton.vue";
import CreateProjectModal from "@/components/Modal/CreateProjectModal.vue";
import { ref } from "vue";

const search = ref("");
const filter = ref("");
const tagsFilter = ref<string[]>([]);
const activeFilterDropdown = ref(false);
const activeCreateProjectModal = ref(false);

const clickTest = (value: string) => {
  tagsFilter.value.push(value);
};

const deleteFilter = (tag: string, index: number) => {
  tagsFilter.value.splice(index, 1);
};

const handleClickCreateProject = () => {
  activeCreateProjectModal.value = true;
};
</script>

<template>
  <div class="px-6">
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
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
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
      <div class="flex flex-col pl-10">
        <label class="mb-1 text-xs font-bold text-textColor-subtitle"
          >Lọc theo</label
        >
        <UTagInput
          class="relative"
          name="filter_project"
          :tags="tagsFilter"
          v-model:propValue="filter"
          @deleteItem="deleteFilter"
          @click="
            () => {
              activeFilterDropdown = !activeFilterDropdown;
            }
          "
          v-click-outside.short="
            () => {
              activeFilterDropdown = false;
            }
          "
        >
          <template v-if="activeFilterDropdown" #dropdown>
            <div class="flex flex-col mt-1 bg-bgColor-primary shadow">
              <span class="w-full hover:bg-hover" @click.stop="clickTest('A')"
                >A</span
              >
              <span class="w-full hover:bg-hover" @click.stop="clickTest('B')"
                >B</span
              >
              <span class="w-full hover:bg-hover" @click.stop="clickTest('C')"
                >C</span
              >
            </div>
          </template>
        </UTagInput>
      </div>
    </div>
    <div class="flex flex-wrap mt-5 -mx-2 bg-bgColor-secondary">
      <div v-for="i in 5" :key="i" class="w-1/4 p-2">
        <div
          class="w-full px-3 py-2 bg-bgColor-primary flex flex-col justify-between rounded-lg shadow"
        >
          <img src="@/assets/images/Rectangle.png" alt="" class="h-[100px]" />
          <div class="mt-2 flex items-center not-lastchild:mr-1">
            <div
              class="relative group w-10 h-2 rounded bg-red-400 cursor-pointer"
            >
              <div class="hidden group-hover:block absolute top-full pt-1">
                <span
                  class="px-[6px] py-[2px] text-xs text-textColor-tooltip bg-bgColor-tooltip rounded"
                  >Game</span
                >
              </div>
            </div>
            <div
              class="relative group w-10 h-2 rounded bg-green-400 cursor-pointer"
            >
              <div class="hidden group-hover:block absolute top-full pt-1">
                <span
                  class="px-[6px] py-[2px] text-xs text-textColor-tooltip bg-bgColor-tooltip rounded"
                  >Work</span
                >
              </div>
            </div>
          </div>
          <RouterLink
            :to="{ name: 'Project', params: { projectId: i } }"
            class="mt-2 flex flex-col"
          >
            <span class="text-base font-bold text-textColor-primary"
              >Dự án {{ i }}</span
            >
            <span class="text-sm text-textColor-secondary text-dots"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
              quo?</span
            >
          </RouterLink>
          <div class="mt-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-textColor-primary"
                >Tiến trình</span
              >
              <span class="text-sm text-primary-light">75%</span>
            </div>
            <div class="relative w-full h-2 bg-[#c6d3ff] rounded">
              <div
                class="absolute left-0 top-0 bottom-0 w-[80%] bg-primary rounded"
              ></div>
              <div
                class="absolute left-[80%] top-1/2 -translate-y-1/2 -translate-x-1 w-3 h-3 border-[2px] border-white rounded-full bg-primary box-content"
              ></div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-xs text-textColor-secondary">Người tạo</span>
                <div
                  class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
                >
                  <img src="@/assets/images/Logo.png" alt="" class="" />
                </div>
              </div>
              <div class="flex items-center not-firstchild:-ml-[6px]">
                <div
                  class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
                >
                  <img src="@/assets/images/Logo.png" alt="" class="" />
                </div>
                <div
                  class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
                >
                  <img src="@/assets/images/Logo.png" alt="" class="" />
                </div>
                <div
                  class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
                >
                  <img src="@/assets/images/Logo.png" alt="" class="" />
                </div>
                <div
                  class="w-5 h-5 bg-bgColor-secondary border border-white rounded-full overflow-hidden"
                >
                  <img src="@/assets/images/Logo.png" alt="" class="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateProjectModal
      v-if="activeCreateProjectModal"
      @close="
        () => {
          activeCreateProjectModal = false;
        }
      "
    />
  </div>
</template>
