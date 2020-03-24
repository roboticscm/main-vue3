<template>
  <div ref="modalWrapperRef" class="modal-wrapper">
    <div ref="modalRef" :id="props.id" class="modal1" @mouseup="onMouseUp">
      <div :id="props.id + 'header'" class="modal-header">
        <div class="modal-title">
          <span v-if="props.fontIcon" v-html="props.fontIcon"></span>
          <span v-if="props.iconData">
            <img :src="props.iconData" />
          </span>
          {{ props.title }}
        </div>
        <div>
          <close-modal-button @click="onCloseModal"></close-modal-button>
        </div>
      </div>
      <div class="bg-green" style="height: 100%;">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, inject, onUnmounted } from 'vue';
import { Settings } from '@/types/base/system';
import { Window } from '@/assets/js/window';
import UseModal from '../use-modal';

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
  setup(props: any, context: any) {
    const modalRef = ref(null);
    const modalWrapperRef = ref(null);
    const { COMMON } = inject('locale');
    const useModal = UseModal.setup(props, context, modalRef);

    const show = async (content: string) => {
      return new Promise((resolve, reject) => {
        useModal.modalState.content = content;
        useModal.modalState.resolve = resolve;
        modalWrapperRef.value.classList.add('show-modal');
      });
    };

    const onCloseModal = () => {
      useModal.closeModal(modalWrapperRef, 'CLOSE');
    };

    return {
      show,
      onCloseModal,
      props,
      modalRef,
      modalWrapperRef,
      COMMON,
      ...useModal
    };
  }
};
</script>

<style lang="scss">
.modal1 {
  position: absolute;
  z-index: $modal-z-index;
  background-color: var(--base-background);
  color: var(--base--color);
  text-align: center;
  border: $default-border;
  resize: both;
  overflow: auto;
  box-shadow: $default-box-shadow;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 300px;
  min-height: 140px;
}
</style>
