<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(["update:propValue", "focus", "blur"]);

const props = withDefaults(
  defineProps<{
    id?: string;
    name: string;
    propValue: string;
    placeholder?: string;
    errorMessage?: string;
    disabled?: boolean;
    minHeigth?: string;
    maxHeigth?: string;
  }>(),
  {
    minHeigth: "36px",
    maxHeigth: "36px",
  }
);

const inputValue = computed({
  get: () => props.propValue,
  set: (value) => {
    emit("update:propValue", value);
  },
});
</script>

<template>
  <div class="">
    <textarea
      ref="textareaRef"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      v-model="inputValue"
      :disabled="disabled"
      class="h-[20px] w-full resize-none overflow-y-hidden"
    />
  </div>
</template>
