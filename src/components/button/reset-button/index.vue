<template>
  <button :id="props.id" :type="props.type" class="btn-info" :class="props.class" :disabled="props.disabled">
    <i v-if="props.running" class="fa fa-spinner fa-spin"></i>
    <i v-if="!props.running" class="fa fa-redo"></i>
    {{ T('COMMON.BUTTON.RESET') }}
  </button>
</template>

<script lang="ts">
import { inject } from 'vue';

export default {
  props: {
    id: {
      type: String,
      default: 'btnReset'
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
    const { T } = inject('locale');
    return {
      props,
      T
    };
  }
};
</script>

<style lang="scss"></style>
