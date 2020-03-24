<template>
  <div ref="viewConfigModalWrapperRef" class="modal-wrapper">
    <div ref="viewConfigModalRef" :id="props.id" class="modal" @mouseup="onMouseUp">
      <div :id="props.id + 'header'" class="modal-header">
        <div class="modal-title">
          <div>
            <span><i class="fa fa-cog"></i></span>
            {{ SYS.LABEL.CONTROL_CONFIG || '#Control Config' }} - {{ props.title }}
          </div>
        </div>
        <div>
          <close-modal-button @click="onCloseModal"></close-modal-button>
        </div>
      </div>
      <div class="modal-content-full">
        <excel-grid
          ref="excelGridRef"
          :id="'grid' + props.id"
          :columns="columns"
          :data="state.data"
          @changed="onChanged"
          @beforeChange="onBeforeChange"
          :containerWidth="modalState.width"
          :fullWidth="true"
        >
          <template #label>
            <span class="label">{{ SYS.LABEL.CONTROL_LIST || '#Control List' }}: </span></template
          >
        </excel-grid>
      </div>

      <div class="modal-controller">
        <ok-button @click="onOk"></ok-button>
        <cancel-button @click="onCancel"></cancel-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref, inject } from 'vue';
import UseModal from '../use-modal';

export default {
  setup(props: any, context: any) {
    const viewConfigModalRef = ref(null);
    const viewConfigModalWrapperRef = ref(null);
    const excelGridRef = ref(null);
    const { SYS, COMMON } = inject('locale');
    const useModal = UseModal.setup(props, context, viewConfigModalRef);

    const columns = [
      {
        type: 'hidden',
        name: 'controlId'
      },
      {
        type: 'checkbox',
        title: COMMON.LABEL.USE || '#Use',
        name: 'checked',
        width: 70
      },
      {
        type: 'text',
        title: COMMON.LABEL.CODE || '#Code',
        name: 'code',
        width: 80,
        readOnly: true
      },
      {
        type: 'text',
        title: COMMON.LABEL.NAME || '#Name',
        name: 'name',
        width: 120,
        readOnly: true
      }
    ];

    const state = reactive({
      data: []
    });
    const onChanged = (event) => {
      const x = Number(event.x);
      const y = Number(event.y);

      ($.fn as any).jexcel.ignoreEvents = true;
      ($.fn as any).jexcel.ignoreHistory = true;
      if (x === 4) {
        if (event.value) {
          ($(`#grid${props.id}`) as any).jexcel('setValue', `F${y + 1}`, !event.value);
        }
      } else if (x === 5) {
        if (event.value) {
          ($(`#grid${props.id}`) as any).jexcel('setValue', `E${y + 1}`, !event.value);
        }
      }

      ($.fn as any).jexcel.ignoreEvents = false;
      ($.fn as any).jexcel.ignoreHistory = false;
    };

    const show = async (data: any) => {
      state.data = data;
      return new Promise((resolve, reject) => {
        viewConfigModalWrapperRef.value && viewConfigModalWrapperRef.value.classList.add('show-modal');
        useModal.modalState.resolve = resolve;
      });
    };

    const onCloseModal = () => {
      useModal.closeModal(viewConfigModalWrapperRef, 'CLOSE');
    };

    const onCancel = () => {
      useModal.closeModal(viewConfigModalWrapperRef, 'CANCEL');
    };

    const onOk = () => {
      useModal.closeModal(viewConfigModalWrapperRef, 'OK');
    };

    const getData = () => {
      return excelGridRef.value.getData();
    };

    const getRowIndexByValue = (value: string) => {
      if (!state.data) {
        return -1;
      }

      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].code === value) {
          return i;
        }
      }

      return -1;
    };

    const onBeforeChange = (event) => {
      if (event.y == getRowIndexByValue('btnConfig')) {
        // TODO: always check btnConfig
        event.value = true;
      }
    };

    return {
      state,
      props,

      viewConfigModalRef,
      viewConfigModalWrapperRef,
      excelGridRef,

      getData,
      show,

      onCancel,
      onOk,
      onChanged,
      onBeforeChange,
      onCloseModal,

      SYS,
      COMMON,
      ...useModal,

      columns
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  text-align: left;
}
</style>
