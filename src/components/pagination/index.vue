<template>
  <span v-if="props.totalRecords > 0" class="pagination" style="white-space: nowrap;">
    <span v-if="totalPages > 1" style="white-space: nowrap">
      <c>----------first button----------</c>
      <button
        v-if="props.showFirstLastButton && (firstStatus || props.showDisabledButton)"
        :disabled="!firstStatus"
        @click="jumpToPage(1)"
        :class="{ 'btn-small-info': props.smallSize, 'btn-info': !props.smallSize }"
      >
        ⇤
      </button>
      <c>----------prev button----------</c>
      <button
        v-if="prevStatus || props.showDisabledButton"
        :disabled="!prevStatus"
        @click="jumpToPage(state.currentPage - 1)"
        :class="{ 'btn-small-success': props.smallSize, 'btn-success': !props.smallSize }"
      >
        ←
      </button>
      <c>----------page----------</c>
      <select
        @change="onPageChange"
        :class="{ 'small-control-dropdown': props.smallSize, 'control-dropdown': !props.smallSize }"
      >
        <option disabled>{{ T('SYS.LABEL.RECORDS') }}</option>
        <option v-for="page in getPages" :key="page.id" :selected="page.id === state.currentPage" :value="page.id">{{
          page.value
        }}</option>
      </select>

      <c>----------next button----------</c>
      <button
        v-if="nextStatus || props.showDisabledButton"
        :disabled="!nextStatus"
        @click="jumpToPage(state.currentPage + 1)"
        :class="{ 'btn-small-success': props.smallSize, 'btn-success': !props.smallSize }"
      >
        →
      </button>
      <c>----------last button----------</c>
      <button
        v-if="props.showFirstLastButton && (lastStatus || props.showDisabledButton)"
        :disabled="!lastStatus"
        @click="jumpToPage(totalPages)"
        :class="{ 'btn-small-info': props.smallSize, 'btn-info': !props.smallSize }"
      >
        ⇥
      </button>
    </span>
    <select
      @change="onPageSizeChange"
      v-model="state.pageSize"
      :class="{ 'small-control-dropdown': props.smallSize, 'control-dropdown': !props.smallSize }"
    >
      <option disabled>{{ T('SYS.LABEL.SIZE') }}</option>
      <option v-for="size in sizes" :value="size" :key="size">{{ size !== -1 ? size : T('SYS.LABEL.ALL') }}</option>
    </select>
    {{ '#' + props.totalRecords }}
    <c>-------------Default slot--------------------</c>
    <slot></slot>
    <c>-------------//Default slot--------------------</c>
  </span>
</template>

<script lang="ts">
import { computed, inject, reactive } from 'vue';
import UseSettings from '@/assets/js/composition/use-settings';

export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    totalRecords: Number,
    isBusyUpdateSort: Boolean,
    smallSize: {
      type: Boolean,
      default: false
    },
    autoLoad: {
      type: Boolean,
      default: false
    },
    showDisabledButton: {
      type: Boolean,
      default: true
    },
    showFirstLastButton: {
      type: Boolean,
      default: true
    }
  },
  setup(props: any, { emit }) {
    const { T } = inject('locale');
    const useSettings = UseSettings.setup();
    const sizes = [3, 10, 20, 50, 100, 500, 1000, -1];
    const state = reactive({
      pageSize: sizes[0],
      currentPage: props.currentPage
    });
    const totalPages = computed(() => {
      return Math.ceil(props.totalRecords / state.pageSize);
    });

    const prevStatus = computed(() => totalPages.value > 1 && state.currentPage > 1);
    const firstStatus = computed(() => state.currentPage > 2);
    const nextStatus = computed(() => totalPages.value > 1 && state.currentPage < totalPages.value);
    const lastStatus = computed(() => state.currentPage < totalPages.value - 1);

    const getPages = computed(() => {
      const pageSize = state.pageSize;
      const rows = [];
      for (let i = 0; i < totalPages.value - 1; i++) {
        rows.push({
          id: i + 1,
          value: `${i * pageSize + 1} - ${(i + 1) * pageSize}`
        });
      }

      const i = totalPages.value - 1;

      rows.push({
        id: i + 1,
        value: `${i * pageSize + 1} - ${i * pageSize +
          (props.totalRecords % state.pageSize === 0 ? state.pageSize : props.totalRecords % state.pageSize)}`
      });
      return rows;
    });

    const loadSettings = () => {
      return new Promise((resolve, reject) => {
        useSettings
          .loadSettings('pageSizeSelectId')
          .then((res: any) => {
            const filter = res.filter((it) => it.key === 'lastPageSize');
            if (filter.length > 0) {
              const value = filter[0].value;
              state.pageSize = Number(value);
              emit('init', state.pageSize);
            }
            resolve('ok');
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    if (props.autoLoad === true) {
      loadSettings();
    }

    const onPageSizeChange = (event) => {
      const value = event.currentTarget.value;
      useSettings.saveSettings('pageSizeSelectId', ['lastPageSize'], [`${value}`]);
      state.pageSize = Number(value);
      requireLoadPage();
    };

    const requireLoadPage = () => {
      emit('loadPage', {
        page: state.currentPage,
        pageSize: state.pageSize
      });
    };

    const onPageChange = (event) => {
      const value = event.currentTarget.value;
      state.currentPage = Number(value);
      requireLoadPage();
    };

    const jumpToPage = (page: number) => {
      if (page < 1) {
        page = 1;
      } else if (page > totalPages.value) {
        page = totalPages.value;
      }
      state.currentPage = page;
      requireLoadPage();
    };
    return {
      props,
      state,
      emit,
      totalPages,
      prevStatus,
      firstStatus,
      nextStatus,
      lastStatus,
      getPages,
      sizes,
      T,
      onPageSizeChange,
      onPageChange,
      jumpToPage,
      requireLoadPage,
      loadSettings
    };
  }
};
</script>

<style lang="scss">
.pagination {
  & button {
    margin-left: 0;
    outline: none;
  }

  & select {
    outline: none;
  }
}
</style>
