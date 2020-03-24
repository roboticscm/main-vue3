<template>
  <input
    type="range"
    :min="props.min ? props.min : 1"
    :max="props.max ? props.max : 10"
    class="full-width slider"
    :id="props.id"
    @input="onInput"
    :value="props.value"
    ref="rangeRef"
  />
</template>

<script lang="ts">
import { ref, reactive } from 'vue';

export default {
  setup(props: any, context: any) {
    const rangeRef = ref(null);

    const onInput = (event) => {
      context.emit('input', rangeRef.value.value);
    };

    const setValue = (value: number) => {
      rangeRef.value.value = value;
    };
    return {
      rangeRef,
      props,

      onInput,
      setValue
    };
  }
};
</script>

<style lang="scss">
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: var(--bg-tertiary);
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--bg-secondary);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--bg-secondary);
  cursor: pointer;
}
</style>
