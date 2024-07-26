<script setup lang="ts">
import XIcon from "@icons/x.svg";
import LeftIcon from "@icons/left.svg";
import RightIcon from "@icons/right.svg";
import PlusIcon from "@icons/plus.svg";
import ClockIcon from "@icons/clock-o.svg";
import EditIcon from "@icons/edit.svg";
import DeleteIcon from "@icons/delete.svg";
import AttachIcon from "@icons/attach.svg";
import QuestionIcon from "@icons/question.svg";
import Modal from "./Modal.vue";
import Avatar from "../Common/Avatar.vue";
import Popper from "vue3-popper";
import { ref } from "vue";

const emit = defineEmits(["close"]);

const isApprovaled = ref(true);

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <Modal @click-outside="closeModal">
    <div
      class="flex flex-col h-[calc(100vh-80px)] w-full max-w-[600px] bg-bgColor-primary px-3 py-2 rounded-lg"
    >
      <div class="relative flex flex-center mb-3">
        <div
          class="group absolute left-0 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
        >
          <LeftIcon
            class="w-5 fill-textColor-secondary group-hover:fill-primary"
          />
        </div>
        <span class="text-base text-textColor-primary font-semibold"
          >Phê duyệt</span
        >
        <div
          class="group absolute right-1 top-0 bottom-0 flex flex-center p-1 rounded cursor-pointer"
        >
          <XIcon class="w-3 fill-textColor-secondary group-hover:fill-error" />
        </div>
      </div>
      <div class="flex flex-col">
        <div class="group py-2 px-2 w-full flex items-center cursor-pointer">
          <PlusIcon
            class="w-3 fill-textColor-secondary group-hover:fill-primary"
          />
          <span
            class="ml-2 text-sm font-semibold text-textColor-subtitle group-hover:text-primary"
            >Tạo phê duyệt</span
          >
        </div>
        <div class="flex flex-col">
          <div
            class="flex flex-col p-2 rounded-md bg-bgColor-secondary hover:bg-primary-extraLight cursor-pointer"
          >
            <div class="flex items-center">
              <Popper
                hover
                offsetDistance="8"
                :content="'Tạo bởi: Phạm duy đạt (jsafnas@gmail.com)'"
              >
                <Avatar class="w-8 h-8 mr-2" />
              </Popper>
              <span class="font-semibold w-[100px] text-green-500"
                >Đã phê duyệt</span
              >
              <div class="flex-1 flex items-center overflow-hidden">
                <Popper
                  hover
                  offsetDistance="8"
                  :content="'Phạm duy đạt (jsafnas@gmail.com)'"
                >
                  <div v-if="isApprovaled" class="flex items-center mr-4">
                    <span class="text-textColor-secondary mr-2"
                      >Người phê duỵt:</span
                    >
                    <Avatar class="w-6 h-6" />
                  </div>
                </Popper>
                <Popper
                  hover
                  offsetDistance="8"
                  :content="!isApprovaled ? 'Hạn phê duyệt' : 'Phê duyệt lúc'"
                >
                  <div
                    class="px-1 py-[2px] flex items-center rounded mr-2"
                    :class="
                      !isApprovaled
                        ? 'bg-red-200 text-red-500 fill-red-500'
                        : 'bg-green-200 text-green-500 fill-green-500'
                    "
                  >
                    <ClockIcon class="w-3 mr-1" />
                    <span class="text-sm">27/07/2024 15:57</span>
                  </div>
                </Popper>
                <Popper hover offsetDistance="8" content="Tài liệu đính kèm">
                  <div class="h-6 flex flex-center mr-2">
                    <AttachIcon class="w-4 fill-textColor-primary" />
                    <span class="text-textColor-secondary">{{ 0 }}</span>
                  </div>
                </Popper>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 flex flex-center cursor-pointer">
                  <EditIcon class="w-4 fill-textColor-primary" />
                </div>
                <div class="w-6 h-6 flex flex-center cursor-pointer">
                  <DeleteIcon class="w-5 fill-textColor-primary" />
                </div>
                <div class="w-6 h-6 flex flex-center cursor-pointer">
                  <RightIcon class="w-5 fill-textColor-primary" />
                </div>
              </div>
            </div>
            <span class="ml-10">Mô tả: Đây là mô tả</span>
            <span class="ml-10">Phản hổi: Đây là phản hồi</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
