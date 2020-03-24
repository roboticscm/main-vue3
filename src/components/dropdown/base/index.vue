<template>
  <select
    ref="selectRef"
    class="form-control-dropdown full-width"
    :id="props.id"
    @change="onChange"
    :disabled="props.disabled"
  >
    <option disabled :selected="!props.saveState && props.selectedId === null" :value="-1">Please select one</option>
    <option v-if="props.useAll === true" :value="null" v-html="'--- ' + (COMMON.LABEL.ALL || '#All') + ' ---'"></option>
    <option
      v-for="item in props.data"
      :key="item.id"
      :value="item.id"
      v-html="item.name"
      :selected="item.id == props.selectedId"
    ></option>
  </select>
</template>

<script lang="ts">
import { ref, watch, inject, reactive, computed, onMounted } from 'vue';
import { Role } from '@/types/base/system';
import UseSettings from '@/assets/js/composition/use-settings';

export default {
  props: {
    id: String,
    data: Array,
    saveState: {
      type: Boolean,
      default: false
    },
    selectedId: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: any) {
    const { COMMON } = inject('locale');
    const selectRef = ref(null);
    const useSettings = UseSettings.setup();
    const getSelectedId = () => {
      return selectRef.value.value;
    };

    const getSelectedName = () => {
      let selectedItem = getSelectedItem();
      if (selectedItem) {
        return selectedItem.name;
      } else {
        return null;
      }
    };

    const getSelectedItem = () => {
      const selectedId = getSelectedId();
      const selectedItem = props.data.filter((item: any) => item.id === selectedId);
      if (selectedItem && selectedItem.length > 0) {
        return selectedItem[0];
      } else {
        return null;
      }
    };

    const onChange = (event: any) => {
      useSettings.saveSettings(props.id, ['id'], [event.target.value]);
      // context.emit('change', getSelectedItem());
    };

    return {
      selectRef,
      COMMON,
      props,
      getSelectedId,
      getSelectedName,
      getSelectedItem,
      onChange,
      ...useSettings
    };
  }
};
</script>

<style lang="scss" scoped></style>
