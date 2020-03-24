<template>
  <div ref="trashRestoreModalWrapperRef" class="modal-wrapper">
    <div ref="trashRestoreModalRef" :id="props.id" class="modal" @mouseup="onMouseUp">
      <div :id="props.id + 'header'" class="modal-header">
        <div class="modal-title">
          <div>
            <span><i class="fa fa-trash-restore"></i></span>
            {{ SYS.LABEL.TRASH_RESTORE || '#Trash Restore' }} - {{ props.title }}
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
          :containerWidth="modalState.width"
          :fullWidth="true"
        >
          <template #label
            ><span class="label">{{ props.tableTitle }}: </span></template
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
import jexcel from 'jexcel';

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: String,
    tableTitle: String,
    columns: {
      type: Array,
      default: () => ['name']
    }
  },
  setup(props: any, context: any) {
    const trashRestoreModalRef = ref(null);
    const trashRestoreModalWrapperRef = ref(null);
    const excelGridRef = ref(null);
    const { SYS, COMMON, T } = inject('locale');
    const useModal = UseModal.setup(props, context, trashRestoreModalRef);

    const state = reactive({
      data: []
    });

    const createDynamicColumns = () => {
      const dynCols = [];
      props.columns.forEach((it) => {
        dynCols.push({
          type: 'text',
          title: T(`COMMON.LABEL.${it.toUpperCase()}`),
          name: it,
          width: 100,
          readOnly: true
        });
      });
      return dynCols;
    };
    const columns = [
      {
        type: 'hidden',
        name: 'id'
      },
      ...createDynamicColumns(),
      {
        type: 'text',
        title: COMMON.LABEL.DELETED_BY || '#Deleted by',
        name: 'deletedBy',
        width: 160,
        readOnly: true
      },
      {
        type: 'text',
        title: COMMON.LABEL.DELETED_DATE || '#Deleted Date',
        name: 'deletedDate',
        width: 80,
        readOnly: true
      },
      {
        type: 'checkbox',
        title: COMMON.LABEL.RESTORE || '#Restore',
        name: 'restore',
        width: 70
      },
      {
        type: 'checkbox',
        title: COMMON.LABEL.FOREVER_DELETE || '#Forever Delete',
        name: 'foreverDelete',
        width: 70
      }
    ];

    const getColumnIndexByName = (name: string) => {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].name === name) {
          return i;
        }
      }

      return -1;
    };
    const onChanged = (event) => {
      const RESTORE_COL = getColumnIndexByName('restore');
      const FOREVER_DEL_COL = getColumnIndexByName('foreverDelete');

      const x = Number(event.x);
      const y = Number(event.y);

      ($.fn as any).jexcel.ignoreEvents = true;
      ($.fn as any).jexcel.ignoreHistory = true;
      if (x === RESTORE_COL) {
        if (event.value) {
          ($(`#grid${props.id}`) as any).jexcel(
            'setValue',
            jexcel.getColumnNameFromId([FOREVER_DEL_COL, y]),
            !event.value
          );
        }
      } else if (x === FOREVER_DEL_COL) {
        if (event.value) {
          ($(`#grid${props.id}`) as any).jexcel('setValue', jexcel.getColumnNameFromId([RESTORE_COL, y]), !event.value);
        }
      }

      ($.fn as any).jexcel.ignoreEvents = false;
      ($.fn as any).jexcel.ignoreHistory = false;
    };

    const show = async (data: any) => {
      state.data = data;
      return new Promise((resolve, reject) => {
        trashRestoreModalWrapperRef.value && trashRestoreModalWrapperRef.value.classList.add('show-modal');
        useModal.modalState.resolve = resolve;
      });
    };

    const onCloseModal = () => {
      useModal.closeModal(trashRestoreModalWrapperRef, 'CLOSE');
    };

    const onCancel = () => {
      useModal.closeModal(trashRestoreModalWrapperRef, 'CANCEL');
    };

    const onOk = () => {
      useModal.closeModal(trashRestoreModalWrapperRef, 'OK');
    };

    const getData = () => {
      return excelGridRef.value.getData();
    };
    return {
      state,
      getData,
      onCancel,
      onOk,
      show,
      onCloseModal,
      props,
      trashRestoreModalRef,
      trashRestoreModalWrapperRef,
      SYS,
      COMMON,
      ...useModal,
      excelGridRef,
      onChanged,
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
