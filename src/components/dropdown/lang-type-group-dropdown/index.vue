<template>
  <dropdown
    ref="dropdownRef"
    id="langTypeGroupDropdownId"
    :data="state.typeGroups"
    :selectedId="state.selectedId"
    :saveState="saveState"
    :useAll="props.useAll"
    @change="onChange"
  ></dropdown>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import { UrlUtil } from '@/assets/js/url-util';
import UseSettings from '@/assets/js/composition/use-settings';
import { Debug } from '@/assets/js/debug';

export default {
  setup(props: any, context: any) {
    const dropdownRef = ref(null);
    const saveState = props.saveState ? true : false;
    const state = reactive({
      selectedId: null,
      typeGroups: []
    });
    const { localeResourceStore } = inject('store');
    const useSettings = UseSettings.setup();
    const loadData = async () => {
      return new Promise((resolve, reject) => {
        localeResourceStore
          .sysGetUsedLangTypeGroups()
          .then((res: any) => {
            if (!saveState && res.length > 0) {
              state.selectedId = res[0].id;
            }

            state.typeGroups = res;
            useSettings.loadSettings('langTypeGroupDropdownId').then((data: any) => {
              if (props.saveState === 'true' || props.saveState === true) {
                if (data && data.length > 0) {
                  state.selectedId = data[0].value;
                  resolve(res);
                }
              }
            });
          })
          .catch((error) => {
            state.typeGroups = [];
            state.selectedId = null;
            Debug.errorSection('Lang Type Group Dropdown', error);

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
