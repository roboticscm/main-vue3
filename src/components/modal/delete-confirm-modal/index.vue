<template>
  <confirm-modal
    ref="comfirmModalRef"
    :id="props.id"
    :title="title"
    :heightInPixel="props.heightInPixel ? props.heightInPixel : 150"
    :widthInPixel="props.widthInPixel ? props.widthInPixel : 500"
    fontIcon="<i class='fa fa-trash-alt'></i>"
    :iconData="props.iconData"
  ></confirm-modal>
</template>

<script lang="ts">
import ConfirmModal from '../confirm-modal/index.vue';
import { inject, ref, computed, reactive } from 'vue';

export default {
  components: {
    ConfirmModal
  },
  setup(props: any, context: any) {
    const comfirmModalRef = ref(null);
    const { COMMON } = inject('locale');

    const show = async (contentSubfix: string) => {
      let content = `${COMMON.MSG.DELETE || '#Delete'} <b>[${contentSubfix}]</b>. ${COMMON.MSG.ARE_YOU_SURE ||
        '#Are you sure'}?`;
      return comfirmModalRef.value.show(content);
    };

    const title = computed(() => {
      return `${COMMON.MSG.DELETE || '#Delete'} ${COMMON.LABEL.MENU || '#Menu'}`;
    });

    return {
      comfirmModalRef,
      title,
      show,
      props,
      COMMON
    };
  }
};
</script>

<style lang="scss"></style>
