<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import SidebarRight from "@/components/Layout/SidebarRight.vue";
import { formatDate } from "@/helpers";
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
    <ActivityItem v-for="activity in activities" :key="activity.id" :activity />
  </SidebarRight>
</template>
