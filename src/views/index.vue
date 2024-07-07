<script setup lang="ts">
import { auth } from "@/plugins/firebase";
import { useUserStore } from "@/stores";
import { QuillEditor } from "@vueup/vue-quill";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const { user } = storeToRefs(useUserStore());

const abc = ref("");

const cac = () => {
  console.log(auth.currentUser);
};
</script>

<template>
  <div>Index</div>
  <button @click="cac">Logout</button>
  <p>{{ user?.email }}</p>

  <div class="p-5 mt-5 flex flex-col">
    <QuillEditor
      class="h-[200px]"
      toolbar="essential"
      v-model:content="abc"
      contentType="html"
      placeholder="Nhập mô tả..."
    />
  </div>
</template>

<style>
/* .ql-container {
  height: 200px;
} */

.ql-editor {
  height: 100%;
  min-height: 200px;
}
</style>
