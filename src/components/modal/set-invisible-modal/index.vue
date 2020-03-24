<template>
  <div>
    <c>---------------------Invisible Component--------------------</c>
    <confirm-modal
      :title="T('COMMON.MSG.CONFIRMATION')"
      fontIcon="<i class='fa fa-question'></i>"
      ref="confirmModalRef"
      id="confirmModalId"
    >
    </confirm-modal>

    <progress-bar :loading="viewState.loading"></progress-bar>
    <snackbar ref="snackbarRef"></snackbar>
    <input-modal ref="inputModalRef" id="inputModalId" :saveState="props.saveStateInputModal"> </input-modal>
    <delete-confirm-modal ref="deleteConfirmModalRef" id="deleteConfirmModalId"> </delete-confirm-modal>
    <password-confirm-modal ref="passwordConfirmModalRef" id="passwordConfirmModalId"> </password-confirm-modal>
    <trash-restore-modal
      ref="trashRestoreModalRef"
      id="trashRestoreId"
      :title="getViewTitle()"
      :tableTitle="T('SYS.LABEL.DELETED_MENU')"
      :columns="viewState.trashRestoreColumns"
    />

    <view-config-modal ref="viewConfigModalRef" id="viewMenuConfigId" :title="getViewTitle()" />
    <c>---------------------//Invisible Component--------------------</c>
  </div>
</template>

<script lang="ts">
import { ref, inject } from 'vue';

export default {
  setup(props) {
    const snackbarRef = ref(null);
    const deleteConfirmModalRef = ref(null);
    const passwordConfirmModalRef = ref(null);
    const trashRestoreModalRef = ref(null);
    const viewConfigModalRef = ref(null);
    const inputModalRef = ref(null);
    const { T } = inject('locale');

    const confirmModalRef = ref(null);
    return {
      props,
      confirmModalRef,
      deleteConfirmModalRef,
      passwordConfirmModalRef,
      trashRestoreModalRef,
      viewConfigModalRef,
      snackbarRef,
      inputModalRef,
      T,
      ...props.useView
    };
  }
};
</script>

<style lang="scss" scoped></style>
