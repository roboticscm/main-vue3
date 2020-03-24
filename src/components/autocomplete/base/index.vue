<template>
  <div class="auto-dropdown-wrapper" :id="props.id">
    <progress-bar :loading="state.searching" fontSize="1rem"></progress-bar>
    <input
      ref="inputRef"
      @click.stop="onSearch"
      @keyup="onSearch"
      autocomplete="off"
      type="text"
      class="form-control"
      :id="'dropdownInput' + props.id"
      v-model="state.textSearch"
      :disabled="props.disabled"
    />
    <div :style="tableStyle" class="auto-dropdown" :id="'dropdown' + props.id">
      <selectable-table
        ref="selectableTableRef"
        :id="'table' + props.id"
        :data="state.mapData"
        :columns="props.columns"
        :showHeader="false"
        :fixedHeader="true"
        height="50vh"
        @click="onTableClick"
        @keyup="onTableKeyup"
      ></selectable-table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { SObject } from '@/assets/js/sobject';
import { markStringSearch } from '@/assets/js/util';
import LoginInfo from '@/assets/js/login-info';
import UseSettings from '@/assets/js/composition/use-settings';
import { StringUtil } from '@/assets/js/string-util';
import { Debug } from '@/assets/js/debug';

export default {
  props: {
    data: Array,
    columns: Array,
    height: {
      type: String,
      default: '50vh'
    },
    id: {
      type: String,
      required: true
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
    const inputRef = ref(null);
    const selectableTableRef = ref(null);

    let dropdownFocused = false;
    const useSettings = UseSettings.setup();
    const state = reactive({
      textSearch: '',
      selectedItem: null,
      mapData: [],
      searching: false
    });
    let timeoutHandler = null;
    const tableStyle = computed(() => {
      if (props.height) {
        let height = Number(props.height.replace('vh', ''));
        height += 1;
        return `height: ${height}vh;`;
      } else {
        return null;
      }
    });
    const onSearch = (event) => {
      if (state.textSearch.trim().length === 0) {
        state.selectedItem = null;
      }

      if (event.code === 'Enter') {
        return;
      }

      if (!dropdownFocused && event.code === 'ArrowDown') {
        moveFocusToDropdown(event);
        dropdownFocused = true;
        return;
      } else if (event.code === 'ArrowDown') {
        return;
      }

      if (event.code === 'Escape') {
        hideAutoDropdown();
        return;
      }

      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
      }

      timeoutHandler = setTimeout(() => {
        context.emit('search', state.textSearch);
        if (props.saveState === true) {
          useSettings.saveSettings(props.id, ['autoId', 'autoName'], ['', state.textSearch]);
        }
        state.searching = true;
      }, LoginInfo.delayTyping);
    };

    watch(
      () => props.data,
      (data: any) => {
        if (data.length > 0) {
          //highligth text search
          const temp = SObject.clone(data);
          state.mapData = temp.map((item) => {
            const markedName = markStringSearch(item.name, state.textSearch, true);

            item.name = markedName;
            return item;
          });
          showAutoDropdown();
          state.searching = false;
        } else {
          hideAutoDropdown();
          state.searching = false;
        }
      }
    );
    const showAutoDropdown = () => {
      document.querySelector(`#${'dropdown' + props.id}`).classList.add('show-auto-dropdown');
      // selectableTableRef.value.selectRowByIndex(0);
    };

    const hideAutoDropdown = () => {
      dropdownFocused = false;
      document.querySelector(`#${'dropdown' + props.id}`).classList.remove('show-auto-dropdown');
    };

    // move to drop list when user press arror down key
    const moveFocusToDropdown = (event) => {
      // event.preventDefault();
      selectableTableRef.value.focus();
      // selectableTableRef.value.selectRowByIndex(0);
    };

    // close dropdown when it lost focus
    onMounted(() => {
      document.querySelector(`#${props.id}`).addEventListener('focusout', () => {
        const inputEle: any = document.querySelector(`#${'dropdownInput' + props.id}`);

        setTimeout(() => {
          if (document.activeElement !== inputEle) {
            hideAutoDropdown();
          }
        }, 300);
      });
    });

    // load prev settings
    const loadSettings = () => {
      return new Promise((resolve, reject) => {
        if (props.saveState === true) {
          useSettings
            .loadSettings(props.id)
            .then((data: any) => {
              const idFilter = data.filter((it: any) => it.key === 'autoId');

              let id = null;
              if (idFilter.length > 0) {
                id = idFilter[0].value;
              }

              const nameFilter = data.filter((it: any) => it.key === 'autoName');
              let name = null;
              if (nameFilter.length > 0) {
                name = nameFilter[0].value;
                state.textSearch = name;
              }

              state.selectedItem = {
                id,
                name
              };
              resolve('OK');
            })
            .catch((error) => {
              Debug.errorSection('Base AutoComplete', error);
              reject(error);
            });
        }
      });
    };
    const onTableClick = (event) => {
      selectItem(event.data);
      hideAutoDropdown();
    };

    const onTableKeyup = (event) => {
      if (event.event.code === 'Enter') {
        selectItem(event.data);
        hideAutoDropdown();
      }
    };

    const selectItem = (data: any) => {
      if (data.length >= 0) {
        state.textSearch = data[0].name.replace(/<mark>/g, '').replace(/<\/mark>/g, '');

        state.selectedItem = data[0];
        if (props.saveState === true) {
          useSettings.saveSettings(props.id, ['autoId', 'autoName'], [data[0].id, state.textSearch]);
        }
        context.emit('change', data[0].id);
      }
    };

    const getSelectedItem = () => {
      if (
        state.selectedItem !== null &&
        state.textSearch !== StringUtil.replaceAlls(state.selectedItem.name, ['<mark>', '</mark>'], ['', ''])
      ) {
        return null;
      }
      return state.selectedItem;
    };

    const getSelectedId = () => {
      const selectedItem = getSelectedItem();
      return selectedItem ? selectedItem.id : null;
    };

    const getSelectedName = () => {
      if (state.textSearch.trim().length === 0) {
        state.selectedItem = null;
      }
      const selectedItem = getSelectedItem();
      return selectedItem ? selectedItem.name : null;
    };

    const getInputText = () => {
      return state.textSearch;
    };

    const focus = () => {
      inputRef.value.focus();
    };
    return {
      selectableTableRef,
      inputRef,
      getSelectedItem,
      getSelectedId,
      getSelectedName,
      getInputText,
      onTableKeyup,
      onTableClick,
      state,
      props,
      onSearch,
      moveFocusToDropdown,
      tableStyle,
      focus,
      loadSettings
    };
  }
};
</script>

<style lang="scss">
.auto-dropdown-wrapper {
  position: relative;
}
.auto-dropdown {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: $highest-z-index;
  padding: $small-padding;
  border: $default-border;
  background: var(--base-background);
}
.auto-dropdown-item {
  appearance: none;
  font-size: 1rem;
  border-bottom: $default-border;
  margin-bottom: 1px;
  max-height: 30px;
  height: 30px;
  width: 100%;
  padding-top: $default-padding;
}
.show-auto-dropdown {
  display: block;
}
</style>
