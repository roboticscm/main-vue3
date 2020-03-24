import { ref, reactive, inject } from 'vue';

import { UrlUtil } from '@/assets/js/url-util';
import { SObject } from '@/assets/js/sobject';
import UseRender from '@/assets/js/composition/use-render';
import UseLoader from '@/assets/js/composition/use-loader';
import { Debug } from '../debug';
import { SDate } from '../sdate';
import LoginInfo from '@/assets/js/login-info';
import { ViewState } from '@/types/base/system';

export default {
  setup() {
    const { COMMON, T } = inject('locale');
    const { tableUtilStore, menuControlStore } = inject('store');
    const viewState = reactive<ViewState>({
      menuPath: null,
      saveRunning: false,
      deleteRunning: false,
      resetRunning: false,
      isUpdateMode: false,
      loading: false,
      isReadOnlyMode: false,
      hasAnyDeletedRecord: false,
      dataChange: false,
      tableName: null,
      columns: [],
      orderBy: [],
      trashRestoreColumns: [],
      totalRecords: 0,
      page: 1,
      pageSize: LoginInfo.defaultPageSize
    });
    const useLoader = UseLoader.setup();
    const useRender = UseRender.setup(null, null, useLoader.controlState);

    const getViewTitle = () => {
      const menuPath = viewState.menuPath ? viewState.menuPath : UrlUtil.getMenuPathFromUrl();
      const index = menuPath.lastIndexOf('/');
      if (index >= 0) {
        const key = menuPath
          .slice(index + 1)
          .replace('-', '_')
          .toUpperCase();
        return COMMON.MENU[key] || `#${key}`;
      } else {
        return 'Untitled';
      }
    };

    const getViewName = () => {
      const menuPath = viewState.menuPath ? viewState.menuPath : UrlUtil.getMenuPathFromUrl();
      const index = menuPath.lastIndexOf('/');
      if (index >= 0) {
        return menuPath.slice(index + 1);
      } else {
        return 'Untitled';
      }
    };

    const checkForNoDataChange = (beforeData: any, currentData: any, snackbar: any) => {
      let changedObject = SObject.getDiffRowObjectArray(beforeData, currentData);

      if (SObject.isEmptyField(changedObject)) {
        snackbar.showNoDataChange();
        return true;
      }

      return changedObject;
    };

    const checkForNoDataChange2 = (beforeData: any, currentData: any, snackbar: any, keyFields: any[]) => {
      let changedObject = SObject.getDiffRowObjectArray2(beforeData, currentData, keyFields);

      if (!viewState.dataChange || SObject.isEmptyField(changedObject)) {
        snackbar.showNoDataChange();
        return true;
      }

      return changedObject;
    };

    const verifyAction = (id: string, confirmCallback: Function, passwordConfirmModal: any, okFunction: Function) => {
      if (id === undefined || id === null || id.trim().length === 0) {
        Debug.errorSection('Verify Action', 'ID not defined');
        return false;
      }
      // check permission
      if (!useRender.hasPermission(id)) {
        return false;
      }

      // confirm
      if (confirmCallback && useRender.confirm(id, useLoader.controlState)) {
        let result = false;
        confirmCallback().then((confirmButtonPressed: string) => {
          if (confirmButtonPressed === 'OK') {
            if (useRender.requirePassword(id, useLoader.controlState)) {
              passwordConfirmModal &&
                passwordConfirmModal.show().then((buttonPressed: string) => {
                  if (buttonPressed === 'OK') {
                    okFunction();
                    result = true;
                  }
                });
            } else {
              okFunction();
              result = true;
            }
          }
        });

        return result;
      } else {
        // no confirm
        if (useRender.requirePassword(id, useLoader.controlState)) {
          let result = false;
          passwordConfirmModal &&
            passwordConfirmModal.show().then((buttonPressed: string) => {
              if (buttonPressed === 'OK') {
                okFunction();
                result = true;
              }
            });
          return result;
        } else {
          okFunction();
          return true;
        }
      }
    };

    const lazyVerifyAction = (id: string, confirmCallback: Function, passwordConfirmModal: any) => {
      return new Promise((resolve, reject) => {
        if (id === undefined || id === null || id.trim().length === 0) {
          Debug.errorSection('Verify Action', 'ID not defined');
          reject('fail');
        }
        // check permission
        if (!useRender.hasPermission(id)) {
          reject('fail');
        }

        // confirm
        if (confirmCallback && useRender.confirm(id, useLoader.controlState)) {
          confirmCallback().then((confirmButtonPressed: string) => {
            if (confirmButtonPressed === 'OK') {
              if (useRender.requirePassword(id, useLoader.controlState)) {
                passwordConfirmModal &&
                  passwordConfirmModal.show().then((buttonPressed: string) => {
                    if (buttonPressed === 'OK') {
                      resolve('ok');
                    } else {
                      reject('fail');
                    }
                  });
              } else {
                resolve('ok');
              }
            } else {
              reject('fail');
            }
          });
        } else {
          // no confirm
          if (useRender.requirePassword(id, useLoader.controlState)) {
            passwordConfirmModal &&
              passwordConfirmModal.show().then((buttonPressed: string) => {
                if (buttonPressed === 'OK') {
                  resolve('ok');
                } else {
                  reject('fail');
                }
              });
          } else {
            resolve('ok');
          }
        }
      });
    };

    const simpleVerifyAction = (buttonId: string, invRef: any, msg: string, okFunction: Function) => {
      verifyAction(
        buttonId,
        () => {
          return invRef.value.confirmModalRef.show(msg);
        },
        invRef.value.passwordConfirmModalRef,
        () => {
          okFunction();
        }
      );
    };

    const showViewConfigModal = (buttonId: string, invRef: any) => {
      const confirmCallback = () => {
        return invRef.value.confirmModalRef.show(
          `${T('COMMON.MSG.SHOW_VIEW_CONFIG')}. ${T('COMMON.MSG.ARE_YOU_SURE')}?`
        );
      };

      verifyAction(buttonId, confirmCallback, invRef.value.passwordConfirmModalRef, () => {
        menuControlStore
          .sysGetControlListByMenuPath(viewState.menuPath ? viewState.menuPath : UrlUtil.getMenuPathFromUrl())
          .then((data: any) => {
            invRef.value.viewConfigModalRef.show(data).then((buttonPressed: string) => {
              if (buttonPressed === 'OK') {
                const newData = invRef.value.viewConfigModalRef.getData();
                let dataChanged = checkForNoDataChange(data, newData, invRef.value.snackbarRef);
                if (typeof dataChanged !== 'boolean') {
                  dataChanged = dataChanged.filter(
                    (item: any) => item.code !== 'btnConfig' || (item.code === 'btnConfig' && item.checked)
                  );
                  if (dataChanged.length > 0) {
                    menuControlStore
                      .saveOrUpdateOrDelete({
                        menuPath: viewState.menuPath ? viewState.menuPath : UrlUtil.getMenuPathFromUrl(),
                        menuControls: dataChanged
                      })
                      .then((_: any) => {
                        location.reload();
                      });
                  }
                }
              }
            });
          });
      });
    };

    const checkDeletedRecord = (onlyMe: boolean) => {
      tableUtilStore.hasAnyDeletedRecord(viewState.tableName, onlyMe).then((data: any) => {
        if (data.length > 0) {
          viewState.hasAnyDeletedRecord = data[0].exists;
        }
      });
    };

    const showTrashRestoreModal = (buttonId: string, invRef: any, postFunction: Function) => {
      simpleVerifyAction(
        buttonId,
        invRef,
        `${T('COMMON.MSG.SHOW_TRUSH_RESTORE')}. ${T('COMMON.MSG.ARE_YOU_SURE')}?`,
        () => {
          doShowTrashRestoreModal(false, invRef, () => {
            // load menu list order by sort
            postFunction();
          });
        }
      );
    };

    const doShowTrashRestoreModal = (onlyMe: boolean, invRef: any, postFunction: Function) => {
      tableUtilStore
        .getAllDeletedRecords(viewState.tableName, viewState.trashRestoreColumns, onlyMe)
        .then((res: any) => {
          const newData = res
            ? res.map((item: any, index: any) => {
                item.restore = false;
                item.foreverDelete = false;
                item.deletedDate = SDate.convertMilisecondToDateTimeString(item.deletedDate);
                return item;
              })
            : [];

          invRef.value.trashRestoreModalRef.show(newData).then((buttonPressed: string) => {
            if (buttonPressed === 'OK') {
              const newData = invRef.value.trashRestoreModalRef.getData();
              if (newData && newData.length > 0) {
                const filter = newData
                  .filter((item: any) => item.restore === true || item.foreverDelete === true)
                  .map((item: any) => {
                    delete item.deletedBy;
                    delete item.deletedDate;
                    return item;
                  });
                if (filter && filter.length > 0) {
                  const deletedIds = filter
                    .filter((item: any) => item.foreverDelete === true)
                    .map((it: any) => it.id)
                    .join(',');

                  const restoreIds = filter
                    .filter((item: any) => item.restore === true)
                    .map((it: any) => it.id)
                    .join(',');

                  tableUtilStore.restoreOrForeverDelete(viewState.tableName, deletedIds, restoreIds).then((_: any) => {
                    postFunction();
                  });
                } else {
                  invRef.value.snackbarRef.showNoDataChange();
                }
              }
            }
          });
        });
    };

    const verifyEditAction = (buttonId: string, invRef: any, okFunction: Function) => {
      simpleVerifyAction(buttonId, invRef, `${T('COMMON.MSG.EDIT')}. ${T('COMMON.MSG.ARE_YOU_SURE')}?`, okFunction);
    };

    const verifyUpdateAction = (buttonId: string, invRef: any, okFunction: Function) => {
      simpleVerifyAction(buttonId, invRef, `${T('COMMON.MSG.UPDATE')}. ${T('COMMON.MSG.ARE_YOU_SURE')}?`, okFunction);
    };

    const verifySaveAction = (buttonId: string, invRef: any, okFunction: Function) => {
      simpleVerifyAction(buttonId, invRef, `${T('COMMON.MSG.SAVE')}. ${T('COMMON.MSG.ARE_YOU_SURE')}?`, okFunction);
    };

    const verifyAddNewAction = (buttonId: string, invRef: any, okFunction: Function) => {
      simpleVerifyAction(buttonId, invRef, `${T('COMMON.MSG.ADD_NEW')}. ${T('COMMON.MSG.ARE_YOU_SURE')}?`, okFunction);
    };

    const verifyDeleteAction = (buttonId: string, invRef: any, msg: string, okFunction: Function) => {
      verifyAction(
        buttonId,
        () => {
          return invRef.value.deleteConfirmModalRef.show(msg);
        },
        invRef.value.passwordConfirmModalRef,
        okFunction
      );
    };

    return {
      viewState,
      getViewTitle,
      getViewName,
      checkForNoDataChange,
      checkForNoDataChange2,
      verifyAction,
      simpleVerifyAction,
      showViewConfigModal,
      checkDeletedRecord,
      doShowTrashRestoreModal,
      showTrashRestoreModal,
      verifyEditAction,
      verifyUpdateAction,
      verifyDeleteAction,
      verifySaveAction,
      verifyAddNewAction,
      lazyVerifyAction,
      ...useLoader,
      ...useRender
    };
  }
};
