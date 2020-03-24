import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/assignment-role/';

export const assignmentRoleStore = reactive({
  sysGetAllAssignmentRoleUserList() {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      includeDeleted: false,
      includeDisabled: true
    });
  },

  sysGetRoleListOfUser(userId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      userId: userId,
      includeDeleted: false,
      includeDisabled: true
    });
  },

  saveOrUpdateOrDelete(users: any[], roles: any[]) {
    return Http.post(
      `${BASE_URL}${getMethodNameInSnackCase()}`,
      JSON.stringify({
        users: users,
        roles: roles
      })
    );
  }
});
