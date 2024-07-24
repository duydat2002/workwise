<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import UTextarea from "@/components/UI/UTextarea.vue";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import CommentItem from "./CommentItem.vue";
import { commentTask } from "@/services/comment";
import { ITask } from "@/types";

const props = defineProps<{
  task: ITask;
}>();

const { user } = storeToRefs(useUserStore());

const commentContent = ref("");
const showCommentButton = ref(false);
const isLoading = ref(false);

const handleComment = async () => {
  isLoading.value = true;

  await commentTask(props.task.id, commentContent.value);

  handleCancelComment();
  isLoading.value = false;
};

const handleCancelComment = () => {
  commentContent.value = "";
  showCommentButton.value = false;
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-start bg-bgColor-primary">
      <Avatar class="w-8 h-8 mr-2" :avatarUrl="user?.avatar" />
      <div class="flex-1">
        <UTextarea
          class="w-full"
          v-model:value="commentContent"
          name="comment"
          @focus="
            () => {
              showCommentButton = true;
            }
          "
        />
        <div v-if="showCommentButton" class="flex mt-2">
          <UButton
            class="mr-2 buttons"
            variantType="primary"
            :isLoading
            :isDisabled="commentContent.trim() == ''"
            @click="handleComment"
          >
            <span>Bình luận</span>
          </UButton>
          <UButton
            class="buttons"
            variantType="secondary"
            @click="handleCancelComment"
          >
            <span>Hủy</span>
          </UButton>
        </div>
      </div>
    </div>
    <div class="flex flex-col mt-3">
      <CommentItem
        v-for="comment in task.comments"
        :key="comment.id"
        :comment
      />
    </div>
  </div>
</template>
