<template>
  <dropdown ref="dropdownRef" id="roleDropdownId" :data="state.roles"></dropdown>
</template>

<script lang="ts">
import { ref, watch, inject, reactive, computed, onMounted } from 'vue';
import { Role } from '@/types/base/system';

export default {
  setup(props: any, context: any) {
    const dropdownRef = ref(null);
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

    loadData(null);

    const getSelectedId = () => {
      return dropdownRef.value.getSelectedId();
    };
    const getSelectedName = () => {
      return dropdownRef.value.getSelectedName();
    };
    const getSelectedItem = () => {
      return dropdownRef.value.getSelectedItem();
    };
    return {
      loadData,
      state,
      getSelectedId,
      dropdownRef,
      getSelectedName,
      getSelectedItem
    };
  }
};
</script>

<style lang="scss" scoped></style>
