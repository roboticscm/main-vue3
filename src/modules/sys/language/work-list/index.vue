<template>
  <div class="template-wrapper">
    <div id="workListContainer" class="view-left-main">
      <suspense>
        <template #default>
          <simple-work-list
            :data="state.data"
            id="languageWorkListId"
            :useView="props.useView"
            :height="state.height"
            :label="T('SYS.LABEL.LANGUAGE_LIST')"
            @selection="onSelection"
          ></simple-work-list
        ></template>
      </suspense>
      <div style="margin-top: 1px;">
        <pagination
          ref="pageRef"
          @init="onPaginationInit"
          @loadPage="onLoadPage"
          :totalRecords="viewState.totalRecords"
          :smallSize="true"
          :autoLoad="true"
          :showFirstLastButton="false"
        >
        </pagination>
      </div>
    </div>
    <div class="view-left-bottom"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, onUnmounted } from 'vue';
import { Language } from '@/modules/sys/language/model';
import { languageStore } from '@/modules/sys/language/store';
import { T } from '@/assets/js/locale/locale';
import { ViewState } from '@/types/base/system';
import { Subscription } from 'rxjs';

export default {
  setup: (props: any, context: any) => {
    const { viewState } = props.useView;
    let subscription: Subscription = null;

    // ===================================REACTIVE=====================================
    const state = reactive<{ height: string; data: Language[] }>({
      height: '',
      data: []
    });

    // ===================================HOOK=====================================
    onMounted(async () => {
      const height = $('#workListContainer').height();
      state.height = `${height - 30 * 4.3}px`;
    });

    // ===================================PRIVATE METHOD=====================================
    const reload = () => {
      viewState.loading = true;
      languageStore.fetchAll(viewState);
    };

    const onceLoad = () => {
      reload();
    };

    // ===================================EVENT HANDLE=====================================
    const onSelection = (event: Language[]) => {
      viewState.loading = true;
      languageStore.fetchOne(viewState, event[0].id);
    };

    const onLoadPage = (event) => {
      viewState.pageSize = event.pageSize;
      viewState.page = event.page;
      reload();
    };

    const onPaginationInit = (event) => {
      viewState.pageSize = event;
      onceLoad();
    };

    onUnmounted(() => {
      if (subscription !== null) {
        console.log('onUnmounted');
        subscription.unsubscribe();
      }
    });
    // ===================================SUBSCRIBE=====================================
    const subscribe = () => {
      subscription = languageStore.itemsList$.subscribe(
        (data) => {
          state.data = data;
          console.log('itemsList$');
        },
        (error) => {
          console.log('error with ', error);
        }
      );
    };
    subscribe();

    return {
      props,
      state,
      onSelection,
      onLoadPage,
      onPaginationInit,
      T,
      viewState
    };
  }
};
</script>

<style lang="scss"></style>
