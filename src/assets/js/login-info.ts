import { reactive } from 'vue';

export default class LoginInfo {
  public static companyId: string;
  public static departmentId: string;
  public static theme = 'theme-green';
  public static alpha = 1;
  public static headerHeight = '50px';
  public static lang = 'vi-VN';
  public static viewableMenuItem = 5;
  public static delayTyping = 300;
  public static user = null;
  public static defaultPageSize = 20;
}

export const loginInfoStore = reactive({
  showSearchBar: true,
  showHistoryNavBar: true,
  historyCount: 3,
  selectedMenu: {},
  selectedDepartment: {}
});
