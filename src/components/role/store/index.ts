import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/role/';
export const roleStore = reactive({
  sysGetRoleListByOrgId(orgId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      orgId: orgId,
      includeDeleted: true,
      includeDisabled: true
    });
  },

  sysGetMenuRoleControlList(ownerOrgId: any, roleId: any) {
    return Http.get(`sys/role-detail/${getMethodNameInSnackCase()}`, {
      ownerOrgId: ownerOrgId,
      roleId: roleId,
      includeDeleted: true,
      includeDisabled: true
    });
  }
});
