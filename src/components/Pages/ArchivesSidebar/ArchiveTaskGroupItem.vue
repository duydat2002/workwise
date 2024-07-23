<script setup lang="ts">
import { ITaskGroup } from "@/types";
import { ref } from "vue";
import TaskItem from "../Task/TaskItem.vue";

defineProps<{
  taskGroup: ITaskGroup;
}>();

const showTasks = ref(false);
</script>

<template>
  <div
    class="flex flex-col px-3 py-2 rounded-md bg-bgColor-primary border border-borderColor shadow-md"
  >
    <div class="flex flex-col">
      <span class="text-textColor-primary">{{ taskGroup.name }}</span>
      <span
        class="text-xs text-textColor-secondary hover:text-primary active:text-primary cursor-pointer py-1"
        @click="
          () => {
            showTasks = !showTasks;
          }
        "
        >Bao gồm {{ taskGroup.tasks.length }} công việc</span
      >
      <div v-if="showTasks" class="flex flex-col mt-2">
        <TaskItem v-for="task in taskGroup.tasks" :key="task.id" :task />
      </div>
    </div>
  </div>
</template>
