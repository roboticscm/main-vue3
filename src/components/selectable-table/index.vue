<template>
  <div>
    <slot name="label"></slot>
    <slot name="selectAllButton" :onSelectAll="selectAll"></slot>
    <slot name="unselectAllButton" :onUnselectAll="unSelectAll"></slot>
    <slot name="toggleSelectionButton" :onToggleSelection="toggleSelection"></slot>

    <table @click.stop="onClick" :id="props.id" class="table " :class="{ 'table-scroll': props.fixedHeader }">
      <thead>
        <tr v-if="props.showHeader">
          <th v-for="col in props.columns" :key="col.name" v-html="col.title"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, rowIndex) in props.data" :key="rowIndex">
          <td
            :id="`cell_${rowIndex}_${colIndex}_${props.id}`"
            v-for="(col, colIndex) in props.columns"
            :key="colIndex"
            v-html="row[col.name]"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { watch, reactive, onMounted } from 'vue';
import './selectable_table.js';
import { SObject } from '@/assets/js/sobject';
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');

export default {
  props: {
    id: {
      type: String,
      require: true
    },
    data: Array,
    columns: Array,
    fixedHeader: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    height: String
  },
  setup(props: any, context: any) {
    let startRow: any = null;
    let selectedRows: number[] = [];
    let cache: any = null;

    const state = reactive({
      data: props.data
    });
    // let startingY = 0;
    const onSelectedRow = () => {
      let selectedRowsData = selectedRows.map((index) => state.data[index]);
      context.emit('selection', selectedRowsData);
    };
    watch(
      () => props.data,
      (data: any) => {
        startRow = null;
        selectedRows = [];

        state.data = SObject.clone(data);

        // reset drag
        const tbody: any = $(`#${props.id} tbody`);
        tbody.sortable('destroy');

        // start drag
        // const tbody: any = $(`#${props.id} tbody`);
        let startIndex;
        tbody.sortable({
          start: (event, ui) => {
            startIndex = ui.item.index();
          },
          change: (event, ui) => {},
          update: (event, ui) => {
            const endIndex = ui.item.index();
            if (startIndex !== endIndex) {
              const tmp = { ...state.data[startIndex] };
              state.data.splice(startIndex, 1);
              state.data.splice(endIndex, 0, tmp);
            }
          }
        });
        // end drag

        ($('#' + props.id) as any).SelectableTable(
          {
            sort: true
          },
          function(obj: any) {
            selectedRows = obj.rows;
            onSelectedRow();

            // register key for navigation
            startRow = document.querySelector(`#cell_${obj.rows[0]}_0_${props.id}`);
            startRow.focus();
            document.onkeydown = (e) => {
              checkKey(e);
            };
          }
        );
      }
    );

    const selectAll = () => {
      ($('#' + props.id) as any).selectAll(true, function(obj: any) {
        selectedRows = obj.rows;
        onSelectedRow();
      });
    };

    const unSelectAll = () => {
      ($('#' + props.id) as any).selectAll(false, function(obj: any) {
        selectedRows = obj.rows;
        onSelectedRow();
      });
    };

    const toggleSelection = () => {
      ($('#' + props.id) as any).toggleSelection(function(obj: any) {
        selectedRows = obj.rows;
        onSelectedRow();
      });
    };

    const findRowById = (id: any) => {
      for (let i = 0; i < state.data.length; i++) {
        if (id === state.data[i].id) {
          return i;
        }
      }

      return -1;
    };

    const selectRowById = (id: any) => {
      const row = findRowById(id);
      if (row >= 0) {
        ($('#' + props.id) as any).selectRow(row, function(obj: any) {
          selectedRows = obj.rows;
          onSelectedRow();
        });
      }
    };

    const getSelectedData = () => {
      return selectedRows.map((index) => state.data[index]);
    };

    function dotheneedful(sibling) {
      if (sibling != null) {
        sibling.focus();
        startRow = sibling;
        let [, row] = sibling.id.split('_');
        row = Number(row);
        ($('#' + props.id) as any).selectRow(row, function(obj: any) {
          selectedRows = obj.rows;
          onSelectedRow();
        });
      }
    }

    function checkKey(e) {
      e = e || window.event;
      if (e.code == 'ArrowUp') {
        let idx = startRow.cellIndex;

        let nextrow = startRow.parentElement.previousElementSibling;
        if (nextrow != null) {
          let sibling = nextrow.cells[idx];
          let [, row] = sibling.id.split('_');
          row = Number(row);

          if (row >= 0) {
            dotheneedful(sibling);
            // startingY += 200;
            // window.scrollTo(0, startingY);
          }
        }
      } else if (e.code == 'ArrowDown') {
        let idx = startRow.cellIndex;
        let nextrow = startRow.parentElement.nextElementSibling;
        if (nextrow != null) {
          let sibling = nextrow.cells[idx];
          dotheneedful(sibling);
          // startingY -= 200;
          // window.scrollTo(0, startingY);
        }
      }
      context.emit('keyup', { event: e, data: getSelectedData() });
    }

    onMounted(() => {
      console.log('mounted');
      const tbodyEle: any = document.querySelector(`#${props.id} tbody`);

      // height should be in vh
      if (props.height) {
        tbodyEle.style.maxHeight = props.height;
      }

      // start drag
      const tbody: any = $(`#${props.id} tbody`);
      let startIndex;
      tbody.sortable({
        start: (event, ui) => {
          startIndex = ui.item.index();
        },
        change: (event, ui) => {},
        update: (event, ui) => {
          const endIndex = ui.item.index();
          if (startIndex !== endIndex) {
            const tmp = { ...state.data[startIndex] };
            state.data.splice(startIndex, 1);
            state.data.splice(endIndex, 0, tmp);
          }
        }
      });
      // end drag
    });

    const focus = () => {
      // register key for navigation
      startRow = document.querySelector(`#cell_0_0_${props.id}`);

      startRow.focus();
      document.onkeydown = (e) => {
        checkKey(e);
      };

      ($('#' + props.id) as any).selectRow(0, function(obj: any) {
        selectedRows = obj.rows;
        onSelectedRow();
      });
    };

    const onClick = (event) => {
      context.emit('click', { event: event, data: getSelectedData() });
    };

    const selectRowByIndex = (rowIndex: number) => {
      ($('#' + props.id) as any).selectRow(rowIndex, function(obj: any) {
        selectedRows = obj.rows;
        onSelectedRow();
      });
    };
    return {
      state,
      props,
      onClick,
      focus,
      onSelectedRow,
      selectAll,
      unSelectAll,
      toggleSelection,
      selectRowById,
      findRowById,
      getSelectedData,
      selectRowByIndex
    };
  }
};
</script>

<style lang="scss"></style>
