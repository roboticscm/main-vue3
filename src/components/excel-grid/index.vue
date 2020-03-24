<template>
  <div>
    <div>
      <slot name="label"></slot>
    </div>
    <div>
      <div ref="divRef" style="width: 100%; height: 100%;" :id="props.id"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref, computed, onMounted, inject, onUnmounted, reactive } from 'vue';
import jexcel from 'jexcel';
import { Settings } from '@/types/base/system';
import { UrlUtil } from '@/assets/js/url-util';
import { Debug } from '@/assets/js/debug';

export default {
  setup(props: any, context: any) {
    const divRef = ref(null);

    const state = reactive({
      containerWidth: null
    });
    let jExcelObj: any;
    let startTime = Date.now();
    const { settingsStore } = inject('store');

    const onWindowResize = (event) => {
      // const containerWidth = event.target.innerWidth;
      let now = Date.now();
      if (now - startTime > 100) {
        startTime = now;
      } else {
        return;
      }

      if (!jExcelObj) {
        return;
      }
      recalculateColumnWidth();
      props.columns.map((col: any, index: number) => {
        if (col.type !== 'hidden') {
          jExcelObj.setWidth(index, Number(col.width));
        }
      });
    };
    onMounted(() => {
      window.addEventListener('resize', onWindowResize);
    });
    const onChanged = (instance: any, cell: any, x: any, y: any, value: any) => {
      context.emit('changed', { x, y, value });
    };

    // TODO: param not test
    const onBeforeChange = (instance: any, cell: any, x: any, y: any, value: any) => {
      context.emit('beforeChange', { x, y, value });
    };

    const recalculateColumnWidth = () => {
      const containerWidth = $(divRef.value).width();

      const colIndexWidth = 60;
      if (containerWidth <= colIndexWidth) {
        return;
      }
      if (props.fullWidth === true) {
        const beforeWidthSum = props.columns
          .map((it: any) => (it.type === 'hidden' ? 0 : it.width ? Number(it.width) : 0))
          .reduce((w1: number, w2: number) => {
            return w1 + w2;
          }, 0);

        const ratio = (containerWidth - colIndexWidth) / beforeWidthSum;
        props.columns.map((col: any) => {
          if (col.type !== 'hidden') {
            col.width = Math.round(ratio * col.width);
          }

          return col;
        });
      }
    };

    const onMouseUp = () => {};

    watch(
      () => props.containerWidth,
      (width: any) => {
        let now = Date.now();
        if (now - startTime > 100) {
          startTime = now;
        } else {
          return;
        }

        if (props.fullWidth !== true || !jExcelObj) return;
        if (width) {
          recalculateColumnWidth();
          props.columns.map((col: any, index: number) => {
            if (col.type !== 'hidden') {
              jExcelObj.setWidth(index, Number(col.width));
            }
          });
        }
      }
    );
    watch(
      () => props.data,
      (data: any) => {
        createGrid(data);
      }
    );

    const selectAll = () => {};

    const unselectAll = () => {};

    const toggleSelection = () => {};
    const getGridInstance = () => {
      return jExcelObj;
    };

    const getData = () => {
      return jExcelObj.getJson();
    };

    const saveSettings = (col: number, width: number) => {
      let obj = new Settings();
      obj.menuPath = UrlUtil.getMenuPathFromUrl();
      obj.controlId = props.id;
      obj.keys = [col + ''];
      obj.values = [width + ''];

      settingsStore.saveOrUpdate(obj);
    };

    const loadSettings = () => {
      settingsStore
        .getUserSettings(UrlUtil.getMenuPathFromUrl(), props.id)
        .then((data) => {
          if (data) {
            data.map((item: any) => {
              let column = Number(item.key);
              let value = Number(item.value);
              if (jExcelObj) {
                if (props.fullWidth === true) {
                  if (props.columns.length > column) {
                    props.columns[column].width = value;
                  }
                } else {
                  jExcelObj.setWidth(column, value);
                }
              }
            });

            if (props.fullWidth === true) {
              recalculateColumnWidth();
              props.columns.map((col: any, index: number) => {
                jExcelObj.setWidth(index, col.width);
              });
            }
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize);

      const ele = document.getElementById(props.id);
      if (ele) {
        jexcel.destroy(ele, true);
      }
    });

    const createGrid = (data: any) => {
      if (!jExcelObj) {
        if (!props.id) {
          Debug.errorSection('Excel Grid', "Maybe you didn't set Id for this Grid");
          return;
        }
        if (!props.columns || props.columns.length === 0) {
          return;
        }

        recalculateColumnWidth();
        jExcelObj = jexcel(document.getElementById(props.id), {
          data: data,
          // editable: !props.disabled,
          columns: props.columns,
          updateTable: onUpdateTable,
          onchange: onChanged,
          onbeforechange: onBeforeChange,
          onbeforedeleterow: onBeforeDeleteRow,
          onload: () => {
            context.emit('load');
          },
          onselection: onSelection,
          tableOverflow: true,
          tableWidth: '100%',
          tableHeight: props.height ? props.height : '70vh',
          mergeCells: props.gridMergeCells ? props.gridMergeCells : {},
          nestedHeaders: props.gridNestedHeaders,
          allowInsertRow: true,
          columnDrag: true,
          rowDrag: true,
          // contextMenu: function() {
          //   return false;
          // },
          onresizecolumn: (instance: any, col: number, width: number) => {
            recalculateColumnWidth();
            saveSettings(col, props.columns[col].width);
          }
        });
        jExcelObj.resetSelection(true);
        loadSettings();
      } else {
        jExcelObj.destroyMerged();
        jExcelObj.setData(data);
        for (let prop in props.gridMergeCells) {
          jExcelObj.setMerge(prop, props.gridMergeCells[prop][0], props.gridMergeCells[prop][1]);
        }
      }
    };

    onMounted(() => {
      createGrid(props.data);
    });

    const onBeforeDeleteRow = (event) => {
      context.emit('beforeDeleteRow', event);
      return true;
    };

    const onUpdateTable = (el, cell, x, y, source, value, id) => {
      context.emit('updateTable', {
        el,
        cell,
        x,
        y,
        source,
        value,
        id
      });
    };

    const onSelection = (element, x, y) => {
      context.emit('selection', { x, y });
    };
    return {
      props,
      state,
      divRef,
      selectAll,
      unselectAll,
      toggleSelection,
      getGridInstance,
      getData,
      saveSettings,
      loadSettings,
      onChanged,
      onBeforeChange,
      onBeforeDeleteRow,
      onMouseUp,
      onUpdateTable,
      onSelection
    };
  }
};
</script>

<style lang="scss"></style>
