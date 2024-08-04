<script setup lang="ts">
import XIcon from "@icons/x.svg";
import PlusIcon from "@icons/plus.svg";
import ExclamationIcon from "@icons/exclamation-mark.svg";
import Modal from "./Modal.vue";
import { onBeforeUnmount, ref, watch } from "vue";
import UInput from "@/components/UI/UInput.vue";
import UButton from "@/components/UI/UButton.vue";
import LabelPopup from "@/components/Popup/LabelPopup/LabelPopup.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { storeToRefs } from "pinia";
import { useProjectStore, useThemeStore, useUserStore } from "@/stores";
import ImagePopup from "@/components/Popup/ImagePopup/ImagePopup.vue";
import { ILabel } from "@/types";
import { createProject } from "@/services/project";
import { toast } from "vue3-toastify";
import UTextarea from "@/components/UI/UTextarea.vue";

const emit = defineEmits(["close"]);

const { user } = storeToRefs(useUserStore());
const { theme } = storeToRefs(useThemeStore());
const { addProjectStore } = useProjectStore();

const inputBackground = ref<HTMLInputElement>();
const name = ref("");
const description = ref("");
const background = ref<string>("");
const backgroundFile = ref<File>();
const labels = ref<ILabel[]>([]);
const startDate = ref();
const dueDate = ref();
const nameError = ref<string>();
const descriptionError = ref<string>();
const backgroundError = ref<string>();
const dateError = ref<string>();
const activeLabelPopup = ref(false);
const activeImagePopup = ref(false);
const isLoadingCreate = ref(false);

const validate = () => {
  nameError.value = undefined;
  backgroundError.value = undefined;
  let check = true;

  if (name.value.trim() == "") {
    nameError.value = "Tên dự án không được để trống.";
    check = false;
  }

  if (!background.value && !backgroundFile.value) {
    backgroundError.value = "Ảnh bìa là bắt buộc.";
    check = false;
  }

  if (
    !background.value &&
    backgroundFile.value &&
    !backgroundFile.value.type.includes("image")
  ) {
    backgroundError.value = "Ảnh bìa phải là ảnh.";
    check = false;
  }

  if (
    startDate.value &&
    dueDate.value &&
    startDate.value.getTime() > dueDate.value.getTime()
  ) {
    dateError.value = "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.";
    check = false;
  }

  return check;
};

const handleCreateProject = async () => {
  if (validate()) {
    isLoadingCreate.value = true;
    const formData = new FormData();

    if (backgroundFile.value) {
      formData.append("background", backgroundFile.value);
    } else {
      formData.append("backgroundUrl", background.value);
    }

    formData.append("name", name.value);
    formData.append("description", description.value);
    formData.append("labels", JSON.stringify(labels.value.map((l) => l.id)));
    if (startDate.value) formData.append("startDate", startDate.value);
    if (dueDate.value) formData.append("dueDate", dueDate.value);

    const data = await createProject(formData);

    if (data.success) {
      // addProjectStore(data.result!.project);
      toast.success("Tạo dự án thành công!");
      emit("close");
    } else {
      toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau.");
    }
    isLoadingCreate.value = false;
  }
};

const closeModal = () => {
  emit("close");
};

const handleUploadBackground = () => {
  inputBackground.value?.click();
};

const getInputBackground = (event: Event) => {
  backgroundFile.value = undefined;
  const file = (event.target as HTMLInputElement).files![0];

  if (file && file.type.includes("image")) {
    backgroundFile.value = file;
    const theReader = new FileReader();
    theReader.onloadend = async () => {
      background.value = (await theReader.result?.toString()) || "";
    };
    theReader.readAsDataURL(file);
  }
};

const chooseBackgroundTemplate = (url: string) => {
  background.value = url;
  backgroundFile.value = undefined;
};

const handleAddLabel = () => {
  activeLabelPopup.value = true;
};

watch(
  () => user.value?.createdProjectLabels,
  (createdProjectLabels) => {
    labels.value = labels.value.filter((l) =>
      createdProjectLabels?.find((pl) => pl.id == l.id)
    );
  }
);

onBeforeUnmount(() => {
  background.value = "";
});
</script>

<template>
  <Modal @click-outside="closeModal">
    <div class="m-5">
      <div
        class="flex flex-col h-[calc(100vh-40px)] w-full max-w-[800px] bg-bgColor-primary py-4 rounded-lg"
      >
        <div class="px-4 flex items-center justify-between">
          <span class="text-lg font-semibold text-textColor-primary"
            >Thêm dự án mới</span
          >
          <div class="cursor-pointer" @click="closeModal">
            <XIcon class="w-3 fill-textColor-secondary" />
          </div>
        </div>
        <div class="px-4 mt-3 overflow-y-auto scroll-vert none">
          <div class="not-firstchild:mt-5">
            <div class="flex flex-col">
              <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                >Ảnh bìa
              </label>
              <div
                class="relative w-full h-[300px] group bg-cover bg-center bg-no-repeat bg-bgColor-secondary"
                :style="{ backgroundImage: `url(${background})` }"
              >
                <div
                  class="absolute group-hover:flex top-0 left-0 right-0 bottom-0 hidden flex-center bg-[#0000004f] not-lastchild:mr-2 has-[.noBackground]:flex"
                  :class="{ noBackground: background == '' }"
                >
                  <UButton
                    variantType="secondary"
                    class="hover:opacity-80"
                    @click="handleUploadBackground"
                  >
                    <span class="to-bgColor-primary">Tải từ máy tính</span>
                  </UButton>
                  <UButton
                    variantType="secondary"
                    class="hover:opacity-80"
                    @click="
                      () => {
                        activeImagePopup = true;
                      }
                    "
                  >
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
                <ImagePopup
                  v-if="activeImagePopup"
                  @choose="chooseBackgroundTemplate"
                  @close="
                    () => {
                      activeImagePopup = false;
                    }
                  "
                ></ImagePopup>
              </div>
              <div v-if="backgroundError" class="flex items-center">
                <ExclamationIcon class="w-4 fill-error mr-1 flex-shrink-0" />
                <span class="text-sm text-error">{{ backgroundError }}</span>
              </div>
            </div>
            <div class="flex flex-col">
              <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                >Tên dự án
              </label>
              <UInput
                name="name"
                v-model:propValue="name"
                placeholder="Tên dự án"
                :errorMessage="nameError"
              >
              </UInput>
            </div>
            <div class="flex flex-col">
              <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                >Mô tả
              </label>
              <UTextarea
                v-model:value="description"
                name="description"
                :errorMessage="descriptionError"
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                >Thời gian triển khai
              </label>
              <div class="flex items-center">
                <div class="flex items-center mr-5">
                  <span
                    class="text-sm font-semibold text-textColor-primary mr-3"
                    >Ngày bắt đầu</span
                  >
                  <div class="w-[200px]">
                    <VueDatePicker
                      v-model="startDate"
                      auto-apply
                      partial-flow
                      :enable-time-picker="false"
                      placeholder="mm/dd/yyyy"
                      format="dd/MM/yyyy"
                      :dark="theme == 'dark'"
                      :max-date="dueDate"
                    ></VueDatePicker>
                  </div>
                </div>
                <div class="flex items-center">
                  <span
                    class="text-sm font-semibold text-textColor-primary mr-3"
                    >Ngày kết thúc</span
                  >
                  <div class="w-[200px]">
                    <VueDatePicker
                      v-model="dueDate"
                      auto-apply
                      partial-flow
                      :enable-time-picker="false"
                      placeholder="mm/dd/yyyy"
                      format="dd/MM/yyyy"
                      :dark="theme == 'dark'"
                      position="right"
                      :min-date="startDate"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div v-if="dateError" class="flex items-center">
                <ExclamationIcon class="w-4 fill-error mr-1 flex-shrink-0" />
                <span class="text-sm text-error">{{ dateError }}</span>
              </div>
            </div>
            <div class="relative flex flex-col">
              <label class="mb-1 text-sm font-bold text-textColor-subtitle"
                >Nhãn
              </label>
              <div class="flex items-center not-lastchild:mr-1">
                <span
                  v-for="label in labels"
                  :key="label.name"
                  class="px-3 py-1 text-sm font-semibold text-[#44546f] rounded-md cursor-pointer"
                  :style="{ background: label.color }"
                  >{{ label.name }}</span
                >
                <span
                  class="add-label px-3 py-2 bg-bgColor-secondary hover:bg-hover rounded-md cursor-pointer"
                  title="Thêm nhãn"
                  @click="handleAddLabel"
                  ><PlusIcon class="w-3 fill-textColor-primary"
                /></span>
              </div>
              <LabelPopup
                v-if="activeLabelPopup"
                :labels="user!.createdProjectLabels"
                v-model:labelSelected="labels"
                @close="
                  () => {
                    activeLabelPopup = false;
                  }
                "
              />
            </div>
            <!-- <div class="flex flex-col">
          <label class="mb-1 text-sm font-bold text-textColor-subtitle"
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
        </div> -->
          </div>
        </div>
        <div class="px-4 pt-4 flex items-center justify-end not-lastchild:mr-2">
          <UButton variantType="error" @click="closeModal"
            ><span class="text-white font-semibold">Hủy</span></UButton
          >
          <UButton
            variantType="primary"
            @click="handleCreateProject"
            :isLoading="isLoadingCreate"
            ><span class="text-white font-semibold">Tạo</span></UButton
          >
        </div>
      </div>
    </div>
  </Modal>
</template>
