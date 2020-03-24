<template>
  <dropdown
    ref="dropdownRef"
    id="langCategoryDropdownId"
    :data="state.categories"
    :selectedId="state.selectedId"
    :saveState="saveState"
    :useAll="props.useAll"
    @change="onChange"
  ></dropdown>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import { UrlUtil } from '@/assets/js/url-util';
import { Debug } from '@/assets/js/debug';
import UseSettings from '@/assets/js/composition/use-settings';

export default {
  setup(props: any, context: any) {
    const dropdownRef = ref(null);
    const saveState = props.saveState ? true : false;
    const state = reactive({
      selectedId: null,
      categories: []
    });
    const { localeResourceStore } = inject('store');
    const useSettings = UseSettings.setup();
    const loadData = async () => {
      return new Promise((resolve, reject) => {
        localeResourceStore
          .sysGetUsedLangCategories()
          .then((res: any) => {
            if (!saveState && res.length > 0) {
              state.selectedId = res[0].id;
            }

            state.categories = res;
            useSettings.loadSettings('langCategoryDropdownId').then((data: any) => {
              if (props.saveState === 'true' || props.saveState === true) {
                if (data && data.length > 0) {
                  state.selectedId = data[0].value;
                  resolve(res);
                }
              }
            });
          })
          .catch((error) => {
            state.categories = [];
            state.selectedId = null;
            Debug.errorSection('Lang Category Dropdown', error);

            reject(error);
          });
      });
    };

    if (props.autoLoadData === true) {
      loadData();
    }

    const getSelectedId = () => {
      return dropdownRef.value.getSelectedId();
    };
    const getSelectedName = () => {
      return dropdownRef.value.getSelectedName();
    };
    const getSelectedItem = () => {
      return dropdownRef.value.getSelectedItem();
    };

    const onChange = (event) => {
      context.emit('change', event);
    };

    return {
      loadData,
      onChange,
      props,
      state,
      getSelectedId,
      dropdownRef,
      getSelectedName,
      getSelectedItem,
      saveState
    };
  }
};
</script>

<style lang="scss" scoped></style>
