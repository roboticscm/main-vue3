<template>
  <modal
    ref="modalRef"
    :id="props.id"
    :title="props.title"
    :heightInPixel="props.heightInPixel"
    :widthInPixel="props.widthInPixel"
    :fontIcon="props.fontIcon"
    :iconData="props.iconData"
  ></modal>
</template>

<script lang="ts">
import Modal from '../base/index.vue';
import { ref } from 'vue';

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    fontIcon: String,
    iconData: String,
    title: String,
    widthInPixel: Number,
    heightInPixel: Number
  },
  components: {
    Modal
  },
  setup(props: any, context: any) {
    const modalRef = ref(null);
    const show = async (content: string) => {
      return modalRef.value.show(content);
    };
    return {
      modalRef,
      show,
      props
    };
  }
};
</script>

<style lang="scss"></style>
