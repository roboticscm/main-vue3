<template>
  <selectable-table
    ref="selectableTableRef"
    :id="props.userListId"
    :data="users"
    :columns="columns"
    :selectAll="props.selectAll"
    :unselectAll="props.unselectAll"
  >
    <template #label>Users:</template>
    <template #selectAllButton="{onSelectAll}">
      <select-all-button @click="onSelectAll"></select-all-button>
    </template>

    <template #unselectAllButton="{onUnselectAll}">
      <unselect-all-button @click="onUnselectAll"></unselect-all-button>
    </template>

    <template #toggleSelectionButton="{onToggleSelection}">
      <toggle-selection-button @click="onToggleSelection"></toggle-selection-button>
    </template>
  </selectable-table>
</template>

<script lang="ts">
import { inject, ref, watch } from 'vue';
import SelectableTable from '@/components/selectable-table/index.vue';
import SelectAllButton from '@/components/button/select-all-button/index.vue';
import UnselectAllButton from '@/components/button/unselect-all-button/index.vue';
import ToggleSelectionButton from '@/components/button/toggle-selection-button/index.vue';

export default {
  components: {
    SelectableTable,
    SelectAllButton,
    UnselectAllButton,
    ToggleSelectionButton
  },
  setup(props: any, context: any) {
    const { userStore } = inject('store');

    const columns = ref([
      { title: 'First Name', name: 'firstName' },
      { title: 'Last Name', name: 'lastName' },
      { title: 'Username', name: 'username' }
    ]);

    const users = ref([]);
    const selectableTableRef = ref(null);

    const loadData = async (orgId: any) => {
      try {
        let res = await userStore.sysGetUserListByOrgId(orgId);
        users.value = res ? res : [];

        return Promise.resolve('OK');
      } catch (error) {
        users.value = [];
        return Promise.reject('Error');
      }
    };

    const selectAll = () => {
      selectableTableRef.value.selectAll();
    };

    const unSelectAll = () => {
      selectableTableRef.value.unSelectAll();
    };

    const toggleSelection = () => {
      selectableTableRef.value.toggleSelection();
    };

    const selectRowById = (id: any) => {
      selectableTableRef.value.selectRowById(id);
    };

    const getSelectedUsers = () => {
      return selectableTableRef.value.getSelectedData();
    };
    return {
      userStore,
      users,
      props,
      selectAll,
      unSelectAll,
      selectableTableRef,
      loadData,
      columns,
      selectRowById,
      getSelectedUsers
    };
  }
};
</script>

<style lang="scss"></style>
