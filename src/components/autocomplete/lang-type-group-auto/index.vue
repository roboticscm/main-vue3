<template>
  <autocomplete
    ref="autoRef"
    :id="props.id"
    height="50vh"
    :columns="columns"
    :data="state.data"
    @search="onSearch"
    :saveState="props.saveState"
    :disabled="props.disabled"
  ></autocomplete>
</template>

<script lang="ts">
import { ref, reactive, inject } from 'vue';
import { Debug } from '@/assets/js/debug';

export default {
  props: {
    id: {
      type: String,
      default: 'langTypeGroupAutoId'
    },
    saveState: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props: any, context: any) {
    const autoRef = ref(null);

    const { localeResourceStore } = inject('store');
    const { T } = inject('locale');
    const state = reactive({
      data: []
    });

    const columns = [
      {
        name: 'name',
        title: T('SYS.LABEL.TYPE_GROUP')
      }
    ];
    const onSearch = (text: string) => {
      localeResourceStore
        .sysGetUsedLangTypeGroups(text)
        .then((data: any) => {
          state.data = data;
        })
        .catch((error: any) => {
          Debug.errorSection('Lang Type Group Autocomplete', error);
        });
    };

    const getSelectedItem = () => {
      return autoRef.value.getSelectedItem();
    };

    const getSelectedId = () => {
      return autoRef.value.getSelectedId();
    };

    const getSelectedName = () => {
      return autoRef.value.getSelectedName();
    };

    const getInputText = () => {
      return autoRef.value.getInputText();
    };

    const focus = () => {
      autoRef.value.focus();
    };

    const loadSettings = () => {
      return autoRef.value.loadSettings();
    };

    return {
      props,
      autoRef,
      state,
      onSearch,
      columns,
      getSelectedItem,
      getSelectedId,
      getSelectedName,
      getInputText,
      focus,
      loadSettings
    };
  }
};
</script>

<style lang="scss" scoped></style>
