<template>
  <div class="template-wrapper">
    <view-title :useView="useView" icon="<i class='fa fa-users-cog'></i>"></view-title>

    <two-column-grid :localStorageKey="getViewName()">
      <template #viewLeft>
        <work-list @selectedRow="onSelectedRow" :loadWorkList="state.loadWorkList"></work-list>
      </template>

      <template #viewContent>
        <main-content
          @loadWorkList="onLoadWorkList"
          :selectedUser="state.selectedUser"
          :useView="useView"
        ></main-content>
      </template>
    </two-column-grid>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import MainContent from './main/index.vue';
import WorkList from './work-list/index.vue';
import UseView from '@/assets/js/composition/use-view';

export default {
  components: {
    MainContent,
    WorkList
  },
  setup(props: any) {
    const useView = UseView.setup();
    const state = reactive({
      loadWorkList: null,
      selectedUser: null
    });
    const onLoadWorkList = (event: any) => {
      state.loadWorkList = event;
    };
    const onSelectedRow = (event: any) => {
      state.selectedUser = event;
    };
    return {
      ...useView,
      useView,
      props,
      state,
      onLoadWorkList,
      onSelectedRow
    };
  }
};
</script>

<style lang="scss"></style>
