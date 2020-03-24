<template>
  <div>
    <checkable-table
      :id="props.id"
      :data="roles"
      :columns="columns"
      :checkList="state.checkList"
      @onCheckChange="onCheckChange"
    ></checkable-table>
  </div>
</template>

<script lang="ts">
import { ref, watch, inject, reactive } from 'vue';
import CheckableTable from '@/components/checkable-table/index.vue';
import { Role } from '@/types/base/system';

export default {
  components: {
    CheckableTable
  },
  setup(props: any, context: any) {
    let roles = ref([]);
    const columns = ref([
      { title: 'Code', name: 'code', render: 'text' },
      { title: 'Name', name: 'name', render: 'text' },
      { title: 'Disabled', name: 'disabled', render: 'checkbox', cssClasses: ['text-center'] }
    ]);
    let state = reactive({
      checkList: []
    });
    const { roleStore } = inject('store');

    const onCheckChange = (event: any) => {
      let checkedRoles = roles.value.map((role: Role) => {
        role.checked = event.checkedRows.filter((r: Role) => r.id === role.id).length > 0;
        return role;
      });
      context.emit('onCheckChange', checkedRoles);
    };

    const loadData = async (orgId: any) => {
      try {
        let res = await roleStore.sysGetRoleListByOrgId(orgId);
        roles.value = res ? res : [];
        return Promise.resolve('OK');
      } catch (error) {
        roles.value = [];
        return Promise.reject('Error');
      }
    };

    watch(
      () => props.checkList,
      (checkList: any) => {
        state.checkList = checkList;
      }
    );

    return {
      props,
      roles,
      state,
      onCheckChange,
      loadData,
      columns
    };
  }
};
</script>

<style lang="scss" scoped></style>
