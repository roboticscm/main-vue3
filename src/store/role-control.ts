import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/role-control/';

export const roleControlStore = reactive({
  sysGetControlListByDepIdAndUserIdAndMenuPath(depId: any, menuPath: string) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      depId,
      menuPath
    });
  }
});
