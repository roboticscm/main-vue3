<template>
  <excel-grid
    ref="excelGridRef"
    id="roleControlGridId"
    :gridNestedHeaders="nestedHeaders"
    :columns="columns"
    :data="state.roleControls"
    :gridMergeCells="state.mergeCells"
  >
    <template #label
      ><span class="label"
        >{{ SYS.LABEL.MENU || `SYS.LABEL.MENU` }} - {{ SYS.LABEL.ROLE_CONTROL || `SYS.LABEL.ROLE_CONTROL` }}:</span
      ></template
    >
  </excel-grid>
</template>

<script lang="ts">
import { ref, watch, inject, reactive, computed, onMounted } from 'vue';
import { Role } from '@/types/base/system';

export default {
  setup(props: any, context: any) {
    const { roleStore } = inject('store');
    const { SYS, COMMON } = inject('locale');
    const columns = [
      {
        type: 'hidden',
        name: 'branchId'
      },
      {
        type: 'text',
        name: 'branchName',
        title: COMMON.LABEL.BRANCH || '#Branch',
        width: 150,
        readOnly: true
      },
      {
        type: 'hidden',
        name: 'departmentId'
      },
      {
        type: 'text',
        name: 'departmentName',
        title: COMMON.LABEL.DEPARTMENT || '#Department',
        width: 150,
        readOnly: true
      },
      {
        type: 'checkbox',
        title: '[x]',
        name: 'checked',
        width: 40
      },
      {
        type: 'hidden',
        name: 'menuId'
      },
      {
        type: 'text',
        name: 'menuName',
        title: COMMON.LABEL.MENU || '#Menu',
        width: 150,
        readOnly: true
      },
      {
        type: 'checkbox',
        name: 'isPrivate',
        title: SYS.LABEL.PRIVATE || '#Private',
        width: 70
      },
      {
        type: 'dropdown',
        title: SYS.LABEL.DATA_LEVEL || '#Data Level',
        name: 'dataLevel',
        width: 120,
        source: [
          { id: 0, name: 'Default' },
          { id: 10, name: 'Group' },
          { id: 100, name: 'Department' },
          { id: 1000, name: 'Branch' },
          { id: 10000, name: 'Company' }
        ]
      },
      {
        type: 'checkbox',
        name: 'approve',
        title: SYS.LABEL.APPROVE || '#Approve',
        width: 70
      },
      {
        type: 'hidden',
        name: 'controlId'
      },
      {
        type: 'text',
        name: 'controlName',
        title: COMMON.LABEL.CONTROL || '#Control',
        width: 150,
        readOnly: true
      },
      {
        type: 'checkbox',
        name: 'renderControl',
        title: SYS.LABEL.RENDER || '#Render',
        width: 70
      },

      {
        type: 'checkbox',
        name: 'disableControl',
        title: SYS.LABEL.DISABLED || '#Disable',
        width: 70
      },
      {
        type: 'checkbox',
        name: 'confirm',
        title: SYS.LABEL.CONFIRM || '#Confirm',
        width: 70
      },
      {
        type: 'checkbox',
        name: 'requirePassword',
        title: SYS.LABEL.REQUIRE_PASSWORD || '#Require Pass',
        width: 70
      }
    ];

    const nestedHeaders = [
      [
        {
          title: SYS.LABEL.COMPANY_BRANCH || 'SYS.LABEL.COMPANY_BRANCH',
          colspan: 2
        },
        {
          title: SYS.LABEL.MENU_SCREEN || 'SYS.LABEL.MENU_SCREEN',
          colspan: 5
        },
        {
          title: SYS.LABEL.ROLE_CONTROL || 'SYS.LABEL.ROLE_CONTROL',
          colspan: 5
        }
      ]
    ];

    const excelGridRef = ref(null);
    const state = reactive({
      roleControls: [],
      beforeRenderControls: [],
      mergeCells: {}
    });

    const loadData = async (ownerOrgId: any, roleId: any) => {
      try {
        let res = await roleStore.sysGetMenuRoleControlList(ownerOrgId, roleId);
        state.roleControls = res ? res : [];

        // get render control is null
        let nullRows = [];

        if (state.roleControls) {
          for (let i = 0; i < state.roleControls.length; i++) {
            state.beforeRenderControls[i] = state.roleControls[i].renderControl;
            if (state.roleControls[i].renderControl === null) {
              state.roleControls[i].renderControl = true;
              nullRows.push('M' + (i + 1));
            }
          }
        }

        state.mergeCells = makeMergeCells(state.roleControls);
        setTimeout(() => {
          nullRows.map((item: any) => {
            excelGridRef.value.getGridInstance().setStyle(item, 'background-color', 'yellow');
          });
        }, 500);
        return Promise.resolve('OK');
      } catch (error) {
        state.roleControls = [];
        state.mergeCells = {};
        return Promise.reject('Error');
      }
    };

    const makeMergeCells = (data: any) => {
      let branchStartIndex = 0;
      let branchEndIndex = 0;
      let prevBranchId: any = null;
      let branchMerges = {};

      let departmentStartIndex = 0;
      let departmentEndIndex = 0;
      let prevDepartmentId: any = null;
      let departmentMerges = {};

      let menuStartIndex = 0;
      let menuEndIndex = 0;
      let prevMenuId: any = null;
      let menuMerges = {};

      for (let i = 0; i < data.length; i++) {
        // branch
        if (prevBranchId === null) {
          prevBranchId = data[i].branchId;
        }
        if (i < data.length - 1 && prevBranchId.toString() !== data[i].branchId.toString()) {
          branchEndIndex = i;
          let rowsSpan = branchEndIndex - branchStartIndex;

          Object.assign(branchMerges, { ['B' + (branchStartIndex + 1)]: [1, rowsSpan] });
          branchStartIndex = i;
          prevBranchId = data[i].branchId;
        } else if (i === data.length - 1) {
          branchEndIndex = i;
          let rowsSpan: number;
          if (prevBranchId.toString() !== data[i].branchId.toString()) {
            rowsSpan = branchEndIndex - branchStartIndex;
          } else {
            rowsSpan = branchEndIndex - branchStartIndex + 1;
          }
          Object.assign(branchMerges, { ['B' + (branchStartIndex + 1)]: [1, rowsSpan] });
        }

        // department
        if (prevDepartmentId === null) {
          prevDepartmentId = data[i].departmentId;
        }
        if (i < data.length - 1 && prevDepartmentId.toString() !== data[i].departmentId.toString()) {
          departmentEndIndex = i;
          let rowsSpan = departmentEndIndex - departmentStartIndex;
          if (rowsSpan > 1) {
            Object.assign(departmentMerges, { ['D' + (departmentStartIndex + 1)]: [1, rowsSpan] });
          }
          departmentStartIndex = i;
          prevDepartmentId = data[i].departmentId;
        } else if (i === data.length - 1) {
          departmentEndIndex = i;
          let rowsSpan: number;
          if (prevDepartmentId.toString() !== data[i].departmentId.toString()) {
            rowsSpan = departmentEndIndex - departmentStartIndex;
          } else {
            rowsSpan = departmentEndIndex - departmentStartIndex + 1;
          }
          if (rowsSpan > 1) {
            Object.assign(departmentMerges, { ['D' + (departmentStartIndex + 1)]: [1, rowsSpan] });
          }
        }

        // menu
        if (prevMenuId === null) {
          prevMenuId = data[i].menuId;
        }
        if (i < data.length - 1 && prevMenuId.toString() !== data[i].menuId.toString()) {
          menuEndIndex = i;
          let rowsSpan = menuEndIndex - menuStartIndex;
          if (rowsSpan > 1) {
            Object.assign(menuMerges, { ['E' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['G' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['H' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['I' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['J' + (menuStartIndex + 1)]: [1, rowsSpan] });
          }
          menuStartIndex = i;
          prevMenuId = data[i].menuId;
        } else if (i === data.length - 1) {
          menuEndIndex = i;
          let rowsSpan: number;
          if (prevMenuId.toString() !== data[i].menuId.toString()) {
            rowsSpan = menuEndIndex - menuStartIndex;
          } else {
            rowsSpan = menuEndIndex - menuStartIndex + 1;
          }
          if (rowsSpan > 1) {
            Object.assign(menuMerges, { ['E' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['G' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['H' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['I' + (menuStartIndex + 1)]: [1, rowsSpan] });
            Object.assign(menuMerges, { ['J' + (menuStartIndex + 1)]: [1, rowsSpan] });
          }
        }
      }

      return {
        ...branchMerges,
        ...departmentMerges,
        ...menuMerges
      };
    };

    onMounted(() => {
      const gridInstance = excelGridRef.value && excelGridRef.value.getGridInstance();
      if (gridInstance) {
        gridInstance.hideIndex();
      }
    });

    const preProcessData = (data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (i > 0 && data[i].menuId === data[i - 1].menuId) {
          data[i].checked = data[i - 1].checked;
        }
      }
      return data;
    };

    const getData = () => {
      let data = excelGridRef.value.getData();
      return preProcessData(data);
    };

    const getBeforeRenderControl = () => {
      return state.beforeRenderControls;
    };

    return {
      loadData,
      getBeforeRenderControl,
      state,
      columns,
      nestedHeaders,
      excelGridRef,
      getData,
      SYS,
      COMMON
    };
  }
};
</script>

<style lang="scss" scoped></style>
