<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits(["update:value"]);
const props = withDefaults(
  defineProps<{
    value?: boolean;
    width?: string;
    height?: string;
    switchWidth?: string;
    switchWider?: string;
    colorOn?: string;
    colorOff?: string;
    dotColorOn?: string;
    dotColorOff?: string;
  }>(),
  {
    value: false,
    width: "26px",
    height: "16px",
    switchWidth: "12px",
    switchWider: "14px",
    colorOn: "#c2d4ff",
    colorOff: "#cccccc",
    dotColorOn: "#007fff",
    dotColorOff: "#ffffff",
  }
);

const switchValue = computed({
  get: () => props.value,
  set: (value) => {
    emit("update:value", value);
  },
});
const initStyle = computed(() => ({
  "--button-width": `${props.width}`,
  "--button-height": `${props.height}`,
  "--toggle-diameter": `${props.switchWidth}`,
  "--button-toggle-offset": `calc((${props.height} - ${props.switchWidth}) / 2)`,
  "--toggle-wider": `${props.switchWider}`,
  "--color-on": `${props.colorOn}`,
  "--color-off": `${props.colorOff}`,
  "--dot-color-on": `${props.dotColorOn}`,
  "--dot-color-off": `${props.dotColorOff}`,
}));
</script>

<template>
  <label class="switch" :style="initStyle">
    <input type="checkbox" v-model="switchValue" />
    <span class="slider"></span>
  </label>
</template>

<style scoped>
.switch {
  height: var(--button-height);
  cursor: pointer;
}

.slider {
  display: inline-block;
  width: var(--button-width);
  height: var(--button-height);
  background-color: var(--color-off);
  border-radius: calc(var(--button-height) / 2);
  position: relative;
  transition: 0.3s all ease-in-out;
}

.slider::after {
  content: "";
  display: inline-block;
  width: var(--toggle-diameter);
  height: var(--toggle-diameter);
  background-color: var(--dot-color-off);
  border-radius: calc(var(--toggle-diameter) / 2);
  position: absolute;
  top: var(--button-toggle-offset);
  transform: translateX(var(--button-toggle-offset));
  transition: 0.3s all ease-in-out;
}

.switch input[type="checkbox"]:checked + .slider {
  background-color: var(--color-on);
}

.switch input[type="checkbox"]:checked + .slider::after {
  background-color: var(--dot-color-on);
  transform: translateX(
    calc(
      var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)
    )
  );
}

.switch input[type="checkbox"] {
  display: none;
}

.switch input[type="checkbox"]:active + .slider::after {
  width: var(--toggle-wider);
}

.switch input[type="checkbox"]:checked:active + .slider::after {
  transform: translateX(
    calc(
      var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)
    )
  );
}
</style>
