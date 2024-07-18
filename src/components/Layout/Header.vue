<script setup lang="ts">
import BellIcon from "@icons/bell.svg";
import RightIcon from "@icons/right.svg";
import Avatar from "../Common/Avatar.vue";
import HeaderNotification from "./HeaderNotification.vue";
import HeaderSearch from "./HeaderSearch.vue";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore, useUserStore } from "@/stores";
import { useAuth } from "@/composables";
import { useRouter } from "vue-router";

const { setTheme } = useThemeStore();
const { signOut } = useAuth();

const router = useRouter();

const { user, notifications } = storeToRefs(useUserStore());
const { theme } = storeToRefs(useThemeStore());
const showAccountMenu = ref(false);
const showNotification = ref(false);
const showThemeChoose = ref(false);

const hasNewNotification = computed(() => {
  return (
    notifications.value.length > 0 &&
    !notifications.value[0].readBy.includes(user.value!.id) &&
    new Date(notifications.value[0].createdAt).getTime() ==
      new Date(notifications.value[0].updatedAt).getTime()
  );
});

const handleSignOut = async () => {
  showAccountMenu.value = false;
  await signOut();

  router.go(0);
};
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 h-12 px-4 flex items-center justify-between bg-bgColor-primary border-b border-borderColor z-30"
  >
    <RouterLink :to="{ name: 'Home' }" class="flex items-center">
      <img src="@/assets/images/Logo.png" class="w-[40px]" />
      <span class="logo-text small">WorkWise</span>
    </RouterLink>
    <div class="flex items-center">
      <HeaderSearch />
      <div class="relative flex flex-center not-lastchild:mr-2">
        <div
          class="p-1"
          v-click-outside.short="
            () => {
              showNotification = false;
            }
          "
        >
          <div
            class="relative cursor-pointer"
            @click.stop="
              () => {
                showNotification = !showNotification;
              }
            "
          >
            <BellIcon class="w-5 fill-textColor-primary" />
            <div
              v-if="hasNewNotification"
              class="absolute top-0 right-0 w-2 h-2 rounded-full bg-error"
            ></div>
          </div>
          <HeaderNotification v-if="showNotification" />
        </div>
        <div
          class="relative"
          v-click-outside.short="
            () => {
              showAccountMenu = false;
            }
          "
        >
          <div
            class="cursor-pointer"
            @click.stop="
              () => {
                showAccountMenu = !showAccountMenu;
              }
            "
          >
            <Avatar class="w-8" :avatarUrl="user?.avatar" />
          </div>
          <div v-if="showAccountMenu" class="absolute top-full mt-2 right-0">
            <div
              class="w-[300px] max-h-[600px] no-scrollbar rounded-lg bg-bgColor-primary dark:bg-bgColor-secondary shadow"
            >
              <div class="flex flex-col">
                <div class="py-1 border-b-2 border-borderColor">
                  <span
                    class="block mt-3 mb-2 px-4 text-xs font-semibold text-textColor-secondary uppercase"
                    >Tài khoản</span
                  >
                  <div class="flex items-center px-4 py-2">
                    <Avatar class="w-10 mr-2" :avatarUrl="user?.avatar" />
                    <div class="flex flex-col justify-between">
                      <span class="text-textColor-primary">{{
                        user?.fullname
                      }}</span>
                      <span class="text-xs text-textColor-secondary">{{
                        user?.email
                      }}</span>
                    </div>
                  </div>
                  <RouterLink
                    :to="{ name: 'Profile' }"
                    @click="
                      () => {
                        showAccountMenu = false;
                      }
                    "
                    class="px-4 py-2 w-full hover:bg-hover transition-colors"
                  >
                    <span class="text-textColor-primary">Tài khoản</span>
                  </RouterLink>
                </div>
                <div class="py-1 border-b-2 border-borderColor">
                  <span
                    class="block mt-3 mb-2 px-4 text-xs font-semibold text-textColor-secondary uppercase"
                    >WorkWise</span
                  >
                  <ul>
                    <li class="px-4 py-2 hover:bg-hover transition-colors">
                      <span class="text-textColor-primary">Hoạt động</span>
                    </li>
                    <li class="px-4 py-2 hover:bg-hover transition-colors">
                      <span class="text-textColor-primary">Thông báo</span>
                    </li>
                    <li
                      class="relative"
                      @click.stop="
                        () => {
                          showThemeChoose = !showThemeChoose;
                        }
                      "
                      v-click-outside.short="
                        () => {
                          showThemeChoose = false;
                        }
                      "
                    >
                      <div
                        class="px-4 py-2 flex items-center justify-between hover:bg-hover active:bg-hover transition-colors cursor-pointer"
                      >
                        <span class="text-textColor-primary">Chủ đề</span>
                        <RightIcon class="w-6 fill-textColor-secondary" />
                      </div>
                      <div
                        v-if="showThemeChoose"
                        class="absolute top-0 right-full mr-2 rounded-lg w-[200px] h-[200px] bg-bgColor-primary dark:bg-bgColor-secondary shadow"
                      >
                        <div
                          class="relative flex items-center px-3 py-2 hover:bg-hover active:bg-hover cursor-pointer"
                          :class="{ active: theme == 'light' }"
                          @click="setTheme('light')"
                        >
                          <div
                            class="absolute left-0 top-0 w-[2px] h-full parent-[.active]:bg-primary"
                          ></div>
                          <img
                            class="w-16"
                            src="@/assets/images/theme-light.png"
                          />
                          <span
                            class="ml-2 text-textColor-primary parent-[.active]:text-primary parent-[.active]:font-semibold"
                            >Sáng</span
                          >
                        </div>
                        <div
                          class="relative flex items-center px-3 py-2 hover:bg-hover active:bg-hover cursor-pointer"
                          :class="{ active: theme == 'dark' }"
                          @click="setTheme('dark')"
                        >
                          <div
                            class="absolute left-0 top-0 w-[2px] h-full parent-[.active]:bg-primary"
                          />
                          <img
                            class="w-16"
                            src="@/assets/images/theme-dark.png"
                          />
                          <span
                            class="ml-2 text-textColor-primary parent-[.active]:text-primary parent-[.active]:font-semibold"
                            >Tối</span
                          >
                        </div>
                        <div
                          class="relative flex items-center px-3 py-2 hover:bg-hover active:bg-hover cursor-pointer"
                          :class="{ active: theme == 'system' }"
                          @click="setTheme('system')"
                        >
                          <div
                            class="absolute left-0 top-0 w-[2px] h-full parent-[.active]:bg-primary"
                          />
                          <img
                            class="w-16"
                            src="@/assets/images/theme-system.png"
                          />
                          <span
                            class="ml-2 text-textColor-primary parent-[.active]:text-primary parent-[.active]:font-semibold"
                            >Hệ thống</span
                          >
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="py-1">
                  <div
                    class="px-4 py-2 hover:bg-hover transition-colors cursor-pointer"
                    @click="handleSignOut"
                  >
                    <span class="text-textColor-primary">Đăng xuất</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
