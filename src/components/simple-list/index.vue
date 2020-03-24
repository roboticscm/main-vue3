<template>
  <div style="height: calc(100% - 15px);">
    <div class="default-border" style="height: 100%;">
      <selectable-table
        ref="selectableTableRef"
        :id="props.id"
        :data="state.data"
        :columns="columns"
        :height="props.height"
        :fixedHeader="true"
        @selection="onSelection"
      >
        <template #label>
          <div class="label">{{ props.label }}:</div>
          <quick-search @search="onSearch" @realtimeSearch="onSearch" :placeholder="T('SYS.LABEL.SEARCH')">
          </quick-search>
        </template>
      </selectable-table>
    </div>

    <pagination
      ref="pageRef"
      @init="onPaginationInit"
      @loadPage="onLoadPage"
      :totalRecords="viewState.totalRecords"
      :smallSize="true"
      :autoLoad="false"
      :showFirstLastButton="false"
    >
    </pagination>
  </div>
</template>

<script lang="ts">
import { ref, inject, reactive, onMounted } from 'vue';
import { Debug } from '@/assets/js/debug';
import { markStringSearch } from '@/assets/js/util';
import { SObject } from '@/assets/js/sobject';
const JSONbig = require('json-bigint');
import { generateColumns } from './helper';

export default {
  props: {
    id: String,
    useView: Object,
    height: String,
    label: String
  },
  async setup(props: any, { emit }) {
    // ref
    const selectableTableRef = ref(null);
    const pageRef = ref(null);

    // inject & store
    const { T } = inject('locale');
    const { tableUtilStore } = inject('store');

    //use composition api
    const { viewState } = props.useView;

    // other const
    const columns = ref([...generateColumns(viewState)]);

    // reactive
    const state = reactive({
      data: []
    });

    // ========================== EVENT HANDLE ===============================
    const onLoadPage = (event) => {
      viewState.pageSize = event.pageSize;
      viewState.page = event.page;
      reload();
    };

    const onPaginationInit = (event) => {
      viewState.pageSize = event;
    };

    const onSelection = (event) => {
      emit('selection', event);
    };

    onMounted(() => {
      onceLoad();
    });
    // ========================== METHOD ===============================

    // load once at the first time
    const onceLoad = () => {
      return new Promise((resolve, reject) => {
        pageRef.value
          .loadSettings()
          .then((_) => {
            reload()
              .then((_) => {
                resolve('ok');
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    // reload when data change or user's action
    const reload = (createdSort = false) => {
      return new Promise((resolve, reject) => {
        tableUtilStore
          .getSimpleList(
            viewState.tableName,
            viewState.columns,
            createdSort ? ['created_date desc'] : viewState.orderBy,
            viewState.page,
            viewState.pageSize,
            true,
            false
          )
          .then((res: any) => {
            state.data = res.payload;
            state.data.map((it, index) => (it.no = index + viewState.pageSize * (viewState.page - 1) + 1));
            viewState.totalRecords = res.fullCount;
            if (selectableTableRef.value) {
              selectableTableRef.value.unSelectAll();
            }
            resolve('OK');
          })
          .catch((error: any) => {
            Debug.errorSection('Menu List', error);
            reject(error);
          });
      });
    };

    const getData = () => {
      return selectableTableRef.value.getData();
    };

    return {
      props,
      state,

      selectableTableRef,
      pageRef,

      columns,
      viewState,

      onceLoad,
      reload,
      onLoadPage,
      onPaginationInit,
      onSelection,

      getData,
      T
    };
  }
};
</script>

<style lang="scss">
.search-text-field {
  white-space: nowrap;
}
</style>
