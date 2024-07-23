<script setup lang="ts">
import SidebarRight from "@/components/Layout/SidebarRight.vue";
import { useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import ActivityItem from "./ActivityItem.vue";

const emit = defineEmits(["close"]);

const { project, activities } = storeToRefs(useProjectStore());
const { fetchActivities } = useProjectStore();

const handleClose = () => {
  emit("close");
};

onMounted(async () => {
  if (
    activities.value.length == 0 ||
    activities.value[0].project.id != project.value!.id
  )
    await fetchActivities(project.value!.id);
});
</script>

<template>
  <SidebarRight title="Lịch sử hoạt động" @close="handleClose">
    <div class="flex flex-col my-3">
      <ActivityItem
        v-for="activity in activities"
        :key="activity.id"
        :activity
      />
    </div>
  </SidebarRight>
</template>
