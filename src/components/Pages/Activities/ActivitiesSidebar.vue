<script setup lang="ts">
import SidebarRight from "@/components/Layout/SidebarRight.vue";
import { useActivityStore, useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted } from "vue";
import ActivityItem from "./ActivityItem.vue";
import { IActivity } from "@/types";
import { ref } from "vue";
import { getProjectActivities } from "@/services/project";
import UButton from "@/components/UI/UButton.vue";
import { toast } from "vue3-toastify";
import { orderBy, unionBy } from "lodash";

const emit = defineEmits(["close"]);

const { project } = storeToRefs(useProjectStore());
const { projectActivities } = storeToRefs(useActivityStore());

const PAGESIZE = 30;
const page = ref(1);
const outOfActivities = ref(false);
const isLoading = ref(false);

const handleClose = () => {
  emit("close");
};

const fetchActivities = async () => {
  if (!outOfActivities.value) {
    isLoading.value = true;

    const data = await getProjectActivities(
      project.value!.id,
      page.value,
      PAGESIZE
    );
    if (data.success) {
      let activities = data.result!.activities;

      activities = unionBy(activities, projectActivities.value, "id");
      activities = orderBy(activities, ["createdAt"], ["desc"]);

      projectActivities.value = activities;

      page.value += 1;
      if (activities.length < PAGESIZE) {
        outOfActivities.value = true;
      }
      // if (activities.length > 0) {
      //   if (page.value == 1) projectActivities.value = activities;
      //   else projectActivities.value.push(...activities);
      //   page.value += 1;
      // } else {
      //   outOfActivities.value = true;
      // }
    } else {
      toast.error("Không thể tải dữ liệu lịch sử hoạt đông! Hãy thử lại sau.");
    }

    isLoading.value = false;
  }
};

const handleMore = async () => {
  await fetchActivities();
};

onBeforeMount(async () => {
  await fetchActivities();
});
</script>

<template>
  <SidebarRight title="Lịch sử hoạt động" @close="handleClose">
    <div class="flex flex-col my-3">
      <ActivityItem
        class="px-4 py-2"
        v-for="activity in projectActivities"
        :key="activity.id"
        :activity
      />
      <div v-if="!outOfActivities" class="px-4 py-3">
        <UButton
          class="w-full"
          variantType="secondary"
          :isLoading
          @click="handleMore"
          ><span class="">Xem thêm</span></UButton
        >
      </div>
    </div>
  </SidebarRight>
</template>
