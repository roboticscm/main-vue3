<template>
  <button
    :id="props.id"
    type="button"
    @click.stop="onClick"
    :disabled="props.disabled"
    class="btn-small-normal"
    :class="props.class"
  >
    <i v-if="state.open !== true" class="fa fa-minus"></i>
    <i v-else class="fa fa-angle-down"></i>
  </button>
</template>

<script lang="ts">
import { reactive } from 'vue';

export default {
  props: {
    id: {
      type: String,
      default: 'btnToggle'
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    class: String,
    running: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: any) {
    const state = reactive({
      open: true
    });
    const onClick = (event: any) => {
      state.open = !state.open;
      context.emit('click', state.open);
    };

    const setValue = (value: boolean) => {
      state.open = value;
      context.emit('click', state.open);
    };
    return {
      props,
      state,
      onClick,
      setValue
    };
  }
};
</script>

<style lang="scss"></style>
