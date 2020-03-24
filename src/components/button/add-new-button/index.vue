<template>
  <button :id="props.id" :type="props.type" :class="props.class" :disabled="props.disabled">
    <span v-html="props.icon"></span>
    {{ props.label }}
  </button>
</template>

<script lang="ts">
import { T } from '@/assets/js/locale/locale';

export default {
  props: {
    id: {
      type: String,
      default: 'btnAddNew'
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: T('COMMON.BUTTON.ADD_NEW')
    },
    icon: {
      type: String,
      default: '<i class="fa fa-plus"></i>'
    },
    class: {
      type: String,
      default: 'btn-info'
    }
  },
  setup(props: any, context: any) {
    return {
      props
    };
  }
};
</script>

<style lang="scss"></style>
