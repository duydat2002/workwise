<script setup lang="ts">
import XIcon from "@icons/x.svg";
import PlusIcon from "@icons/plus.svg";
import SearchIcon from "@icons/search.svg";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores";
import { IMember } from "@/types";
import { toast } from "vue3-toastify";
import UButton from "@/components/UI/UButton.vue";
import UTextarea from "@/components/UI/UTextarea.vue";
import Avatar from "@/components/Common/Avatar.vue";
import UInput from "@/components/UI/UInput.vue";
import { createTaskApproval } from "@/services/approval";

const emit = defineEmits(["back"]);

const { project, task } = storeToRefs(useProjectStore());

const attachments = ref<File[]>([]);
const searchReviewer = ref("");
const reviewUser = ref<IMember>();
const description = ref("");
const showReviewUserDropdown = ref(false);
const showCreateApproval = ref(false);
const isLoading = ref(false);

const members = computed(() => {
  return (
    project.value?.members.filter(
      (m) =>
        (m.user.fullname
          .toLowerCase()
          .includes(searchReviewer.value.trim().toLowerCase()) ||
          m.user.email
            .toLowerCase()
            .includes(searchReviewer.value.trim().toLowerCase())) &&
        m.status == "accepted"
    ) ?? []
  );
});

const handleCreateApproval = async () => {
  if (reviewUser.value) {
    isLoading.value = true;
    const formData = new FormData();

    formData.append("reviewedBy", reviewUser.value.user.id);
    formData.append("description", description.value);

    attachments.value.forEach((file) => {
      const newFile = new File([file], encodeURIComponent(file.name), {
        type: file.type,
      });
      formData.append("files", newFile);
    });

    const data = await createTaskApproval(task.value!.id, formData);
    if (data.success) {
      toast.success("Tạo phê duyệt thành công.");
      emit("back");
    } else {
      toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
    }

    isLoading.value = false;
  } else {
    toast.error("Vui lòng chọn người phê duyệt.");
  }
};

const handleChooseReviewer = async (member?: IMember) => {
  reviewUser.value = member;
  showReviewUserDropdown.value = false;
};

const removeAttachment = (file: File, i: number) => {
  attachments.value.splice(i, 1);
};

const getInputAttachments = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files!;

  let check = false;
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước tài liệu vượt quá 10MB!");
      } else {
        attachments.value.push(file);
        check = true;
      }
    }
  }
};
</script>

<template>
  <div class="flex flex-col p-2">
    <div class="flex flex-col not-lastchild:mb-2">
      <div class="flex items-center">
        <div class="w-2/5 font-medium text-textColor-subtitle">
          Người phê duyệt
        </div>
        <div class="w-3/5">
          <div
            class="relative"
            v-click-outside.short="
              () => {
                showReviewUserDropdown = false;
              }
            "
          >
            <div
              class="flex items-center px-2 py-1 bg-bgColor-secondary rounded hover:bg-hover active:bg-hover cursor-pointer"
              @click="
                () => {
                  showReviewUserDropdown = true;
                }
              "
            >
              <Avatar
                class="w-6 h-6 mr-2 flex-shrink-0"
                :avatarUrl="reviewUser?.user.avatar"
              />
              <span class="text-dots">{{
                reviewUser?.user.fullname ?? "Chọn người phê duyệt"
              }}</span>
            </div>
            <div
              v-if="showReviewUserDropdown"
              class="absolute top-full right-0 min-w-full w-[250px] pt-1 z-10"
            >
              <div
                class="flex flex-col px-2 py-3 bg-bgColor-primary rounded shadow overflow-hidden z-10"
              >
                <UInput
                  v-model:propValue="searchReviewer"
                  placeholder="Tìm người phê duyệt"
                  padding="px-2 py-1 min-h-auto"
                >
                  <template #left>
                    <SearchIcon
                      class="w-4 flex-shrink-0 fill-textColor-secondary"
                    />
                  </template>
                </UInput>
                <div
                  class="flex flex-col max-h-[200px] overflow-x-hidden overflow-y-auto scroll-vert mt-3"
                >
                  <div
                    v-for="member in members"
                    :key="member.id"
                    class="flex items-center px-2 py-1 rounded hover:bg-hover active:bg-hover cursor-pointer"
                    @click="handleChooseReviewer(member)"
                  >
                    <Avatar
                      class="w-6 h-6 mr-2 flex-shrink-0"
                      :avatarUrl="member.user.avatar"
                    />
                    <div class="flex flex-col">
                      <span
                        class="text-sm text-textColor-primary font-medium text-dots"
                        >{{ member.user.fullname }}</span
                      >
                      <span
                        class="text-sm text-textColor-secondary text-dots"
                        >{{ member.user.email }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <label class="mb-1 text-sm font-semibold text-textColor-subtitle"
          >Mô tả
        </label>
        <UTextarea
          v-model:value="description"
          placeholder="Hãy thêm mô tả cho phê duyệt..."
          :minHeight="60"
          :maxHeigth="120"
        />
      </div>
      <div class="flex flex-col">
        <label class="mb-1 text-sm font-semibold text-textColor-subtitle"
          >Tài liệu đính kèm
        </label>
        <div class="flex flex-col">
          <div class="flex flex-col">
            <div
              v-for="(file, i) in attachments"
              :key="i"
              class="flex py-1 items-center justify-between"
            >
              <span
                class="mr-2 text-sm font-medium text-primary-light text-dots"
                >{{ file.name }}</span
              >
              <XIcon
                @click="removeAttachment(file, i)"
                class="w-3 fill-textColor-primary hover:fill-error cursor-pointer"
              />
            </div>
          </div>
          <div
            class="relative self-start group py-2 flex items-center cursor-pointer"
          >
            <PlusIcon
              class="w-3 fill-textColor-secondary group-hover:fill-primary"
            />
            <span
              class="ml-2 text-sm font-semibold text-textColor-subtitle group-hover:text-primary"
              >Thêm tài liệu</span
            >
            <input
              ref="inputAttachmentRef"
              type="file"
              name="attachments"
              multiple
              class="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
              @change="getInputAttachments"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end not-lastchild:mr-2 mt-2">
      <UButton
        variantType="secondary"
        @click="
          () => {
            showCreateApproval = false;
          }
        "
        ><span class="">Hủy bỏ</span></UButton
      >
      <UButton
        variantType="primary"
        @click="handleCreateApproval"
        :isLoading="isLoading"
        ><span class="">Tạo phê duyệt</span></UButton
      >
    </div>
  </div>
</template>
