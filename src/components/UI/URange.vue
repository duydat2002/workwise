<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(["update:value"]);

const props = withDefaults(
  defineProps<{
    value: number;
    min?: number;
    max?: number;
    step?: number;
    height?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    height: "15px",
  }
);

const inputValue = computed({
  get: () => props.value,
  set: (value) => {
    emit("update:value", parseFloat(value as unknown as string));
  },
});
</script>

<template>
  <input
    :style="{ '--height': height }"
    type="range"
    v-model="inputValue"
    :min
    :max
    :step
  />
</template>

<style scoped>
input[type="range"] {
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  width: 100%;
  cursor: pointer;
  outline: none;
  /*  slider progress trick  */
  overflow: hidden;
  border-radius: 16px;
}

/* Track: webkit browsers */
input[type="range"]::-webkit-slider-runnable-track {
  height: var(--height);
  background: #ccc;
  border-radius: 16px;
}

/* Track: Mozilla Firefox */
input[type="range"]::-moz-range-track {
  height: var(--height);
  background: #ccc;
  border-radius: 16px;
}

/* Thumb: webkit */
input[type="range"]::-webkit-slider-thumb {
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  height: var(--height);
  width: var(--height);
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #546fff;
  /*  slider progress trick  */
  box-shadow: -407px 0 0 400px #546fff;
}

/* Thumb: Firefox */
input[type="range"]::-moz-range-thumb {
  height: var(--height);
  width: var(--height);
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #546fff;
  /*  slider progress trick  */
  box-shadow: -407px 0 0 400px #546fff;
}
</style>
