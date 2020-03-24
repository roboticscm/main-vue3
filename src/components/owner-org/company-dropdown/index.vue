<template>
  <dropdown
    ref="dropdownRef"
    id="companyDropdownId"
    :data="state.companies"
    :selectedId="state.selectedId"
    :saveState="saveState"
    :disabled="props.disabled"
  ></dropdown>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import { UrlUtil } from '@/assets/js/url-util';
import UseSettings from '@/assets/js/composition/use-settings';
import { Debug } from '@/assets/js/debug';

export default {
  props: {
    saveState: {
      type: Boolean,
      default: false
    },
    autoLoadData: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: any) {
    const dropdownRef = ref(null);
    const saveState = props.saveState ? true : false;
    const state = reactive({
      selectedId: null,
      companies: []
    });
    const { orgStore } = inject('store');
    const useSettings = UseSettings.setup();
    const loadData = async () => {
      return new Promise((resolve, reject) => {
        orgStore
          .sysGetCompanyList()
          .then((res: any) => {
            if (!saveState && res.length > 0) {
              state.selectedId = res[0].id;
            }

            state.companies = res;
            useSettings.loadSettings('companyDropdownId').then((data: any) => {
              if (props.saveState === 'true' || props.saveState === true) {
                if (data && data.length > 0) {
                  state.selectedId = data[0].value;
                }
                resolve(res);
              }
            });
          })
          .catch((error) => {
            state.companies = [];
            state.selectedId = null;
            Debug.errorSection('Company Dropdown', error);

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

    return {
      loadData,
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
