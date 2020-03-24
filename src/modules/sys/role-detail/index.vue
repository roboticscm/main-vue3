<template>
  <div class="template-wrapper">
    <view-title :useView="useView" icon="<i class='fa fa-users-cog'></i>"></view-title>
    <two-column-grid :id="getViewName()">
      <template #viewLeft>
        <work-list ref="workListRef" @click="onRoleTreeClick"></work-list>
      </template>

      <template #viewContent>
        <main-content
          :useView="useView"
          :selectedRole="state.selectedRole"
          @reloadWorkList="onReloadWorkList"
        ></main-content>
      </template>
    </two-column-grid>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import MainContent from './main/index.vue';
import WorkList from './work-list/index.vue';
import UseView from '@/assets/js/composition/use-view';

export default {
  components: {
    MainContent,
    WorkList
  },
  setup(props: any, context: any) {
    const workListRef = ref(null);

    const useView = UseView.setup();
    const state = reactive({
      selectedRole: {}
    });

    const onRoleTreeClick = (event: any) => {
      if (event.roleId) {
        state.selectedRole = event;
      }
    };

    const onReloadWorkList = () => {
      workListRef.value
        .reloadWorkList()
        .then((_) => {})
        .catch((error: any) => {
          console.error(error);
        });
    };
    return {
      onReloadWorkList,
      ...useView,
      useView,
      workListRef,
      props,
      state,
      onRoleTreeClick
    };
  }
};
</script>

<style lang="scss"></style>
