<template>
  <div class="template-wrapper">
    <div class="view-left-main">
      <owner-org-role-tree-view id="ownerOrgRoleTreeViewId" ref="ownerOrgRoleTreeViewRef" @click="onRoleTreeClick" />
    </div>
    <div class="view-left-bottom"></div>
  </div>
</template>

<script lang="ts">
import { ref, inject } from 'vue';
import OwnerOrgRoleTreeView from '@/components/owner-org/owner-org-role-tree-view/index.vue';

export default {
  components: {
    OwnerOrgRoleTreeView
  },
  setup(props: any, context: any) {
    const ownerOrgRoleTreeViewRef = ref(null);

    const { system } = inject('store');
    const { roleDetailStore } = system;

    const onRoleTreeClick = (event: any) => {
      roleDetailStore.workListContext = context;
      roleDetailStore.treeRef = ownerOrgRoleTreeViewRef;
      roleDetailStore.roleTreeClick();
    };

    const reloadWorkList = () => {
      const selectedNode = ownerOrgRoleTreeViewRef.value.getSelectedNode();
      return new Promise((resolve, reject) => {
        ownerOrgRoleTreeViewRef.value
          .loadData()
          .then((data) => {
            resolve(data);
            if (selectedNode) {
              ownerOrgRoleTreeViewRef.value.selectNodeByRoleId(selectedNode.id);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    return {
      onRoleTreeClick,
      reloadWorkList,
      ownerOrgRoleTreeViewRef
    };
  }
};
</script>

<style lang="scss"></style>
