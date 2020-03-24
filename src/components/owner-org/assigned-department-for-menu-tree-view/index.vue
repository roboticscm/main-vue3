<template>
  <tree-view
    ref="treeViewRef"
    :disabled="props.disabled"
    :id="props.id"
    :data="state.data"
    :isCheckableNode="true"
    @click="onClick"
  >
    <template #label
      ><div class="label">{{ SYS.LABEL.ASSIGNED_DEPARTMENT || '#Assigned Department' }}:</div></template
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

    const onClick = (event: any) => {
      context.emit('click', event);
    };

    const selectNodeById = (id: any) => {
      treeViewRef.value.selectNodeById(id);
    };

    const loadData = async (menuId: any) => {
      return new Promise((resolve, reject) => {
        orgStore
          .sysGetDepartmentTreeByMenuId(menuId)
          .then((dt: any) => {
            state.data = dt;
            resolve(dt);
          })
          .catch((error: any) => {
            reject(error);
            console.error(error);
          });
      });
    };

    const getCheckedLeafIds = (checked: boolean) => {
      return treeViewRef.value.getCheckedLeafIds(checked);
    };

    const disableTree = (disable: boolean) => {
      treeViewRef.value.disableTree(disable);
    };
    const cleanTree = () => {
      treeViewRef.value.cleanTree();
    };

    return {
      getCheckedLeafIds,
      disableTree,
      cleanTree,
      props,
      loadData,
      treeViewRef,
      orgStore,
      onClick,
      state,
      selectNodeById,
      SYS
    };
  }
};
</script>

<style lang="scss"></style>
