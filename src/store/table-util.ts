import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/table-util/';

export const tableUtilStore = reactive({
  hasAnyDeletedRecord(tableName: string, onlyMe: boolean) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      tableName,
      onlyMe
    });
  },
  getAllDeletedRecords(tableName: string, columns: string[], onlyMe: boolean) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      tableName,
      columns: columns.map((it) => `t.${it}`).join(','),
      onlyMe
    });
  },
  restoreOrForeverDelete(tableName: string, deleteIds: string, restoreIds: string) {
    return Http.delete(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      tableName,
      deleteIds,
      restoreIds
    });
  },
  getSimpleList(
    tableName: string,
    columns: string[],
    orderBy = ['sort', 'name'],
    page = 1,
    pageSize = -1,
    includeDisabled: boolean = true,
    onlyMe: boolean = false
  ) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      tableName,
      columns: columns.join(','),
      orderBy: orderBy.join(','),
      page,
      pageSize,
      onlyMe,
      includeDisabled
    });
  },
  getOneById(tableName: string, id: string) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      tableName,
      id
    });
  }
});
