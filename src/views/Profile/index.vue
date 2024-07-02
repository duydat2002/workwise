<script setup lang="ts"></script>

<template>
  <div class="px-6">
    <div class="w-[600px] mx-auto">
      <div class="border-b-2 border-borderColor">
        <div class="-mb-[2px] flex items-center not-lastchild:mr-2">
          <RouterLink
            :to="{ name: 'Info' }"
            class="p-2 text-sm font-semibold text-textColor-primary exact-link:text-primary border-b-2 border-borderColor exact-link:border-primary transition-all duration-150"
          >
            <span>Hồ sơ</span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'ChangePassword' }"
            class="p-2 text-sm font-semibold text-textColor-primary exact-link:text-primary border-b-2 border-borderColor exact-link:border-primary transition-all duration-150"
          >
            <span>Đổi mật khẩu</span>
          </RouterLink>
        </div>
      </div>
      <div class="mt-3">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>
