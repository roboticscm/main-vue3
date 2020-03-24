<template>
  <div class="template-wrapper">
    <view-title :useView="useView"></view-title>
    <progress-bar :loading="viewState.loading"></progress-bar>
    <two-column-grid :id="getViewName()">
      <template #viewLeft>
        <work-list
          ref="workListRef"
          :needLoadWorkList="state.needLoadWorkList"
          :useView="useView"
          @selection="onSelectionWorkList"
          :height="state.height"
        ></work-list>
      </template>

      <template #viewContent>
        <main-content
          ref="mainContentRef"
          @loadWorkList="onLoadWorkList"
          :selectedMenu="state.selectedMenu"
          :useView="useView"
        ></main-content>
      </template>
    </two-column-grid>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted } from 'vue';
import MainContent from './main/index.vue';
import WorkList from './work-list/index.vue';
import UseView from '@/assets/js/composition/use-view';

export default {
  components: {
    MainContent,
    WorkList
  },
  setup(props: any) {
    // ref
    const workListRef = ref(null);
    const mainContentRef = ref(null);

    // use composition api
    const useView = UseView.setup();

    // reactive
    const state = reactive({
      selectedMenu: null,
      needLoadWorkList: null,
      height: ''
    });

    // start init
    useView.viewState.menuPath = 'sys/menu';
    useView.viewState.tableName = 'menu';
    useView.viewState.columns = ['id', 'name', 'path'];
    useView.viewState.orderBy = ['sort', 'name'];
    useView.viewState.trashRestoreColumns = ['name'];
    // end init

    // =======================================EVENT==========================================
    const onLoadWorkList = (event: any) => {
      state.needLoadWorkList = event;
    };

    const onSelectionWorkList = (event: any) => {
      state.selectedMenu = event;
    };

    onMounted(() => {
      const height = $('.template-wrapper').height();
      state.height = `${height - 30}px`;
      onceLoad();
    });

    // =======================================METHOD==========================================
    const onceLoad = () => {
      if (workListRef.value && mainContentRef.value) {
        useView.viewState.loading = true;
        // const workListPromise = workListRef.value.onceLoad();
        const mainContentPromise = mainContentRef.value.onceLoad();
        Promise.all([mainContentPromise]).then((_) => {
          useView.viewState.loading = false;
        });
      }
    };

    return {
      props,
      state,

      useView,
      ...useView,

      workListRef,
      mainContentRef,

      onLoadWorkList,
      onSelectionWorkList
    };
  }
};
</script>

<style lang="scss"></style>
