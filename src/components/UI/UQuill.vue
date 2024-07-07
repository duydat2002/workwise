<script setup lang="ts">
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { Delta, QuillEditor } from "@vueup/vue-quill";

import { computed, nextTick } from "vue";
import { ref, watch } from "vue";

const emit = defineEmits(["update:content", "focus", "blur"]);

const props = withDefaults(
  defineProps<{
    content?: Delta;
    placeholder?: string;
    theme?: "snow" | "bubble";
    enable?: boolean;
  }>(),
  {
    theme: "snow",
    enable: true,
  }
);

const quillRef = ref();

const inputValue = computed({
  get: () => props.content,
  set: (value) => {
    emit("update:content", value);
  },
});

const handleFocus = () => {
  emit("focus");
};

// const handleBlur = () => {
//   emit("blur");
// };

watch(
  () => props.theme,
  () => {
    quillRef.value.reinit();
    if (props.theme == "snow") {
      nextTick(() => {
        quillRef.value.focus();
      });
    }
  }
);
</script>

<template>
  <div
    class="flex flex-col border border-borderColor has-[.focus]:border-primary-light rounded"
  >
    <QuillEditor
      ref="quillRef"
      toolbar="essential"
      v-model:content="inputValue"
      contentType="delta"
      :placeholder="placeholder"
      :theme="theme"
      :enable="enable"
      @click="handleFocus"
    />
  </div>
</template>

<style>
.ql-snow .ql-editor {
  min-height: 200px;
}
</style>
