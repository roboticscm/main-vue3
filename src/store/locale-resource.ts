import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';
const JSONbig = require('json-bigint');

const BASE_URL = 'sys/locale-resource/';

export const localeResourceStore = reactive({
  sysGetUsedLanguages() {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`);
  },
  sysGetUsedLangCategories(textSearch: string) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      textSearch
    });
  },
  sysGetUsedLangTypeGroups(textSearch: string) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      textSearch
    });
  },
  sysGetAllLanguages(includeDeleted: boolean, includeDisabled: boolean) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      includeDeleted,
      includeDisabled
    });
  },
  saveOrUpdateOrDelete(obj: any) {
    return Http.post(`${BASE_URL}${getMethodNameInSnackCase()}`, JSONbig.stringify(obj));
  },
  sysGetLocaleResourceByCompanyIdAndCatAndTypeGroup(
    companyId: any,
    category: string,
    typeGroup: string,
    textSearch: string,
    page: number,
    pageSize: number
  ) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      companyId,
      category,
      typeGroup,
      textSearch,
      page,
      pageSize
    });
  }
});
