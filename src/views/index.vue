<script setup lang="ts">
import USelect from "@/components/UI/USelect.vue";
import UTagInput from "@/components/UI/UTagInput.vue";
import { auth } from "@/plugins/firebase";
import { useUserStore } from "@/stores";
import { IOption } from "@/types";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { user } = storeToRefs(useUserStore());

const options = ref<IOption[]>([
  { key: "a", value: "a" },
  { key: "b", value: "b" },
  { key: "c", value: "class" },
]);
const selected = ref<string>(options.value[0].key);
const selecteds = ref<IOption[]>([options.value[0]]);

const cac = () => {
  console.log(auth.currentUser);
};
</script>

<template>
  <div>Index</div>
  <button @click="cac">Logout</button>
  <p>{{ user?.email }}</p>

  <USelect v-model:selected="selected" :options></USelect>
  <br />
  <br />
  <br />
  <!-- <UTagInput name="cac" v-model:selecteds="selecteds" :options>
    <template v-slot:default="{ item }">
      <span>{{ item.value }}</span>
    </template>
  </UTagInput> -->
</template>
