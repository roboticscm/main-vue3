<template>
  <button :id="props.id" :type="props.type" class="btn-info" :class="props.class" :disabled="props.disabled">
    <i class="fa fa-cog"></i>
    {{ T('COMMON.BUTTON.CONFIG') }}
  </button>
</template>

<script lang="ts">
import { inject } from 'vue';

export default {
  props: {
    id: {
      type: String,
      default: 'btnConfig'
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    class: String
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
