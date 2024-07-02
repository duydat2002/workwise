<script setup lang="ts">
import MinimizeIcon from "@icons/minimize.svg";
import MoreIcon from "@icons/more.svg";
import PlusIcon from "@icons/plus.svg";
import { ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";

const groups = ref([
  {
    name: "Todo",
    id: "1",
    items: [
      {
        name: "Joao",
        id: "1",
      },
      {
        name: "Jean",
        id: "2",
      },
      {
        name: "Johanna",
        id: "3",
      },
      {
        name: "Juan",
        id: "4",
      },
      {
        name: "Joao",
        id: "5",
      },
      {
        name: "Jean",
        id: "6",
      },
      {
        name: "Johanna",
        id: "7",
      },
      {
        name: "Juan",
        id: "8",
      },
    ],
  },
  {
    name: "Is Pending",
    id: "2",
    items: [
      {
        name: "Joao-2",
        id: "1",
      },
      {
        name: "Jean-2",
        id: "2",
      },
      {
        name: "Johanna-2",
        id: "3",
      },
    ],
  },
  {
    name: "Done",
    id: "3",
    items: [
      {
        name: "Joao-3",
        id: "1",
      },
      {
        name: "Jean-3",
        id: "2",
      },
      {
        name: "Johanna-3",
        id: "3",
      },
    ],
  },
]);
</script>

<template>
  <div class="flex flex-col h-full mx-3 overflow-x-auto">
    <div class=""></div>
    <div class="flex-1 h-full flex items-start py-1">
      <VueDraggable
        class="flex h-full items-start not-lastchild:mr-2"
        :animation="150"
        v-model="groups"
        handle=".header"
        chosenClass="chosen"
        dragClass="drag"
        ghostClass="ghost"
      >
        <div v-for="group in groups" :key="group.id" class="h-full">
          <div
            class="w-[250px] max-h-full p-1 flex flex-col rounded-lg bg-bgColor-secondary"
          >
            <div class="header flex items-center mb-1 cursor-pointer">
              <input
                type="text"
                class="flex-1 w-full px-2 py-[4px] text-sm font-semibold text-textColor-primary rounded border border-solid border-transparent focus:border-primary cursor-pointer focus:cursor-auto"
                :value="group.name"
              />
              <div
                class="flex-shrink-0 flex flex-center p-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
              >
                <MinimizeIcon class="w-6 fill-textColor-subtitle" />
              </div>
              <div
                class="flex-shrink-0 flex flex-center w-8 h-8 p-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
              >
                <MoreIcon class="w-3 fill-textColor-subtitle" />
              </div>
            </div>
            <div class="flex-1 h-full overflow-y-auto">
              <VueDraggable
                class="h-full not-lastchild:mb-1"
                v-model="group.items"
                :animation="150"
                chosenClass="chosen"
                dragClass="drag"
                ghostClass="ghost"
                group="test"
              >
                <div v-for="item in group.items" :key="item.id">
                  <div
                    class="w-full px-3 py-2 rounded-md bg-bgColor-primary border border-solid cursor-pointer shadow-md"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </VueDraggable>
            </div>
            <div class="w-full px-3 py-2">
              <div class="flex items-center">
                <PlusIcon class="w-3 fill-textColor-secondary" />
                <span
                  class="ml-2 text-sm font-semibold text-textColor-secondary"
                  >Thêm công việc</span
                >
              </div>
            </div>
          </div>
        </div>
      </VueDraggable>
      <div
        class="flex-shrink-0 w-[250px] p-3 ml-2 flex items-center rounded-lg bg-bgColor-secondary hover:bg-hover active:bg-hover cursor-pointer"
      >
        <PlusIcon class="w-3 fill-textColor-primary" />
        <span class="ml-2 text-sm font-semibold text-textColor-primary"
          >Thêm nhóm công việc khác</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.drag > div {
  @apply rotate-6;
}

.chosen:hover > div {
  @apply border-primary;
}

.ghost {
  @apply opacity-50;
}
</style>
