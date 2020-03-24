import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { Settings } from '@/types/base/system';
import { getMethodNameInSnackCase } from '@/assets/js/util';
const JSONbig = require('json-bigint');

const BASE_URL = 'sys/user-settings/';
export class UserSettings {
  public static snackbarTimeout = 3000;
  public static delayOnInput = 300;
}

export const settingsStore = reactive({
  getUserSettings(menuPath: string, controlId: string) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      menuPath: menuPath,
      controlId: controlId
    });
  },

  saveOrUpdate(obj: Settings) {
    return Http.post(`${BASE_URL}${getMethodNameInSnackCase()}`, JSONbig.stringify(obj));
  }
});

export const sysGetUserSettings = async (companyId: any) => {
  return Http.get(`${BASE_URL}sys-get-user-settings`, {
    companyId
  });
};
