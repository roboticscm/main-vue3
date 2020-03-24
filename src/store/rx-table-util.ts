import { RxHttp } from '@/assets/js/rx-http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/table-util/';

class TableUtilStore {
  getSimpleList(param) {
    return RxHttp.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      ...param,
      columns: param.columns.join(','),
      orderBy: param.orderBy.join(',')
    });
  }
}

export default new TableUtilStore();
