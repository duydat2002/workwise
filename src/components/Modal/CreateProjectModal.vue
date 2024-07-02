<script setup lang="ts">
import XIcon from "@icons/x.svg";
import PlusIcon from "@icons/plus.svg";
import Modal from "./Modal.vue";
import { ref } from "vue";
import UInput from "@/components/UI/UInput.vue";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import LabelPopup from "@/components/Popup/LabelPopup/LabelPopup.vue";
import { getDynamicImage } from "@/helpers";

const emit = defineEmits(["close"]);

const inputBackground = ref<HTMLInputElement>();
const name = ref("");
const description = ref("");
const background = ref<string>(getDynamicImage("Rectangle.png"));
const labelPopup = ref(false);

const closeModal = () => {
  console.log("object");
  emit("close");
};

const handleUploadBackground = () => {
  inputBackground.value?.click();
};

const getInputBackground = (event: Event) => {
  const file = (event.target as HTMLInputElement).files![0];

  if (file && file.type.includes("image")) {
    const theReader = new FileReader();
    theReader.onloadend = async () => {
      background.value =
        (await theReader.result?.toString()) ||
        getDynamicImage("Rectangle.png");
    };
    theReader.readAsDataURL(file);
  }
};

const handleAddLabel = () => {
  labelPopup.value = true;
};
</script>

<template>
  <Modal @click-outside="closeModal">
    <div
      class="flex flex-col m-5 h-[calc(100vh-40px)] w-[500px] bg-bgColor-primary p-4 rounded-lg overflow-y-auto scroll-vert"
    >
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold text-textColor-primary"
          >Thêm dự án mới</span
        >
        <div class="cursor-pointer" @click="closeModal">
          <XIcon class="w-3 fill-textColor-secondary" />
        </div>
      </div>
      <div class="mt-3 not-firstchild:mt-2">
        <div class="flex flex-col">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Ảnh bìa
          </label>
          <div class="relative group">
            <img :src="background" alt="" />
            <div
              class="absolute group-hover:flex top-0 left-0 right-0 bottom-0 hidden flex-center bg-[#0000004f] not-lastchild:mr-2"
            >
              <UButton
                variantType="secondary"
                class="hover:bg-hover"
                @click="handleUploadBackground"
              >
                <span class="to-bgColor-primary">Tải từ máy tính</span>
              </UButton>
              <UButton variantType="secondary" class="hover:bg-hover">
                <span class="to-bgColor-primary">Chọn ảnh có sẵn</span>
              </UButton>
            </div>
            <input
              class="hidden"
              ref="inputBackground"
              accept="image/jpeg,image/png,image/jpg"
              type="file"
              @change="getInputBackground"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Tên dự án
          </label>
          <UInput
            class="w-[250px]"
            name="name"
            v-model:propValue="name"
            placeholder="Tên dự án"
          >
          </UInput>
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Mô tả
          </label>
          <UInput
            class="w-[250px]"
            name="description"
            v-model:propValue="description"
            placeholder="Mô tả"
          >
          </UInput>
        </div>
        <div class="relative flex flex-col">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Nhãn
          </label>
          <div class="flex items-center not-lastchild:mr-1">
            <span
              class="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-md cursor-pointer"
              >Work</span
            >
            <span
              class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md cursor-pointer"
              >Game</span
            >
            <span
              class="px-3 py-2 bg-bgColor-secondary hover:bg-hover rounded-md cursor-pointer"
              title="Thêm nhãn"
              @click="handleAddLabel"
              ><PlusIcon class="w-3 fill-textColor-primary"
            /></span>
          </div>
          <LabelPopup
            v-if="labelPopup"
            @close="
              () => {
                labelPopup = false;
              }
            "
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-xs font-bold text-textColor-subtitle"
            >Thành viên
          </label>
          <div class="flex items-center not-lastchild:mr-1">
            <Avatar avatarUrl="" class="w-8" />
            <div
              class="flex flex-center w-8 h-8 rounded-full bg-bgColor-secondary hover:bg-hover cursor-pointer"
              title="Thêm thành viên"
            >
              <PlusIcon class="w-3 fill-textColor-primary" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end not-lastchild:mr-2">
        <UButton variantType="error" @click="closeModal"
          ><span class="text-white font-semibold">Hủy</span></UButton
        >
        <UButton variantType="primary"
          ><span class="text-white font-semibold">Tạo</span></UButton
        >
      </div>
    </div>
  </Modal>
</template>
