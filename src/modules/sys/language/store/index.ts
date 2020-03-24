import {
  ReplaySubject,
  combineLatest,
  AsyncSubject,
  forkJoin,
  of,
  throwError,
  BehaviorSubject,
  Observable,
  interval
} from 'rxjs';

import { Language } from '@/modules/sys/language/model';
import { tableUtilStore } from '@/store/table-util';
import { ApiRes, ViewState } from '@/types/base/system';
import { Debug } from '@/assets/js/debug';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';
import { ajax, fromPromise } from 'rxjs/internal-compatibility';
import { catchError, first, skip } from 'rxjs/operators';
import rxTableUtilStore from '@/store/rx-table-util';
import { getBrowserID } from '@/assets/js/security';

const BASE_URL = 'sys/language/';

export class LanguageStore {
  private itemsListSubject = new BehaviorSubject<Language[]>([]);
  itemsList$ = this.itemsListSubject.asObservable().pipe(skip(1));
  private selectedItemSubject = new BehaviorSubject<Language>(null);
  selectedItem$ = this.selectedItemSubject.asObservable().pipe(skip(1));

  otherListSubject = new BehaviorSubject<string[]>([]);
  otherList$: Observable<string[]> = this.otherListSubject.asObservable().pipe(skip(1));
  complete$ = forkJoin([
    this.otherList$.pipe(
      catchError((error) => of([])),
      first()
    ),
    this.itemsList$.pipe(
      catchError((error) => of([])),
      first()
    )
  ]);

  fetchAll = (viewState: ViewState, textSearch = '') => {
    fromPromise(
      tableUtilStore.getSimpleList(
        viewState.tableName,
        viewState.columns,
        viewState.orderBy,
        viewState.page,
        viewState.pageSize,
        true,
        false
      )
    ).subscribe(
      (res: ApiRes) => {
        this.itemsListSubject.next(res.payload);
        viewState.totalRecords = res.fullCount;
      },
      (error) => {
        this.itemsListSubject.error(error);
      }
    );
  };

  fetchAll2$ = (viewState: ViewState, textSearch = '') => {
    return rxTableUtilStore.getSimpleList({
      tableName: ['menu'],
      columns: ['id', 'name'],
      orderBy: viewState.orderBy,
      page: viewState.page,
      pageSize: viewState.pageSize,
      includeDisabled: true,
      onlyMe: false
    });
  };

  fetchAll3$ = (viewState: ViewState, textSearch = '') => {
    const param = 'tableName=menu&columns=id,name&orderBy=sort&page=1&pageSize=-1&onLyMe=false&includeDisabled=true';
    const token = localStorage.getItem('sessionId').replace(getBrowserID(), '');
    const authHeader = `1||| ${token}`;
    return ajax.get(`http://localhost:8182/api/sys/table-util/get-simple-list?${param}`, {
      'Content-Type': 'application/json',
      Authorization: authHeader
    });
  };

  fetchOne = (viewState: ViewState, id: string) => {
    tableUtilStore
      .getOneById(viewState.tableName, id)
      .then((res) => {
        if (res.length > 0) {
          this.selectedItemSubject.next(res[0]);
        } else {
          this.selectedItemSubject.next(null);
        }
      })
      .catch((error) => {
        this.selectedItemSubject.error(error);
        Debug.errorSection('Language Store', error);
      });
  };

  otherFetch = () => {
    setTimeout(() => {
      this.otherListSubject.next(['other fetch']);
    }, 0);
  };

  deleteMany(ids: string[]) {
    return Http.delete(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      ids,
      isPermanentlyDeleted: false
    })
      .then((res) => {})
      .catch((error) => {});
  }

  abortFetch = () => {
    return fromPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('fininshed');
        }, 1000);
      })
    );
  };
}

export const languageStore = new LanguageStore();
