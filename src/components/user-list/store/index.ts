import { reactive } from 'vue';
import { Http } from '@/assets/js/http';

import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/human-or-org/';
export const userStore = reactive({
  sysGetUserListByOrgId(orgId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      orgId: orgId,
      includeDeleted: true,
      includeDisabled: true
    });
  }
});

export const sysGetUserInfoById = () => {
  return new Promise((resolve, reject) => {
    return Http.get(`${BASE_URL}sys-get-user-info-by-id`)
      .then((data: any) => {
        resolve(data);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
