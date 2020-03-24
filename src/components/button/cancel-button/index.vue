<template>
  <button :type="props.type" class="btn-danger" :disabled="props.disabled">
    <i class="fa fa-times"></i>
    {{ T(`COMMON.BUTTON.CANCEL`) }}
  </button>
</template>

<script lang="ts">
import { inject, reactive, computed } from 'vue';

export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
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
