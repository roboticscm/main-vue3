import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';
const JSONbig = require('json-bigint');

const BASE_URL = 'sys/menu-history/';

export const menuHistoryStore = reactive({
  saveOrUpdate(obj: any) {
    return Http.post(`${BASE_URL}${getMethodNameInSnackCase()}`, JSONbig.stringify(obj));
  }
});
