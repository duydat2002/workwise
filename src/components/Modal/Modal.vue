<script lang="ts" setup>
const emit = defineEmits(["click-outside"]);
withDefaults(
  defineProps<{
    id?: string;
    isPopup?: boolean;
    isShow?: boolean;
    overlayBackground?: string;
    margin?: string;
  }>(),
  {
    isPopup: false,
    isShow: true,
    overlayBackground: "#0000004d",
    margin: "m-5",
  }
);

const handleClickOutsideModal = () => {
  emit("click-outside");
};
</script>

<template>
  <Teleport :to="isPopup ? '#popup' : '#modal'">
    <div
      v-if="isShow"
      class="fixed top-0 left-0 right-0 bottom-0 flex flex-center"
      :class="isPopup ? 'z-50' : 'z-40'"
      :id="id"
      :style="{ background: overlayBackground }"
    >
      <div
        class="modal-container flex flex-center w-screen"
        :class="[margin]"
        v-click-inside="handleClickOutsideModal"
      >
        <Transition name="modal" appear>
          <slot />
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
