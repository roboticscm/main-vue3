<template>
  <button :id="props.id" :type="props.type" class="btn-normal" :class="props.class" :disabled="props.disabled">
    <i class="fa fa-trash-restore"></i>
    {{ T('COMMON.BUTTON.TRASH_RESTORE') }}
  </button>
</template>

<script lang="ts">
import { inject } from 'vue';

export default {
  props: {
    id: {
      type: String,
      default: 'btnTrashRestore'
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
