import LoginInfo from '@/assets/js/login-info';

export class Settings {
  menuPath: string;
  controlId: string;
  keys: string[];
  values: string[];
}

export class User {
  id: string;
  lastName: string;
  firstName: string;
  username: string;
  avatarUrl: string;
  defaultOwnerOrgId: string;
  constructor(obj: any) {
    this.id = obj.id;
    this.lastName = obj.lastName;
    this.firstName = obj.firstName;
    this.username = obj.username;
    this.avatarUrl = obj.avatarUrl;
    this.defaultOwnerOrgId = obj.defaultOwnerOrgId;
  }
}

export class Modules {
  id: string;
  name: string;
  path: string;
  icon: string;
  selected: boolean;
  constructor(obj: any) {
    this.id = obj.id;
    this.name = obj.name;
    this.path = obj.path;
    this.icon = obj.icon;
    this.selected = obj.selected;
  }
}

export class Branch {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Menu {
  id: string;
  code: string;
  name: string;
  path: string;
  iconData: string;
  useFontIcon: boolean;
  fontIcon: string;
  sort: number;
  disabled: boolean;
  constructor() {
    this.id = null;
    this.code = null;
    this.name = null;
    this.path = null;
    this.iconData = null;
    this.useFontIcon = false;
    this.sort = 0;
    this.fontIcon = null;
    this.disabled = false;
  }
}

export class Role {
  id: string;
  code: string;
  name: string;
  checked: boolean;

  constructor(obj: any) {
    // this.id = obj.id;
    // this.code = obj.code;
    // this.name = obj.name;
    // this.checked = obj.checked;
    Object.assign(this, obj);
  }
}

export interface ApiRes {
  payload: [];
  fullCount: number;
}

export class ViewState {
  menuPath: string;
  saveRunning = false;
  deleteRunning = false;
  resetRunning = false;
  isUpdateMode = false;
  loading = false;
  isReadOnlyMode = false;
  hasAnyDeletedRecord = false;
  dataChange = false;
  tableName: string;
  columns: string[];
  orderBy: string[];
  trashRestoreColumns: string[];
  totalRecords = 0;
  page = 1;
  pageSize = LoginInfo.defaultPageSize;
}
