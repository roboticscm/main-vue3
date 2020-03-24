<template>
  <excel-grid ref="roleGridRef" id="roleGridId" :columns="columns" :data="state.roles">
    <template #label>Roles:</template>
  </excel-grid>
</template>

<script lang="ts">
import { ref, watch, inject, reactive, computed, onMounted } from 'vue';
import { Role } from '@/types/base/system';

export default {
  setup(props: any, context: any) {
    const columns = [
      {
        type: 'checkbox',
        title: '[]',
        name: 'checked',
        width: 40
      },
      {
        type: 'hidden',
        name: 'id',
        title: 'id'
      },
      {
        type: 'hidden',
        name: 'ownerOrgId',
        title: 'ownerOrgId'
      },
      {
        type: 'text',
        title: 'Code',
        name: 'code',
        width: 80,
        readOnly: true
      },
      {
        type: 'text',
        title: 'Name',
        name: 'name',
        width: 120,
        readOnly: true
      },
      {
        type: 'checkbox',
        title: 'Disabled',
        name: 'disabled',
        width: 80
      }
    ];

    const roleGridRef = ref(null);
    const state = reactive({
      roles: []
    });

    const { roleStore } = inject('store');

    const loadData = async (orgId: any) => {
      try {
        let res = await roleStore.sysGetRoleListByOrgId(orgId);
        state.roles = res ? res : [];
        return Promise.resolve('OK');
      } catch (error) {
        state.roles = [];
        return Promise.reject('Error');
      }
    };

    // onMounted(() => {
    //   let gridInstance = roleGridRef.value.getGridInstance();
    //   gridInstance.hideIndex();
    // });

    const getData = () => {
      return roleGridRef.value.getData();
    };

    const applyAssignedRole = (assignedRoles: any) => {
      state.roles = state.roles.map((item) => {
        let assignedRole = assignedRoles.filter((ar: any) => ar.roleId === item.id);
        if (assignedRole.length > 0) {
          item.checked = true;
          item.disabled = assignedRole[0].disabled;
        } else {
          item.checked = false;
          item.disabled = false;
        }
        return item;
      });
    };

    return {
      loadData,
      state,
      columns,
      roleGridRef,
      getData,
      applyAssignedRole
    };
  }
};
</script>

<style lang="scss" scoped></style>
