import { orgStore } from '@/components/owner-org/store/index';
import { menuStore } from '@/components/menu/store/index';
import { userStore } from '@/components/user-list/store/index';
import { roleStore } from '@/components/role/store/index';
import { system } from '@/modules/sys/store/index';
import { settingsStore } from './settings';
import { roleControlStore } from './role-control';
import { localeResourceStore } from './locale-resource';
import { menuControlStore } from './menu-control';
import { menuHistoryStore } from './menu-history';
import { loginInfoStore } from '@/assets/js/login-info';
import { tableUtilStore } from './table-util';

export const store = {
  orgStore,
  userStore,
  roleStore,
  system,
  menuStore,
  settingsStore,
  roleControlStore,
  localeResourceStore,
  menuControlStore,
  menuHistoryStore,
  loginInfoStore,
  tableUtilStore
};
