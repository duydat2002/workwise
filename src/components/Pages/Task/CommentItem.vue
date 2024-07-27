<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import UTextarea from "@/components/UI/UTextarea.vue";
import { dateDistanceToNow, formatDate } from "@/helpers";
import { deleteComment, updateComment } from "@/services/comment";
import { useUserStore } from "@/stores";
import { IComment } from "@/types";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import Popper from "vue3-popper";

const props = defineProps<{
  comment: IComment;
}>();

const { user } = storeToRefs(useUserStore());

const editable = ref(false);
const commentContent = ref(props.comment.content);
const showDeleteConfirm = ref(false);
const isLoading = ref(false);

const handleUpdateComment = async () => {
  isLoading.value = true;

  await updateComment(props.comment.id, commentContent.value);

  editable.value = false;
  isLoading.value = false;
};

const handleDeleteComment = async () => {
  isLoading.value = true;

  await deleteComment(props.comment.id);

  isLoading.value = false;
};

const handleCancelComment = () => {
  commentContent.value = props.comment.content;
  editable.value = false;
};

const handleOpenEdit = () => {
  editable.value = true;
};

const handleOpenDelete = () => {
  showDeleteConfirm.value = true;
};

const handleCloseDelete = () => {
  showDeleteConfirm.value = false;
};
</script>

<template>
  <div class="flex mb-3">
    <Avatar class="w-8 h-8 mr-2" :avatarUrl="comment.author.avatar" />
    <div class="flex-1 flex flex-col">
      <div class="flex items-center">
        <span class="font-semibold text-textColor-primary mr-2">{{
          comment.author.fullname
        }}</span>
        <Popper
          hover
          placement="top"
          offsetDistance="4"
          :content="formatDate(comment.createdAt)"
        >
          <span
            class="text-xs text-textColor-secondary hover:underline active:underline cursor-pointer"
            >{{ dateDistanceToNow(comment.createdAt) }}</span
          >
        </Popper>
        <span
          v-if="comment.isUpdated"
          class="ml-2 text-xs text-textColor-secondary"
          >(Đã sửa)</span
        >
      </div>
      <div class="py-1">
        <span v-if="!editable" class="text-textColor-primary">{{
          comment.content
        }}</span>
        <template v-else>
          <UTextarea
            class="w-full"
            v-model:value="commentContent"
            :minHeight="32"
          />
          <div class="flex mt-2">
            <UButton
              class="mr-2 buttons"
              variantType="primary"
              :isLoading
              :isDisabled="commentContent.trim() == ''"
              @click="handleUpdateComment"
            >
              <span>Lưu</span>
            </UButton>
            <UButton
              class="buttons"
              variantType="secondary"
              @click="handleCancelComment"
            >
              <span>Hủy bỏ thay đổi</span>
            </UButton>
          </div>
        </template>
      </div>
      <div v-if="user?.id == comment.author.id" class="flex items-center">
        <span
          class="text-xs underline text-textColor-secondary hover:text-primary active:text-primary cursor-pointer"
          @click="handleOpenEdit"
          >Chỉnh sửa</span
        >
        <span class="text-xs mx-1">•</span>
        <div class="relative">
          <span
            class="text-xs underline text-textColor-secondary hover:text-primary active:text-primary cursor-pointer"
            @click="handleOpenDelete"
            >Xóa</span
          >
          <div
            v-if="showDeleteConfirm"
            v-click-outside="handleCloseDelete"
            class="absolute top-full left-0 min-w-full w-[200px] pt-1 pb-3 z-10"
          >
            <div
              class="flex flex-col p-2 bg-bgColor-primary rounded shadow overflow-hidden z-10"
            >
              <span class="text-center font-semibold text-textColor-primary"
                >Bạn có muốn xóa bình luận?</span
              >
              <span class="text-textColor-secondary"
                >Bình luận sẽ bị xóa vĩnh viễn và không thể hoàn tác.</span
              >
              <div class="flex mt-2 gap-2">
                <UButton
                  class="flex-1"
                  variantType="secondary"
                  @click="handleCloseDelete"
                  ><span class="">Hủy</span></UButton
                >
                <UButton
                  class="flex-1"
                  variantType="error"
                  @click="handleDeleteComment"
                  :isLoading="isLoading"
                  ><span class="">Xóa</span></UButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
