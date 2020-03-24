<template>
  <div class="template-wrapper">
    <c>---------------------Invisible Component--------------------</c>
    <progress-bar :loading="viewState.loading"></progress-bar>
    <snackbar ref="snackbarRef" id="roleDetailSnackbarId"></snackbar>
    <c>---------------------//Invisible Component--------------------</c>
    <div class="view-content-main">
      <role-control-grid id="roleControlGridId" ref="roleControlGridRef" />
    </div>

    <c>---------------------Controller--------------------</c>
    <div class="view-content-bottom">
      <reset-button @click="onReset" :running="viewState.resetRunning"></reset-button>
      <save-button @click="onSaveOrUpdateOrDelete" :running="viewState.saveRunning"></save-button>
    </div>
    <c>---------------------//Controller--------------------</c>
  </div>
</template>

<script lang="ts">
import { ref, watch, inject } from 'vue';
import RoleControlGrid from '@/components/role/role-control-grid/index.vue';
import { SObject } from '@/assets/js/sobject';

export default {
  components: {
    RoleControlGrid
  },

  setup(props: any, context: any) {
    const snackbarRef = ref(null);
    const roleControlGridRef = ref(null);
    const { system } = inject('store');
    const { roleDetailStore } = system;
    const { SYS } = inject('locale');
    const useView = props.useView;
    let beforeData: any = null;

    const checkForNoDataChange = () => {
      let changedObject = SObject.getDiffRowObjectArray(
        beforeData,
        roleControlGridRef.value && roleControlGridRef.value.getData()
      );

      if (SObject.isEmptyField(changedObject)) {
        snackbarRef.value.showNoDataChange();
        return true;
      }

      return changedObject;
    };

    const onSaveOrUpdateOrDelete = () => {
      const { orgId, roleId } = props.selectedRole;

      if (roleId === null) {
        snackbarRef.value &&
          snackbarRef.value.show(SYS.MSG.YOU_MUST_SELECT_ROLE_ON_ROLE_TREE || '#You must select a Role on Role tree');
        return;
      }

      // check for data change
      let changedObject = checkForNoDataChange();
      if (changedObject === true) {
        return;
      }
      const savedData = roleControlGridRef.value && roleControlGridRef.value.getData();
      useView.viewState.saveRunning = true;
      system.roleDetailStore
        .saveOrUpdateOrDelete(roleId, preProcessData(changedObject, savedData))
        .then((res: any) => {
          beforeData = savedData;
          context.emit('reloadWorkList');

          useView.viewState.saveRunning = false;
          snackbarRef.value && snackbarRef.value.showUpdateSuccess();
        })
        .catch((error: any) => {
          console.error(error);
          useView.viewState.saveRunning = false;
        });
    };

    const onReset = () => {
      if (checkForNoDataChange() === true) {
        return;
      }

      roleDetailStore.roleTreeClick();
    };

    const preProcessData = (changeData: any, originData: any) => {
      let prevMenuId: any = null;
      for (let i = 0; i < changeData.length; i++) {
        if (prevMenuId === null || prevMenuId !== changeData[i].menuId) {
          let filter = originData.filter((item: any) => {
            return item.menuId === changeData[i].menuId && item.menuName.length > 0;
          });
          changeData[i].menuName = filter[0].menuName;
        }

        prevMenuId = changeData[i].menuId;
      }

      return changeData;
    };

    watch(
      () => props.selectedRole,
      (selectedRole: any) => {
        const { orgId, roleId } = selectedRole;
        if (orgId && roleId) {
          useView.viewState.loading = true;
          roleControlGridRef.value
            .loadData(orgId, roleId)
            .then((_: any) => {
              beforeData = roleControlGridRef.value.getData();
              useView.viewState.loading = false;
            })
            .catch((error: any) => {
              useView.viewState.loading = false;
              console.error(error);
            });
        }
      }
    );

    return {
      ...useView,
      onReset,
      checkForNoDataChange,
      onSaveOrUpdateOrDelete,
      beforeData,
      roleControlGridRef,
      snackbarRef,
      SYS
    };
  }
};
</script>

<style lang="scss" scoped></style>
