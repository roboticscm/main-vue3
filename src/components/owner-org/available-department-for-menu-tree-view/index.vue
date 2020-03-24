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
      ><div class="label">{{ SYS.LABEL.AVAILABLE_DEPARTMENT || '#Available Department' }}:</div></template
    >
  </tree-view>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import TreeView from '@/components/tree-view/index.vue';
import { Debug } from '@/assets/js/debug';

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
          .sysGetAvailableDepartmentTreeForMenu(menuId)
          .then((dt: any) => {
            state.data = dt;
            resolve(dt);
          })
          .catch((error: any) => {
            reject(error);
            Debug.errorSection('Available Department Tree Menu', error);
          });
      });
    };

    const getCheckedLeafIds = (checked: boolean) => {
      return treeViewRef.value.getCheckedLeafIds(checked);
    };

    const disableTree = (disable: boolean) => {
      treeViewRef.value.disableTree(disable);
    };
    return {
      getCheckedLeafIds,
      disableTree,
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
