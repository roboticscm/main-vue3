<template>
  <div ref="passwordModalWrapperRef" class="modal-wrapper">
    <form @submit.prevent="loginWithoutGenToken" @keydown="state.form.errors.clear($event.currentTarget.name)">
      <div ref="passwordModalRef" :id="props.id" class="modal" @mouseup="onMouseUp">
        <div :id="props.id + 'header'" class="modal-header">
          <div class="modal-title">
            <div>
              <span><i class="fa fa-key"></i></span>
              {{ SYS.MSG.CONFIRM_PASSWORD || '#Confirm Password' }}
            </div>
          </div>
          <div>
            <close-modal-button @click="onCloseModal"></close-modal-button>
          </div>
        </div>
        <div class="modal-content">
          <div class="password-form-content">
            <span style="padding-right: 6px;">{{ COMMON.LABEL.PASSWORD || `#Password` }}: </span>
            <input
              ref="passwordFieldRef"
              id="password"
              class="form-control"
              type="password"
              v-model="state.form.password"
            />
          </div>
        </div>
        <div class="error" v-if="state.form.errors.has('password')" v-text="state.form.errors.get('password')"></div>
        <div class="modal-controller">
          <ok-button @click="loginWithoutGenToken"></ok-button>
          <cancel-button @click="onCancel"></cancel-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, inject, onUnmounted } from 'vue';
import { Settings } from '@/types/base/system';
import { Window } from '@/assets/js/window';
import Form from '@/assets/js/form/form';
import { getMethodNameInSnackCase } from '@/assets/js/util';
import UseModal from '../use-modal';

export default {
  setup(props: any, context: any) {
    const passwordModalRef = ref(null);
    const passwordFieldRef = ref(null);
    const passwordModalWrapperRef = ref(null);
    const { settingsStore } = inject('store');
    const { SYS, COMMON } = inject('locale');
    const useModal = UseModal.setup(props, context, passwordModalRef);

    const state = reactive({
      form: new Form({
        password: '',
        username: localStorage.getItem('username'),
        loginResult: ''
      })
    });

    const show = async () => {
      return new Promise((resolve, reject) => {
        passwordModalWrapperRef.value && passwordModalWrapperRef.value.classList.add('show-modal');

        useModal.modalState.resolve = resolve;
        state.form.reset();
        (state.form as any).username = localStorage.getItem('username');
        passwordFieldRef.value && passwordFieldRef.value.focus();
      });
    };

    const onCloseModal = () => {
      useModal.closeModal(passwordModalWrapperRef, 'CLOSE');
    };

    const onCancel = () => {
      useModal.closeModal(passwordModalWrapperRef, 'CANCEL');
    };
    function loginWithoutGenToken() {
      (state.form as any)
        .post(`sys/auth/${getMethodNameInSnackCase()}`)
        .then((res: any) => {
          if (useModal.modalState.resolve) {
            passwordModalWrapperRef.value && passwordModalWrapperRef.value.classList.remove('show-modal');
            useModal.modalState.resolve('OK');
          }
        })
        .catch((error: any) => {
          console.log('error', error);
        });
    }

    return {
      loginWithoutGenToken,
      state,
      onCancel,
      show,
      onCloseModal,
      props,
      passwordModalRef,
      passwordFieldRef,
      passwordModalWrapperRef,
      SYS,
      COMMON,
      ...useModal
    };
  }
};
</script>

<style lang="scss" scoped>
.password-form-content {
  display: flex;
  align-items: center;
}
</style>
