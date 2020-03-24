<template>
  <tree-view ref="treeViewRef" :id="props.id" :data="state.data">
    <template #label
      ><span class="label"> {{ SYS.LABEL.ROLE || `SYS.LABEL.ROLE` }}</span
      >:</template
    >
  </tree-view>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import TreeView from '@/components/tree-view/index.vue';

export default {
  components: {
    TreeView
  },
  setup(props: any, context: any) {
    const treeViewRef = ref(null);
    const { orgStore } = inject('store');
    const { SYS } = inject('locale');

    const state = reactive({
      data: []
    });

    const loadData = async () => {
      try {
        let res = await orgStore.sysGetOwnerOrgRoleTree();
        state.data = res ? res : [];
        return Promise.resolve('OK');
      } catch (error) {
        state.data = [];
        return Promise.reject('Error');
      }
    };

    loadData();

    const getSelectedRoleId = () => {
      let node = treeViewRef.value.getSelectedNode();
      if (node && node.id && node.id.includes('role')) {
        return node.id.replace('role', '');
      } else {
        return null;
      }
    };

    const getSelectedParentId = () => {
      let node = treeViewRef.value.getSelectedNode();

      if (node && node.pId && node.pId.includes('org')) {
        return node.pId.replace('org', '');
      } else {
        return null;
      }
    };

    const selectNodeByRoleId = (id: any) => {
      treeViewRef.value.selectNodeById(id);
    };

    const getSelectedNode = () => {
      return treeViewRef.value.getSelectedNode();
    };
    return {
      selectNodeByRoleId,
      getSelectedNode,
      props,
      treeViewRef,
      orgStore,
      state,
      getSelectedRoleId,
      getSelectedParentId,
      loadData,
      SYS
    };
  }
};
</script>

<style lang="scss"></style>
