import { reactive } from 'vue';
import { Http } from '@/assets/js/http';
import { getMethodNameInSnackCase } from '@/assets/js/util';
import { Debug } from '@/assets/js/debug';
import { UrlUtil } from '@/assets/js/url-util';

const BASE_URL = 'sys/menu/';

export const menuStore = reactive({
  menuPaths: [],
  selectedMenuPath: null,
  hasMenu(menuPath: string) {
    return menuStore.menuPaths.filter((item: string) => item === menuPath).length > 0;
  },
  sysGetFirstRoledMenuPathByUserIdAndDepId(depId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      depId,
      includeDeleted: false,
      includeDisabled: false
    });
  },
  sysGetRoledMenuListByUserIdAndDepId(depId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      depId,
      includeDeleted: false,
      includeDisabled: false
    });
  },
  sysGetMenuById(menuId: any) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      menuId: menuId
    });
  },
  sysGetAllMenuList(sortByCreatedDate: boolean) {
    return Http.get(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      sortByCreatedDate: sortByCreatedDate
    });
  },
  saveOrUpdate(obj: any) {
    return Http.post(`${BASE_URL}${getMethodNameInSnackCase()}`, JSON.stringify(obj));
  },
  applyTrashRestore(arrayOfObject: any) {
    return Http.post(`${BASE_URL}${getMethodNameInSnackCase()}`, JSON.stringify(arrayOfObject));
  },
  deleteMany(menuIds: []) {
    return Http.delete(`${BASE_URL}${getMethodNameInSnackCase()}`, {
      ids: menuIds,
      isPermanentlyDeleted: false
    });
  }
});

export const sysGetRoledMenuPathListByUserId = async () => {
  try {
    let res: any = await Http.get(`${BASE_URL}sys-get-roled-menu-path-list-by-user-id`, {
      includeDeleted: false,
      includeDisabled: false
    });

    if (res) {
      menuStore.menuPaths = res.map((item: any) => item.path);
    } else {
      menuStore.menuPaths = [];
    }
    return Promise.resolve('OK');
  } catch (error) {
    Debug.errorSection('Load Menu Path', error);
    menuStore.menuPaths = [];
    return Promise.reject('Error');
  }
};
