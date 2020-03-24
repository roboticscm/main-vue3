import { reactive, watch } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';

const BASE_URL = 'sys/role-detail/';
export const roleDetailStore = reactive({
  treeRef: null,
  workListContext: null,
  saveOrUpdateOrDelete(roleId: any, roleDetailWithControls: any[]) {
    return Http.post(
      `${BASE_URL}${getMethodNameInSnackCase()}`,
      JSON.stringify({
        roleId: roleId,
        roleDetailWithControls: roleDetailWithControls
      })
    );
  },

  roleTreeClick() {
    let ownerOrgId = roleDetailStore.treeRef.getSelectedParentId();
    let roleId = roleDetailStore.treeRef.getSelectedRoleId();

    roleDetailStore.workListContext.emit('click', {
      orgId: ownerOrgId,
      roleId: roleId
    });
  }
});
