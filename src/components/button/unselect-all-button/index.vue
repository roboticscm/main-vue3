<template>
  <button :id="props.id" :type="props.type" class="btn-small-info" :class="props.class" :disabled="props.disabled">
    <i class="fa fa-redo"></i>
    {{ T('COMMON.BUTTON.UNSELECT_ALL') }}
  </button>
</template>

<script lang="ts">
import { inject } from 'vue';
export default {
  props: {
    id: {
      type: String,
      default: 'btnUnSelectAll'
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
