<template>
  <div ref="inputModalWrapperRef" class="modal-wrapper">
    <form @submit.prevent="onOk" @keydown="state.form.errors.clear($event.currentTarget.name)">
      <div ref="inputModalRef" :id="props.id" class="modal" @mouseup="onMouseUp">
        <div :id="props.id + 'header'" class="modal-header">
          <div class="modal-title">
            <div>
              <span><i class="fa fa-terminal"></i></span>
              {{ SYS.TITLE.INPUT_MODAL || '#Input Modal' }}
            </div>
          </div>
          <div>
            <close-modal-button @click="onCloseModal"></close-modal-button>
          </div>
        </div>
        <div class="modal-content">
          <div class="input-form-content">
            <span style="padding-right: 6px; white-space: nowrap;">{{ state.label }}: </span>
            <input
              ref="inputFieldRef"
              id="inputField"
              class="form-control"
              v-model="state.form.inputField"
              @change="onChange"
            />
          </div>
        </div>
        <div
          class="error"
          v-if="state.form.errors.has('inputField')"
          v-text="state.form.errors.get('inputField')"
        ></div>
        <div class="modal-controller">
          <ok-button @click="onOk"></ok-button>
          <cancel-button @click="onCancel"></cancel-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, inject } from 'vue';
import Form from '@/assets/js/form/form';
import UseModal from '../use-modal';
import UseSettings from '@/assets/js/composition/use-settings';
import { StringUtil } from '@/assets/js/string-util';

export default {
  setup(props: any, context: any) {
    const inputModalRef = ref(null);
    const inputFieldRef = ref(null);
    const inputModalWrapperRef = ref(null);
    const { SYS, COMMON } = inject('locale');

    const state = reactive({
      form: new Form({
        inputField: ''
      }),
      label: ''
    });

    const useModal = UseModal.setup(props, context, inputModalRef);
    const useSettings = UseSettings.setup();
    let validateFunc: Function;

    const show = async (type: string, label: string, _validateFunc: Function, defaultValue: any = 10) => {
      return new Promise((resolve, reject) => {
        inputModalWrapperRef.value && inputModalWrapperRef.value.classList.add('show-modal');

        useModal.modalState.resolve = resolve;

        state.label = label;
        if (props.saveState !== true || StringUtil.isEmpty((state.form as any).inputField)) {
          (state.form as any).inputField = defaultValue;
        }
        inputFieldRef.value.type = type;

        inputFieldRef.value.focus();
        validateFunc = _validateFunc;
      });
    };

    const onCloseModal = () => {
      useModal.closeModal(inputModalWrapperRef, 'CLOSE');
    };

    const onCancel = () => {
      useModal.closeModal(inputModalWrapperRef, 'CANCEL');
    };

    const onOk = () => {
      if (validateFunc) {
        const validattion = validateFunc();
        if (validattion === true) {
          useModal.closeModal(inputModalWrapperRef, 'OK');
        } else {
          state.form.errors.record({
            inputField: validattion
          });
        }
      } else {
        useModal.closeModal(inputModalWrapperRef, 'OK');
      }
    };

    const getInputValue = () => {
      return (state.form as any).inputField;
    };

    const onChange = () => {
      if (props.saveState === true) {
        useSettings.saveSettings('input' + props.id, ['input'], [(state.form as any).inputField]);
      }
    };

    onMounted(() => {
      if (props.saveState === true) {
        useSettings.loadSettings('input' + props.id).then((data: any) => {
          const filter = data.filter((it) => it.key === 'input');
          if (filter.length > 0) {
            (state.form as any).inputField = filter[0].value;
          }
        });
      }
    });
    return {
      state,
      props,

      inputModalRef,
      inputFieldRef,
      inputModalWrapperRef,

      onOk,
      onChange,

      onCancel,
      show,
      onCloseModal,

      getInputValue,

      SYS,
      COMMON,
      ...useModal
    };
  }
};
</script>

<style lang="scss" scoped>
.input-form-content {
  display: flex;
  align-items: center;
}
</style>
