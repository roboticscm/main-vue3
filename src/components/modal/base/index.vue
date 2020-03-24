<template>
  <div ref="modalWrapperRef" class="modal-wrapper">
    <div ref="modalRef" :id="props.id" class="modal" @mouseup="onMouseUp">
      <div :id="props.id + 'header'" class="modal-header">
        <div class="modal-title">
          <div>
            <span v-if="props.fontIcon" v-html="props.fontIcon"></span>
            <span v-if="props.iconData">
              <img :src="props.iconData" />
            </span>
            {{ props.title }}
          </div>
        </div>
        <div>
          <close-modal-button @click="onCloseModal"></close-modal-button>
        </div>
      </div>
      <div class="modal-content" style="height: 100%;">
        <p v-html="modalState.content"></p>
        <slot name="content"></slot>
      </div>

      <div v-if="props.showControlButton" class="modal-controller">
        <ok-button @click="onOk"></ok-button>
        <cancel-button @click="onCancel"></cancel-button>
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
    showControlButton: {
      type: Boolean,
      default: true
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
    const { settingsStore } = inject('store');
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

    const onCancel = () => {
      useModal.closeModal(modalWrapperRef, 'CANCEL');
    };

    const onOk = () => {
      useModal.closeModal(modalWrapperRef, 'OK');
    };

    return {
      onOk,
      onCancel,
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

<style lang="scss"></style>
