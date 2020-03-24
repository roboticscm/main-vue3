import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/owner-org/';

export const orgStore = reactive({
  sysGetOwnerOrgTree() {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`);
  },
  sysGetOwnerOrgRoleTree() {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`);
  },
  sysGetRoledDepartmentListByUserId() {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      includeDeleted: false,
      includeDisabled: false
    });
  },
  sysGetDepartmentTreeByMenuId(menuId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      menuId
    });
  },
  sysGetAvailableDepartmentTreeForMenu(menuId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      menuId
    });
  },
  sysGetCompanyList() {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`);
  }
});
