import { reactive, ref, inject, watch } from 'vue';

import { Debug } from '@/assets/js/debug';
import Form from '@/assets/js/form/form';
import { validation } from './validation';
import { SObject, getDiffFieldsObject } from '@/assets/js/sobject.js';
import { Menu } from '@/types/base/system';

import AvailableDepartmentForMenuTreeView from '@/components/owner-org/available-department-for-menu-tree-view/index.vue';
import AssignedDepartmentForMenuTreeView from '@/components/owner-org/assigned-department-for-menu-tree-view/index.vue';

import UseView from '@/assets/js/composition/use-view';
// import UseRender from '@/assets/js/composition/use-render';

export default {
  components: {
    AvailableDepartmentForMenuTreeView,
    AssignedDepartmentForMenuTreeView
  },
  setup(props: any, context: any) {
    // Element Ref
    const codeRef = ref(null);
    const availableDepTreeRef = ref(null);
    const assignedDepTreeRef = ref(null);
    const invRef = ref(null);

    // Inject Store and Locale
    const { SYS, COMMON, T } = inject('locale');
    const { menuStore } = inject('store');

    // Reactive object
    const state = reactive({
      selectedMenu: null,
      form: new Form({
        ...new Menu(),
        insertDepIds: [1],
        deleteDepIds: [1]
      })
    });

    // Other variables or const
    let beforeForm: any;
    const useView = props.useView;
    const { viewState } = useView;

    // Method: onAddNew
    // Purpose: Reset all form field to default
    // This method is called afater the form was submitted or when user click on New button
    const onAddNew = (event: any) => {
      console.log('onaddnew');
      useView.verifyAddNewAction(event.currentTarget.id, invRef, reload);
    };

    const reload = () => {
      return new Promise((resolve, reject) => {
        availableDepTreeRef.value &&
          availableDepTreeRef.value
            .loadData(null)
            .then((_: any) => {
              viewState.isUpdateMode = false;
              viewState.isReadOnlyMode = false;
              state.form.reset();
              setTimeout(() => {
                codeRef.value && codeRef.value.focus();

                useView.checkDeletedRecord(false);

                resolve('OK');
              }, 10);

              if (availableDepTreeRef.value) {
                availableDepTreeRef.value.disableTree(viewState.isReadOnlyMode);
                assignedDepTreeRef.value.cleanTree();
              }
            })
            .catch((error: any) => {
              reject(error);
            });
      });
    };

    // Method: onSaveOrUpdate
    // Purpose: Submit data to Api server for saving or updating
    // This method is called when click save/update/edit button. The onSubmit method is called afater onSave
    // First, we validate the user input data. If all data is valid then submit the form
    const onSaveOrUpdate = (event: any) => {
      useView.verifySaveAction(event.currentTarget.id, invRef, doSaveOrUpdate);
    };

    const doSaveOrUpdate = () => {
      // client validation
      state.form.errors.record(validation(state.form));
      if (state.form.errors.any()) {
        return;
      }

      (state.form as any).insertDepIds = availableDepTreeRef.value.getCheckedLeafIds(true);
      (state.form as any).deleteDepIds = assignedDepTreeRef.value.getCheckedLeafIds(false);

      // check if no data on form change
      if (viewState.isUpdateMode) {
        let changedObject = getDiffFieldsObject(beforeForm, SObject.clone(state.form));
        if (SObject.isEmptyField(changedObject)) {
          invRef.value.snackbarRef.showNoDataChange();
          return;
        }
      }

      // when all data valid. send request to api server
      viewState.saveRunning = true;
      (state.form as any)
        .post('sys/menu/save-or-update')
        .then((res: any) => {
          Debug.logSection('SaveOrUpdate Menu ', res);
          if (viewState.isUpdateMode) {
            invRef.value.snackbarRef.showUpdateSuccess();
            requireLoadWorkList(false);
          } else {
            invRef.value.snackbarRef.showSaveSuccess();
            requireLoadWorkList(true);
          }
          viewState.saveRunning = false;
          reload();
        })
        .catch((error: any) => {
          Debug.errorSection('SaveOrUpdate Menu', error);
          viewState.saveRunning = false;
        });
    };

    // Method: onDelete
    // Purpose: Delete selected Menu. Deleted record will be bring into Trash
    // This method is called when click Delete button
    const onDelete = (event: any) => {
      useView.verifyDeleteAction(event.currentTarget.id, invRef, state.selectedMenu.name, doDelete);
    };

    const doDelete = () => {
      if (state.selectedMenu) {
        viewState.deleteRunning = true;
        menuStore
          .deleteMany([state.selectedMenu.id])
          .then((_: any) => {
            invRef.value.snackbarRef.showDeleteSuccess();
            requireLoadWorkList(false);
            reload();
            viewState.deleteRunning = false;
          })
          .catch((error: any) => {
            Debug.errorSection('Delete Menu', error);
            viewState.deleteRunning = false;
          });
      }
    };

    // Method: onUpdate
    // Purpose: Update data
    // This method is called when click update button
    const onUpdate = (event: any) => {
      useView.verifyUpdateAction(event.currentTarget.id, invRef, () => {
        doSaveOrUpdate();
      });
    };

    // Method: onEdit
    // Purpose: Set editable for all input
    // This method is called when click edit button
    const onEdit = (event: any) => {
      useView.verifyEditAction(event.currentTarget.id, invRef, () => {
        viewState.isReadOnlyMode = false;
      });
    };

    // Method: onTrashRestore
    // Purpose: show trash restore modal
    // This method is called when click Trash Restore button
    const onTrashRestore = (event: any) => {
      useView.showTrashRestoreModal(event.currentTarget.id, invRef, () => {
        // after modal closed
        requireLoadWorkList(false);
      });
    };

    // Method: onViewConfig
    // Purpose: show view config modal
    // This method is called when click View Config button
    const onViewConfig = (event: any) => {
      useView.showViewConfigModal(event.currentTarget.id, invRef);
    };

    // watch the selected menu on worklist
    watch(
      () => props.selectedMenu,
      (selectedMenu: any) => {
        if (selectedMenu && selectedMenu.length > 0) {
          viewState.loading = true;
          state.selectedMenu = selectedMenu[0];
          const selectedMenuId = state.selectedMenu.id;

          const loadAssignedDepPromise = assignedDepTreeRef.value.loadData(selectedMenuId);
          const loadAvailableDepPromise = availableDepTreeRef.value.loadData(selectedMenuId);

          const loadMenuPromise = menuStore
            .sysGetMenuById(selectedMenuId)
            .then((res: any) => {
              // when selection menu was loaded
              // go to readonly mode
              viewState.isReadOnlyMode = true;
              viewState.isUpdateMode = true;

              state.form = new Form({ ...res, insertDepIds: [], deleteDepIds: [] });
              // save init value
              beforeForm = SObject.clone(state.form);
            })
            .catch((e: any) => {
              viewState.loading = false;
              Debug.errorSection('Select Menu', e);
            });

          Promise.all([loadAssignedDepPromise, loadAvailableDepPromise, loadMenuPromise]).then((_) => {
            viewState.loading = false;
          });
        }
      }
    );

    const onImageChange = (data: string) => {
      (state.form as any).iconData = data;
    };

    const requireLoadWorkList = (sortByCreatedDate: boolean) => {
      context.emit('loadWorkList', {
        sortByCreatedDate: sortByCreatedDate,
        refresh: new Date()
      });

      useView.checkDeletedRecord(false);
    };

    const onceLoad = () => {
      return reload();
    };

    return {
      props,
      state,

      availableDepTreeRef,
      assignedDepTreeRef,
      requireLoadWorkList,
      invRef,
      codeRef,

      onAddNew,
      onSaveOrUpdate,
      onEdit,
      onUpdate,
      onDelete,
      onTrashRestore,
      onViewConfig,
      onImageChange,

      reload,
      onceLoad,

      SYS,
      COMMON,
      T,

      // ...useRender,
      ...useView,
      useView
    };
  }
};
