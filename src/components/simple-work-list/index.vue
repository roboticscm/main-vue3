<template>
  <div class="default-border" style="height: calc(100% - 19px);">
    <selectable-table
      ref="selectableTableRef"
      :id="props.id"
      :data="props.data"
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
    data: Array,
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

    //use composition api
    const { viewState } = props.useView;

    // other const
    const columns = ref([...generateColumns(viewState)]);

    // ========================== EVENT HANDLE ===============================

    const onSelection = (event) => {
      emit('selection', event);
    };

    const getData = () => {
      return selectableTableRef.value.getData();
    };

    return {
      props,

      selectableTableRef,
      pageRef,

      columns,
      viewState,

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
