<script setup lang="ts">
import { useResizeStore } from "@/stores";
import SearchIcon from "@icons/search.svg";
import { storeToRefs } from "pinia";
import { ref, nextTick } from "vue";

const { dimensions } = storeToRefs(useResizeStore());
const searchInput = ref<HTMLInputElement>();
const isFocus = ref(false);
const search = ref("");

const hanldeClickSearchIcon = () => {
  if (dimensions.value.width >= 768) {
    isFocus.value = true;
    nextTick(() => {
      searchInput.value!.focus();
    });
  } else {
  }
};
</script>

<template>
  <div
    class="relative flex-col px-3 w-auto flex min-[768px]:w-[200px] has-[.focus]:max-[767px]:fixed has-[.focus]:w-full has-[.focus]:min-[768px]:w-[600px] z-50"
    :class="{ focus: isFocus }"
    v-click-outside.short="
      () => {
        isFocus = false;
      }
    "
  >
    <SearchIcon
      v-if="dimensions.width < 768"
      class="block min-[768px]:hidden parent-[.focus]:hidden w-5 fill-textColor-primary cursor-pointer"
      @click="hanldeClickSearchIcon"
    />
    <template v-else>
      <div
        class="hidden min-[768px]:flex parent-[.focus]:flex items-center w-full h-8 px-3 py-1 border border-borderColor rounded bg-bgColor-secondary parent-[.focus]:shadow-[-12px_0_24px_0] parent-[.focus]:shadow-bgColor-primary"
      >
        <SearchIcon class="w-4 mr-2 flex-shrink-0 fill-textColor-secondary" />
        <input
          ref="searchInput"
          type="text"
          name="search"
          class="flex-1 w-full h-full text-textColor-primary"
          placeholder="Tìm kiếm"
          v-model="search"
          @focus="
            () => {
              isFocus = true;
            }
          "
        />
      </div>
      <div
        class="absolute hidden parent-[.focus]:block top-full mt-2 px-3 left-0 right-0"
      >
        <div
          class="p-4 border border-borderColor rounded-lg bg-bgColor-primary shadow"
        >
          <div class="border-b-2 border-borderColor">
            <div class="flex -mb-[2px]">
              <span
                class="px-2 py-1 text-primary font-semibold border-b-2 border-primary cursor-pointer"
                >Tất cả</span
              >
              <span
                class="px-2 py-1 text-textColor-secondary font-semibold border-b-2 border-transparent cursor-pointer"
                >Dự án</span
              >
              <span
                class="px-2 py-1 text-textColor-secondary font-semibold border-b-2 border-transparent cursor-pointer"
                >Công việc</span
              >
              <span
                class="px-2 py-1 text-textColor-secondary font-semibold border-b-2 border-transparent cursor-pointer"
                >Nhãn</span
              >
            </div>
          </div>
          <div class="h-[400px] my-2 overflow-y-auto scroll-vert">
            <div
              class="h-[1000px] bg-gradient-to-bl from-cyan-500 to-pink-500"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.input {
  box-shadow: -12px 0 24px 0 #ffffff;
}
</style>
