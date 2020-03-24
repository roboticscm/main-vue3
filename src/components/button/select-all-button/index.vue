<template>
  <button :id="props.id" :type="props.type" :class="props.class" class="btn-small-primary" :disabled="props.disabled">
    <i class="fa fa-check-double"></i>
    {{ T('COMMON.BUTTON.SELECT_ALL') }}
  </button>
</template>

<script lang="ts">
import { inject } from 'vue';
export default {
  props: {
    id: {
      type: String,
      default: 'btnSelectAll'
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
