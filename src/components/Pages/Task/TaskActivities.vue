<script setup lang="ts">
import LoadingIcon from "@icons/loading.svg";
import ActivityItem from "@/components/Pages/Activities/ActivityItem.vue";
import UButton from "@/components/UI/UButton.vue";
import { getTaskActivities } from "@/services/task";
import { useActivityStore } from "@/stores";
import { ITask } from "@/types";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { orderBy, unionBy } from "lodash";

const props = defineProps<{
  task: ITask;
  sortNewest: boolean;
}>();

const { taskActivities } = storeToRefs(useActivityStore());

const PAGESIZE = 30;
const page = ref(1);
const outOfActivities = ref(false);
const isLoading = ref(false);

const fetchActivities = async () => {
  if (!outOfActivities.value) {
    isLoading.value = true;

    const data = await getTaskActivities(
      props.task.id,
      page.value,
      PAGESIZE,
      props.sortNewest
    );
    if (data.success) {
      let activities = data.result!.activities;

      activities = unionBy(activities, taskActivities.value, "id");
      activities = orderBy(
        activities,
        ["createdAt"],
        [props.sortNewest ? "desc" : "asc"]
      );

      taskActivities.value = activities;

      page.value += 1;
      if (activities.length < PAGESIZE) {
        outOfActivities.value = true;
      }
    } else {
      toast.error("Không thể tải dữ liệu lịch sử hoạt đông! Hãy thử lại sau.");
    }

    isLoading.value = false;
  }
};

const handleMore = async () => {
  await fetchActivities();
};

watch(
  () => props.sortNewest,
  async () => {
    page.value = 1;
    outOfActivities.value = false;
    await fetchActivities();
  }
);

onBeforeMount(async () => {
  await fetchActivities();
});
</script>

<template>
  <div class="flex flex-col">
    <ActivityItem
      v-for="activity in taskActivities"
      :key="activity.id"
      :activity
    />
    <div v-if="!outOfActivities" class="px-4 py-3 flex flex-center">
      <div v-if="isLoading" class="py-3">
        <LoadingIcon class="w-4 fill-textColor-primary animate-spin" />
      </div>
      <UButton v-else class="w-full" variantType="secondary" @click="handleMore"
        ><span class="">Xem thêm</span></UButton
      >
    </div>
  </div>
</template>
