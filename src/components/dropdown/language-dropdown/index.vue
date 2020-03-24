<template>
  <dropdown ref="dropdownRef" id="langDropdownId" :data="state.langs" :selectedId="state.selectedId"></dropdown>
</template>

<script lang="ts">
import { ref, inject, reactive } from 'vue';
import LoginInfo from '@/assets/js/login-info';

export default {
  setup(props: any, context: any) {
    const dropdownRef = ref(null);
    const state = reactive({
      selectedId: LoginInfo.lang,
      langs: []
    });
    const { localeResourceStore } = inject('store');

    const loadData = async () => {
      try {
        let res = await localeResourceStore.sysGetUsedLanguages();
        state.langs = res ? res : [];
        return Promise.resolve('OK');
      } catch (error) {
        state.langs = [];
        console.error(error);
        return Promise.reject('Error');
      }
    };

    loadData();

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
      state,
      getSelectedId,
      dropdownRef,
      getSelectedName,
      getSelectedItem
    };
  }
};
</script>

<style lang="scss" scoped></style>
