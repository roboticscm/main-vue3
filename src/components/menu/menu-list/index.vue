<template>
  <selectable-table ref="selectableTableRef" :id="props.menuListId" :data="state.filteredMenus" :columns="columns">
    <template #label>
      <div class="label">{{ SYS.LABEL.MENU_LIST || `#Menu List: ` }}:</div>
      <quick-search @search="onSearch" @realtimeSearch="onSearch" :placeholder="SYS.LABEL.SEARCH || '#Search'">
      </quick-search>
    </template>
    <template #selectAllButton="{onSelectAll}"> </template>
    <template #unselectAllButton="{onUnselectAll}"> </template>
    <template #toggleSelectionButton="{onToggleSelection}"> </template>
  </selectable-table>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import { Debug } from '@/assets/js/debug';
import { markStringSearch } from '@/assets/js/util';
import { SObject } from '@/assets/js/sobject';
const JSONbig = require('json-bigint');

export default {
  setup(props: any, context: any) {
    const { SYS, COMMON } = inject('locale');

    const columns = ref([
      { title: SYS.LABEL.NAME || '#Name', name: 'name' },
      { title: SYS.LABEL.PATH || '#Path', name: 'path' }
    ]);

    const selectableTableRef = ref(null);
    const state = reactive({
      menus: [],
      filteredMenus: []
    });

    const { menuStore } = inject('store');

    const doLoad = async (sortByCreatedDate: boolean) => {
      return new Promise((resolve, reject) => {
        menuStore
          .sysGetAllMenuList(sortByCreatedDate)
          .then((res: any) => {
            state.menus = res.map((item: any) => {
              item.name = COMMON.MENU[item.name] || `#${item.name}`;
              return item;
            })
              ? res
              : [];
            state.filteredMenus = SObject.clone(state.menus);
            resolve(state.menus);
          })
          .catch((error: any) => {
            Debug.errorSection('Menu List', error);
            return Promise.reject('Error');
          });
      });
    };

    const getData = () => {
      return selectableTableRef.value.getData();
    };

    const onSearch = (textSearch: string) => {
      state.filteredMenus = SObject.clone(state.menus);
      if (textSearch.trim().length > 0) {
        state.filteredMenus = state.filteredMenus.filter((item: any) => {
          const markedName = markStringSearch(item.name, textSearch, true);
          const markedPath = markStringSearch(item.path, textSearch, true);
          if (markedName === item.name && markedPath === item.path) {
            return false;
          } else {
            if (markedName !== item.name) {
              item.name = markedName;
            }
            if (markedPath !== item.path) {
              item.path = markedPath;
            }
            return true;
          }
        });
      }
    };

    const getSelectedData = () => {
      return selectableTableRef.value.getSelectedData();
    };

    const unSelectAll = () => {
      selectableTableRef.value.unSelectAll();
    };

    if (props.autoLoadData === true) {
      doLoad(false);
    }

    return {
      unSelectAll,
      getSelectedData,
      onSearch,
      props,
      doLoad,
      state,
      columns,
      selectableTableRef,
      getData,
      SYS
    };
  }
};
</script>

<style lang="scss">
.search-text-field {
  white-space: nowrap;
}
</style>
