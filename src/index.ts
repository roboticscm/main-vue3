import { setHeader, loginSuccess, logout, getBrowserID, getLoginInfo } from '@/assets/js/security';
import { API, Token } from '@/assets/js/constants';

import { createApp, App } from 'vue';
import MyApp from './app.vue';
import { store } from '@/store/index';
import 'jquery';
import 'jquery-ui';
import '@/../../sass/sass/index.scss';
import '@/assets/js/vendor/jquery.ztree.all.min';
import BasicRouter from '@/components/basic-router/index';
import Routes from '@/routes/index';

import { sysGetLocaleResourceListByCompanyIdAndLocale } from '@/assets/js/locale/locale';

import { Locale } from '@/assets/js/locale/index';
import { UrlUtil } from './assets/js/url-util';
import { Debug } from './assets/js/debug';
import { sysGetRoledMenuPathListByUserId } from '@/components/menu/store/index';
import { sysGetUserSettings } from '@/store/settings';
import C from '@/components/comment/index.vue';
import MainLayout from '@/components/main-layout/index.vue';
import TwoColumnGrid from '@/components/two-column-grid/index.vue';
import ThreeColumnGrid from '@/components/three-column-grid/index.vue';
import ExcelGrid from '@/components/excel-grid/index.vue';
import ConfigButton from '@/components/button/config-button/index.vue';
import SaveButton from '@/components/button/save-button/index.vue';
import OkButton from '@/components/button/ok-button/index.vue';
import CloseModalButton from '@/components/button/close-modal-button/index.vue';
import CancelButton from '@/components/button/cancel-button/index.vue';
import ResetButton from '@/components/button/reset-button/index.vue';
import AddNewButton from '@/components/button/add-new-button/index.vue';
import ApplyButton from '@/components/button/apply-button/index.vue';
import DeleteButton from '@/components/button/delete-button/index.vue';
import UpdateButton from '@/components/button/update-button/index.vue';
import EditButton from '@/components/button/edit-button/index.vue';
import ToggleButton from '@/components/button/toggle-button/index.vue';
import TrashRestoreButton from '@/components/button/trash-restore-button/index.vue';
import ProgressBar from '@/components/progress-bar/index.vue';
import SingleImageSelector from '@/components/single-image-selector/index.vue';
import DeleteConfirmModal from '@/components/modal/delete-confirm-modal/index.vue';
import Modal from '@/components/modal/base/index.vue';
import ViewWrapperModal from '@/components/modal/view-wrapper-modal/index.vue';
import SetInvisibleModal from '@/components/modal/set-invisible-modal/index.vue';
import ConfirmModal from '@/components/modal/confirm-modal/index.vue';
import PasswordConfirmModal from '@/components/modal/password-confirm-modal/index.vue';
import TrashRestoreModal from '@/components/modal/trash-restore-modal/index.vue';
import InputModal from '@/components/modal/input-modal/index.vue';
import Snackbar from '@/components/snackbar/index.vue';
import ViewConfigModal from '@/components/modal/view-config-modal/index.vue';
import Dropdown from '@/components/dropdown/base/index.vue';
import QuickSearch from '@/components/search/quick-search/index.vue';
import SearchBar from '@/components/search/search-bar/index.vue';
import Autocomplete from '@/components/autocomplete/base/index.vue';
import ViewTitle from '@/components/view-title/index.vue';
import SelectableTable from '@/components/selectable-table/index.vue';
import RangeSlider from '@/components/range-slider/index.vue';
import Tabs from '@/components/tabs/index.vue';
import Color from '@/assets/js/color';
import Pagination from '@/components/pagination/index.vue';
import SimpleList from '@/components/simple-list/index.vue';
import SimpleWorkList from '@/components/simple-work-list/index.vue';

import { getThemeColors } from '@/components/modal/theme-config-modal/helper';
import LoginInfo from '@/assets/js/login-info';
import { sysGetUserInfoById } from '@/components/user-list/store';

const initVueInstance = () => {
  const app = createApp(MyApp);
  app.provide('store', store);
  app.use(BasicRouter, Routes);
  app.provide('locale', Locale);
  app.directive;
  app.component('C', C);
  app.component('MainLayout', MainLayout);
  app.component('TwoColumnGrid', TwoColumnGrid);
  app.component('ThreeColumnGrid', ThreeColumnGrid);
  app.component('ConfigButton', ConfigButton);
  app.component('OkButton', OkButton);
  app.component('CloseModalButton', CloseModalButton);
  app.component('CancelButton', CancelButton);
  app.component('SaveButton', SaveButton);
  app.component('ApplyButton', ApplyButton);
  app.component('AddNewButton', AddNewButton);
  app.component('DeleteButton', DeleteButton);
  app.component('UpdateButton', UpdateButton);
  app.component('EditButton', EditButton);
  app.component('TrashRestoreButton', TrashRestoreButton);
  app.component('ResetButton', ResetButton);
  app.component('ProgressBar', ProgressBar);
  app.component('SingleImageSelector', SingleImageSelector);
  app.component('Modal', Modal);
  app.component('ViewWrapperModal', ViewWrapperModal);
  app.component('SetInvisibleModal', SetInvisibleModal);
  app.component('ConfirmModal', ConfirmModal);
  app.component('DeleteConfirmModal', DeleteConfirmModal);
  app.component('PasswordConfirmModal', PasswordConfirmModal);
  app.component('TrashRestoreModal', TrashRestoreModal);
  app.component('Snackbar', Snackbar);
  app.component('ViewConfigModal', ViewConfigModal);
  app.component('Dropdown', Dropdown);
  app.component('QuickSearch', QuickSearch);
  app.component('SearchBar', SearchBar);
  app.component('Autocomplete', Autocomplete);
  app.component('ViewTitle', ViewTitle);
  app.component('ExcelGrid', ExcelGrid);
  app.component('InputModal', InputModal);
  app.component('SelectableTable', SelectableTable);
  app.component('RangeSlider', RangeSlider);
  app.component('Tabs', Tabs);
  app.component('ToggleButton', ToggleButton);
  app.component('Pagination', Pagination);
  app.component('SimpleList', SimpleList);
  app.component('SimpleWorkList', SimpleWorkList);

  app.mount('#app');
};

const applyAlphaColor = (alpha: number) => {
  Color.applyApha(getThemeColors(), alpha);
};

const loadMenuAndUserSettings = () => {
  sysGetRoledMenuPathListByUserId()
    .then((_: any) => {
      sysGetUserInfoById()
        .then((data: any) => {
          if (data.length > 0) {
            LoginInfo.user = {
              username: data[0].username,
              firstName: data[0].firstName,
              lastName: data[0].lastName,
              fontIcon: data[0].fontIcon,
              useFontIcon: data[0].useFontIcon,
              iconData: data[0].iconData
            };
          }
        })
        .catch((error: any) => {
          Debug.errorSection('Load User Info', error);
        });

      sysGetUserSettings(UrlUtil.getCompanyId())
        .then((res: any) => {
          if (res) {
            const [companyId, depId, menuPath, lang, theme, alpha, headerHeight] = res.split('#');

            LoginInfo.lang = lang;
            LoginInfo.theme = theme;
            LoginInfo.alpha = alpha;
            LoginInfo.headerHeight = headerHeight;
            LoginInfo.companyId = companyId;
            LoginInfo.departmentId = depId;

            // load last theme
            document.querySelector('body').classList.add(LoginInfo.theme);
            applyAlphaColor(LoginInfo.alpha);

            initVueInstance();
          }
        })
        .catch((error) => {
          Debug.error(error);
        });
    })
    .catch((error: any) => {
      Debug.error(error);
      //logout(API.HOST_URL);
    });
};

const initApp = () => {
  const companyId = UrlUtil.getCompanyId();
  if (!companyId) {
    logout(API.HOST_URL);
  }
  sysGetLocaleResourceListByCompanyIdAndLocale(companyId, UrlUtil.getLanguage())
    .then((_: any) => {
      // get token from uri and set token for request header
      const href = window.location.href.replace('#', '');
      const url = new URL(href);
      let sessionId = url.searchParams.get('sessionId');
      sessionId = decodeURIComponent(sessionId).replace(/\r\n/g, '');

      if (sessionId !== 'null' && sessionId.includes(getBrowserID())) {
        setHeader(sessionId, url.searchParams.get('userId'));
        localStorage.setItem('userId', url.searchParams.get('userId'));
        localStorage.setItem('localeLanguage', url.searchParams.get('localeLanguage'));
        let companyId = url.searchParams.get('companyId');
        if (companyId) {
          if (companyId.includes('/')) {
            companyId = companyId.split('/')[0];
          }
          localStorage.setItem('companyId', companyId);
        }

        loginSuccess(sessionId);
        loadMenuAndUserSettings();
      } else {
        let savedToken = localStorage.getItem(Token.TOKEN_KEY);
        if (savedToken && savedToken.includes(getBrowserID())) {
          setHeader(localStorage.getItem(Token.TOKEN_KEY), localStorage.getItem('userId'));
          loginSuccess(localStorage.getItem(Token.TOKEN_KEY));
          loadMenuAndUserSettings();
        } else {
          logout(API.HOST_URL);
        }
      }
    })
    .catch((error: any) => {
      Debug.error('Load resource error. Exit app');
    });
};

initApp();
