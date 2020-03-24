import { reactive, inject } from 'vue';
import { UrlUtil } from '@/assets/js/url-util';
import LoginInfo from '@/assets/js/login-info';

export default {
  setup() {
    const { roleControlStore } = inject('store');
    const controlState = reactive({
      controls: [],
      fullControl: false
    });

    const loadData = () => {
      roleControlStore
        .sysGetControlListByDepIdAndUserIdAndMenuPath(LoginInfo.departmentId, UrlUtil.getMenuPathFromUrl())
        .then((res: any) => {
          if (res.fullControl) {
            controlState.fullControl = true;
          } else {
            controlState.controls = res;
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    loadData();

    return {
      controlState,
      loadData
    };
  }
};
