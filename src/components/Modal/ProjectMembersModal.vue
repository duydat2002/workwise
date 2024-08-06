<script setup lang="ts">
import XIcon from "@icons/x.svg";
import LoadingIcon from "@icons/loading.svg";
import Modal from "./Modal.vue";
import USelect from "@/components/UI/USelect.vue";
import UButton from "@/components/UI/UButton.vue";
import Avatar from "@/components/Common/Avatar.vue";
import MemberItem from "@/components/Pages/Project/MemberItem.vue";
import UTagInput from "@/components/UI/UTagInput.vue";
import { computed, onMounted, ref, watch } from "vue";
import { IMember, IOption } from "@/types";
import { storeToRefs } from "pinia";
import { useProjectStore, useUserStore } from "@/stores";
import { debounce } from "@/helpers";
import { findUsersByNameOrEmail } from "@/services/user";
import { inviteProjectMember } from "@/services/project";
import { cloneDeep } from "lodash";
import { toast } from "vue3-toastify";
import { isTaggedTemplateExpression } from "typescript";

const emit = defineEmits(["close"]);

const { user } = storeToRefs(useUserStore());
const { project } = storeToRefs(useProjectStore());

const search = ref("");
const userInvites = ref<IOption[]>([]);
const userSearchs = ref<IOption[]>([]);
// const roleSelected = ref<"admin" | "member">("member");
// const roleOptions = ref<IOption[]>([
//   { key: "admin", value: "Quản lý" },
//   { key: "member", value: "Thành viên" },
// ]);
const tabMembers = ref<"accepted" | "pending">("accepted");
const isLoadingSearch = ref(false);
const isLoadingInvite = ref(false);

const isAdmin = computed(() =>
  project.value!.members.some(
    (m) => m.user.id == user.value!.id && m.role == "admin"
  )
);

const hasOneAdmin = computed(() => {
  const membersTemp = cloneDeep(project.value?.members) ?? [];

  return (
    membersTemp.filter((m) => m.status == "accepted" && m.role == "admin")
      .length <= 1
  );
});

const hasOneMember = computed(() => {
  const temp =
    project.value?.members.filter((m) => m.status == "accepted") ?? [];
  return temp.length <= 1;
});

const hasPermission = computed(() => {
  return (
    project.value &&
    !project.value.isArchived &&
    project.value.members.some(
      (m) => m.role == "admin" && m.user.id == user.value?.id
    )
  );
});

const membersComp = computed(() => {
  const membersTemp = cloneDeep(project.value?.members) ?? [];
  const membersAccepted: IMember[] = [];
  const membersNotAccepted: IMember[] = [];

  membersTemp
    .sort((a, b) => {
      if (a.user.id == user.value!.id) return -1;
      if (b.user.id == user.value!.id) return 1;

      if (a.status !== b.status) {
        return a.status === "accepted" ? -1 : 1;
      }

      if (a.status === "accepted" && b.status === "accepted") {
        return a.role === "admin" ? -1 : 1;
      }

      return 0;
    })
    .forEach((m) => {
      if (m.status == "accepted") membersAccepted.push(m);
      else membersNotAccepted.push(m);
    });

  return {
    membersAccepted,
    membersNotAccepted,
  };
});

const handleInvite = async () => {
  isLoadingInvite.value = true;
  const members = userInvites.value.map((u) => u.key);

  if (members.length > 0) {
    const data = await inviteProjectMember(
      project.value!.id,
      members,
      "member"
    );

    if (data.success) {
      userInvites.value = [];
      search.value = "";
      toast.success(`Đã mời người dùng vào dự án.`);
    } else {
      toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
    }
  }

  isLoadingInvite.value = false;
};

const checkUserExist = (option: IOption) => {
  return (
    user.value!.id == option.key ||
    project.value!.members.some((m) => m.user.id == option.key) ||
    userInvites.value.some((ui) => ui.key == option.key)
  );
};

const handleChooseUserInvite = (option: IOption) => {
  if (!checkUserExist(option)) {
    search.value = "";
    userInvites.value.push(option);
  }
};

const closeModal = () => {
  emit("close");
};

watch(search, async () => {
  if (search.value != "") {
    isLoadingSearch.value = true;
    debounce(async () => {
      const data = await findUsersByNameOrEmail(search.value);

      if (data.success) {
        userSearchs.value = data.result!.users.map((u) => ({
          key: u.id,
          value: u.fullname,
          data: u,
        }));
      } else {
        userSearchs.value = [];
      }

      isLoadingSearch.value = false;
    }, 100);
  }
});
</script>

<template>
  <Modal @click-outside="closeModal">
    <div class="m-5">
      <div
        class="flex flex-col w-screen max-w-[600px] bg-bgColor-primary py-4 rounded-lg"
      >
        <div class="px-4 flex items-center justify-between">
          <span class="text-lg font-semibold text-textColor-primary"
            >Thành viên dự án</span
          >
          <div
            class="group flex flex-center w-8 h-8 cursor-pointer"
            @click="closeModal"
          >
            <XIcon
              class="w-3 fill-textColor-secondary group-hover:fill-error group-active:fill-error"
            />
          </div>
        </div>
        <div class="px-4 mt-3">
          <div v-if="isAdmin" class="flex not-lastchild:mr-2 mb-2">
            <div class="relative flex-1">
              <UTagInput
                v-model:search="search"
                v-model:selecteds="userInvites"
                :options="userSearchs"
                placeholder="Tìm kiếm người dùng theo tên hoặc mail"
              >
                <template v-if="search != ''" #dropdown>
                  <div class="p-2 bg-bgColor-primary rounded-lg shadow">
                    <div class="flex flex-col">
                      <div v-if="isLoadingSearch" class="flex flex-center p-3">
                        <LoadingIcon
                          class="w-5 fill-textColor-secondary animate-spin"
                        />
                      </div>
                      <div
                        v-else-if="userSearchs && userSearchs.length > 0"
                        v-for="o in userSearchs"
                        :key="o.key"
                        class="flex items-center flex-1 p-2 rounded-lg hover:bg-hover active:bg-hover has-[.block]:cursor-not-allowed cursor-pointer"
                        :class="{
                          block: checkUserExist(o) == true,
                        }"
                        @click="handleChooseUserInvite(o)"
                      >
                        <Avatar class="w-8" :avatarUrl="o.data.avatar" />
                        <div class="ml-2 flex flex-col">
                          <span
                            class="text-sm text-textColor-primary font-medium"
                            >{{ o.data.fullname
                            }}{{ user!.id == o.key ? " (bạn)" : "" }}</span
                          >
                          <span class="text-sm text-textColor-secondary">{{
                            o.data.email
                          }}</span>
                        </div>
                      </div>
                      <div v-else class="p-2">
                        <span class="text-sm text-textColor-secondary"
                          >Không tìm thấy người dùng nào.</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </UTagInput>
            </div>
            <!-- <div class="">
              <USelect
                class=""
                v-model:selected="roleSelected"
                :options="roleOptions"
              />
            </div> -->
            <div class="">
              <UButton
                class="flex-shrink-0"
                variantType="primary"
                :isLoading="isLoadingInvite"
                :disabled="userInvites.length == 0 && !hasPermission"
                @click="handleInvite"
                ><span class="">Gửi lời mời</span></UButton
              >
            </div>
          </div>
          <div v-if="isAdmin" class="p-2 mb-2 bg-yellow-100">
            <span class="text-xs text-textColor-secondary"
              >Trong một dự án chỉ có duy nhất một quản lý.</span
            >
          </div>
          <div
            class="border-b-2 border-borderColor flex not-lastchild:mr-4 mb-2"
          >
            <div class="-mb-[2px] flex items-center not-lastchild:mr-2">
              <div
                class="py-2 text-sm font-semibold text-textColor-primary has-[.active]:text-primary border-b-2 border-borderColor has-[.active]:border-primary transition-all duration-150 cursor-pointer"
                :class="{ active: tabMembers == 'accepted' }"
                @click="
                  () => {
                    tabMembers = 'accepted';
                  }
                "
              >
                <span
                  >Thành viên của dự án ({{
                    membersComp.membersAccepted.length
                  }})</span
                >
              </div>
            </div>
            <div class="-mb-[2px] flex items-center not-lastchild:mr-2">
              <div
                class="py-2 text-sm font-semibold text-textColor-primary has-[.active]:text-primary border-b-2 border-borderColor has-[.active]:border-primary transition-all duration-150 cursor-pointer"
                :class="{ active: tabMembers == 'pending' }"
                @click="
                  () => {
                    tabMembers = 'pending';
                  }
                "
              >
                <span
                  >Chờ chấp nhận ({{
                    membersComp.membersNotAccepted.length
                  }})</span
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col pt-2">
            <template v-if="tabMembers == 'accepted'">
              <div
                v-for="member in membersComp.membersAccepted"
                class="flex items-center py-2"
              >
                <MemberItem :member :hasOneAdmin :hasOneMember />
              </div>
            </template>
            <template v-else>
              <div
                v-if="membersComp.membersNotAccepted.length > 0"
                v-for="member in membersComp.membersNotAccepted"
                class="flex items-center py-2"
              >
                <MemberItem
                  :member
                  isWaitForAccept
                  :hasOneAdmin
                  :hasOneMember
                />
              </div>
              <div v-else class="py-2">
                <span class="text-sm text-textColor-secondary"
                  >Không có thành viên nào cần chấp nhận.</span
                >
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
