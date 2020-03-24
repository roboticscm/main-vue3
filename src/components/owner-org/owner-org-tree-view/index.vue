<template>
  <tree-view ref="treeViewRef" :id="props.id" :data="state.data" :isCheckableNode="props.isCheckableNode">
    <template #label>{{ SYS.LABEL.ORG || `SYS.LABEL.ORG` }}:</template>
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

    orgStore
      .sysGetOwnerOrgTree()
      .then((dt: any) => {
        state.data = dt;
      })
      .catch((error: any) => {
        console.error(error);
      });

    const selectNodeById = (id: any) => {
      treeViewRef.value.selectNodeById(id);
    };
    return {
      props,
      treeViewRef,
      orgStore,
      state,
      selectNodeById,
      SYS
    };
  }
};
</script>

<style lang="scss"></style>
