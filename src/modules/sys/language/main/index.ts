import { ref, reactive, onUnmounted, onMounted, nextTick, onUpdated, onBeforeUpdate } from 'vue';
import { Language } from '@/modules/sys/language/model';
import { languageStore } from '@/modules/sys/language/store';
import Form from '@/assets/js/form/form';
import { T } from '@/assets/js/locale/locale';
import { SObject } from '@/assets/js/sobject';
import { validation } from './validation';

import {
  fromEvent,
  interval,
  noop,
  Observable,
  AsyncSubject,
  ReplaySubject,
  Subscription,
  of,
  zip,
  combineLatest,
  forkJoin
} from 'rxjs';
import {
  catchError,
  concatMap,
  delayWhen,
  distinct,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  mergeMap,
  retry,
  shareReplay,
  skip,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

export default {
  setup: (props: any, context: any) => {
    // Subject: early subscribe
    // BehaviorSubject: last late subscribe
    // AsyncSubject: last subscribe after complete
    // ReplaySubject: all subscribe after complete

    let otherSub: Subscription = null;
    let selSub: Subscription = null;

    // const subject = new ReplaySubject();
    // const subject$ = subject.asObservable();
    // subject$.subscribe(value => console.log('early ', value))
    // subject.next(1);
    // subject.next(2);
    // subject.next(3);
    // subject$.subscribe(value => console.log('late ', value))
    // subject.next(4);
    // subject.next(5);
    // subject.next(6);
    // subject.complete();
    // subject$.subscribe(value => console.log('complete ', value))

    // ===================================REF=====================================
    const invRef = ref(null);

    const { useView } = props;
    const { viewState } = useView;

    // ===================================ONCE LOAD=====================================
    const onceLoad = () => {
      languageStore.otherFetch();
    };
    onceLoad();

    // ===================================REACTIVE=====================================
    const state = reactive<{ selectedData: Language; form: Form }>({
      selectedData: null,
      form: new Form({
        ...new Language()
      })
    });
    let beforeForm: any;

    // ===================================EVENT HANDLE=====================================

    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     * @nocollapse
     * @deprecated use new Observable() instead
     */
    const onAddNew = (event) => {};

    // Method: onEdit
    // Purpose: Set editable for all input
    // This method is called when click edit button
    const onEdit = (event: any) => {
      useView.verifyEditAction(event.currentTarget.id, invRef, () => {
        viewState.isReadOnlyMode = false;
      });
    };

    // Method: onUpdate
    // Purpose: Update data
    // This method is called when click update button
    const onUpdate = (event: any) => {
      // useView.verifyUpdateAction(event.currentTarget.id, invRef, () => {
      //   doSaveOrUpdate();
      // });
    };

    // Method: onDelete
    // Purpose: Delete selected Menu. Deleted record will be bring into Trash
    // This method is called when click Delete button
    const onDelete = (event: any) => {
      useView.verifyDeleteAction(event.currentTarget.id, invRef, state.selectedData.name, doDelete);
    };

    const doDelete = () => {
      // if (state.selectedData) {
      //   viewState.deleteRunning = true;
      //   menuStore
      //       .deleteMany([state.selectedMenu.id])
      //       .then((_: any) => {
      //         invRef.value.snackbarRef.showDeleteSuccess();
      //         requireLoadWorkList(false);
      //         reload();
      //         viewState.deleteRunning = false;
      //       })
      //       .catch((error: any) => {
      //         Debug.errorSection('Delete Menu', error);
      //         viewState.deleteRunning = false;
      //       });
      // }
    };

    // Method: onTrashRestore
    // Purpose: show trash restore modal
    // This method is called when click Trash Restore button
    const onTrashRestore = (event: any) => {
      useView.showTrashRestoreModal(event.currentTarget.id, invRef, () => {
        // after modal closed
        // requireLoadWorkList(false);
      });
    };

    // Method: onViewConfig
    // Purpose: show view config modal
    // This method is called when click View Config button
    const onViewConfig = (event: any) => {
      useView.showViewConfigModal(event.currentTarget.id, invRef);
    };

    // ===================================PRIVATE METHOD=====================================
    const selection = (data: Language) => {
      // go to readonly mode
      viewState.isReadOnlyMode = true;
      viewState.isUpdateMode = true;
      viewState.loading = false;

      state.form = new Form({ ...data });
      // save init value
      beforeForm = SObject.clone(state.form);
    };

    onUnmounted(() => {
      if (otherSub) {
        otherSub.unsubscribe();
      }

      if (selSub) {
        selSub.unsubscribe();
      }
    });

    // ===================================SUBSCRIBE=====================================
    const subscribe = () => {
      selSub = languageStore.selectedItem$.subscribe(
        (data) => {
          state.selectedData = data;
          selection(data);
        },
        (error) => {
          viewState.loading = false;
          // console.log('xxxxxx', error)
        }
      );
      otherSub = languageStore.otherList$.subscribe((data) => {
        // console.log('otherSub', data);
      });
    };
    subscribe();

    // const lazyVerifyAction = (
    //     id: string,
    //     confirmCallback: Function,
    //     passwordConfirmModal: any,
    //
    const check = (id) => {
      return useView.lazyVerifyAction(
        id,
        () => invRef.value.confirmModalRef.show('??'),
        invRef.value.passwordConfirmModalRef
      );
    };
    const validate = () => {
      // client validation
      state.form.errors.record(validation(state.form));
      if (state.form.errors.any()) {
        return false;
      }

      return true;
    };

    onMounted(() => {
      setTimeout(() => {
        const ele: any = document.querySelector('#btnAddNew');
        fromEvent(ele, 'click')
          .pipe(
            filter((_) => validate()),
            concatMap((_) =>
              fromPromise(check(ele.id)).pipe(
                catchError((error) => {
                  console.log(error);
                  return of(error);
                })
              )
            ),
            filter((value) => value !== 'fail'),
            switchMap((_) => {
              viewState.loading = true;
              return languageStore.fetchAll2$(viewState);
            })
          )
          .subscribe({
            next: (res) => {
              viewState.loading = false;
              console.log(res);
            },
            error: (error) => {
              viewState.loading = false;
              console.error(error);
            }
          });
      }, 500);
    });

    return {
      invRef,
      T,
      state,
      useView,
      ...useView,

      onAddNew,
      onEdit,
      onUpdate,
      onDelete,
      onTrashRestore,
      onViewConfig
    };
  }
};
