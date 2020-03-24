<template>
  <div class="template-wrapper">
    <div class="view-left-main">
      <selectable-table @selection="onSelectedRow" id="assignedRoleUserListId" :data="users" :columns="columns">
        <template #label> </template>
        <template #selectAllButton="{onSelectAll}"> </template>
        <template #unselectAllButton="{onUnselectAll}"> </template>
        <template #toggleSelectionButton="{onToggleSelection}"> </template>
      </selectable-table>
    </div>
    <div class="view-left-bottom"></div>
  </div>
</template>

<script lang="ts">
import { ref, watch, inject } from 'vue';
import SelectableTable from '@/components/selectable-table/index.vue';

export default {
  components: {
    SelectableTable
  },
  setup(props: any, context: any) {
    const columns = ref([
      { title: 'First Name', name: 'firstName' },
      { title: 'Last Name', name: 'lastName' },
      { title: 'Username', name: 'username' }
    ]);
    const users = ref([]);
    const onSelectedRow = (event: any) => {
      context.emit('selectedRow', event);
    };
    const { system } = inject('store');

    watch(
      () => props.loadWorkList,
      (user: any) => {
        loadWorkList();
      }
    );

    const loadWorkList = () => {
      system.assignmentRoleStore
        .sysGetAllAssignmentRoleUserList()
        .then((res: any) => {
          users.value = res ? res : [];
        })
        .catch((error: any) => {
          users.value = [];
          console.error(error);
        });
    };

    loadWorkList();
    return {
      props,
      users,
      onSelectedRow,
      columns,
      loadWorkList
    };
  }
};
</script>

<style lang="scss"></style>
