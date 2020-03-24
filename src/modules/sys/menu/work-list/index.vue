<template>
  <div class="template-wrapper">
    <div id="workListContainer" class="view-left-main">
      <suspense>
        <template #default>
          <simple-list
            ref="simpleListRef"
            id="menuListId"
            :useView="props.useView"
            @selection="onSelection"
            :height="state.height"
            :label="T('SYS.LABEL.MENU_LIST')"
          ></simple-list>
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </suspense>
    </div>
    <div class="view-left-bottom"></div>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted, reactive, inject } from 'vue';

export default {
  setup(props: any, context: any) {
    const simpleListRef = ref(null);

    const { T } = inject('locale');
    const state = reactive({
      height: ''
    });

    const getData = () => {
      return simpleListRef.value.getData();
    };

    const onSelection = (event) => {
      context.emit('selection', event);
    };

    watch(
      () => props.needLoadWorkList,
      (event: any) => {
        if (event) {
          simpleListRef.value.reload(event.sortByCreatedDate);
        }
      }
    );

    const onceLoad = () => {
      if (simpleListRef.value) {
        return simpleListRef.value.onceLoad();
      }
    };

    onMounted(async () => {
      const height = $('#workListContainer').height();
      state.height = `${height - 30 * 3.2}px`;
    });

    return {
      props,
      state,
      simpleListRef,
      onceLoad,
      getData,
      onSelection,
      T
    };
  }
};
</script>

<style lang="scss"></style>
