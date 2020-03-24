<template>
  <div class="main-nav-bar">
    <router-link
      v-for="(menu, index) in state.viewableMenus"
      :to="getPath(menu.path)"
      :selected="state.selectedItems[index]"
      :key="menu.menuId"
      @click="onItemClick"
    >
      <template #icon>
        <span v-if="menu.useFontIcon" v-html="menu.fontIcon"> </span>
        <span v-else-if="menu.iconData">
          <img class="main-nav-bar__image" :src="menu.iconData" alt="" />
        </span>
        <span v-else>
          <i class="nav-bar-item__icon fa fa-bars"></i>
        </span>
      </template>
      <template #text>
        <span class="text">{{ MENU[menu.menuName] || `#${menu.menuName}` }}</span>
      </template>
    </router-link>

    <div v-if="state.moreMenus.length > 0" class="nav-bar-item">
      <div class="more-dropdown-container" @mouseOver.stop="showPopup" @mouseOut="hidePopup">
        <div>
          <i class="nav-bar-item__icon fa fa-angle-double-down"></i>
        </div>
        <div>...</div>
        <div id="moreNavBarDropdown" class="dropdown-content">
          <a v-for="(menu, index) in state.moreMenus" :key="index" @click.stop="onMoreItemClick(menu.path)">
            <span class="dropdown-item" v-if="menu.useFontIcon" v-html="menu.fontIcon"> </span>

            <span v-else-if="menu.iconData" class="dropdown-item">
              <img :src="menu.iconData" alt="" />
            </span>

            <span v-else class="dropdown-item">
              <i class="fa fa-bars"></i>
            </span>

            <span class="more-text">
              {{ ' ' + (MENU[menu.menuName] || '#' + menu.menuName) }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, inject, watch } from 'vue';
import { UrlUtil } from '@/assets/js/url-util';
import LoginInfo from '@/assets/js/login-info';
import { Debug } from '@/assets/js/debug';

export default {
  setup(props: any) {
    const state = reactive({
      menus: [],
      viewableMenus: [],
      moreMenus: [],
      selectedItems: []
    });

    const { menuStore, menuHistoryStore, loginInfoStore } = inject('store');
    const { COMMON } = inject('locale');

    const loadData = (depId: any, selectFirstItem: boolean) => {
      return new Promise((resolve, reject) => {
        menuStore
          .sysGetRoledMenuListByUserIdAndDepId(depId)
          .then((data: any) => {
            state.menus = data;
            if (state.menus.length > LoginInfo.viewableMenuItem) {
              state.viewableMenus = data.slice(0, LoginInfo.viewableMenuItem);
              state.moreMenus = data.slice(LoginInfo.viewableMenuItem);
            } else {
              state.viewableMenus = state.menus;
              state.moreMenus = [];
            }

            //get selected item from url for the first time
            if (selectFirstItem && state.menus.length > 0) {
              UrlUtil.updateUrlHash(state.menus[0].path);
              loginInfoStore.selectedMenu = state.menus[0];
              selectMenuItem('/' + UrlUtil.getMenuPathFromUrl(), true);
            }
            if (state.menus.length > 0) {
              menuStore.selectedMenuPath = state.menus[0].path;
            }

            resolve('ok');
          })
          .catch((error: any) => {
            Debug.errorSection('Main Nav Bar', error);
            reject(error);
          });
      });
    };

    const getPath = (path: string) => {
      return `/${path}`;
    };

    const selectMenuItem = (menuPath: string, replaceHash: boolean) => {
      state.selectedItems.fill(false);
      let index = -1;
      for (let i = 0; i < state.menus.length; i++) {
        if ('/' + state.menus[i].path === menuPath) {
          index = i;
          break;
        }
      }

      if (index >= 0) {
        state.selectedItems[index] = true;
        loginInfoStore.selectedMenu = state.menus[index];
      }
      if (replaceHash === true) {
        window.location.replace('#' + menuPath);
      }
    };

    const onItemClick = (menuPath: string) => {
      // save menu history first
      if (typeof menuPath !== 'string') {
        return;
      }
      menuHistoryStore
        .saveOrUpdate({
          menuPath: menuPath.startsWith('/') ? menuPath.slice(1) : menuPath,
          departmentId: LoginInfo.departmentId
        })
        .then((_) => {
          // load history menu
          loadData(LoginInfo.departmentId, false).then((_) => {
            selectMenuItem(menuPath, true);
          });
        });
    };

    watch(
      () => menuStore.selectedMenuPath,
      (menuPath: string) => {
        selectMenuItem('/' + menuPath, false);
      }
    );

    const onMoreItemClick = (menuPath: any) => {
      hidePopup();
      onItemClick('/' + menuPath);
    };

    const showPopup = () => {
      (document.querySelector('#moreNavBarDropdown') as any).classList.add('show-dropdown');
    };

    const hidePopup = () => {
      (document.querySelector('#moreNavBarDropdown') as any).classList.remove('show-dropdown');
    };

    loadData(LoginInfo.departmentId, true);
    return {
      onMoreItemClick,
      getPath,
      loadData,
      // getUrl,
      state,
      onItemClick,
      ...COMMON,
      showPopup,
      hidePopup
    };
  }
};
</script>

<style lang="scss">
.more-dropdown-container {
  padding-left: $default-padding;
  padding-right: $default-padding;
}

.dropdown-context-text {
  line-height: var(--large-icon-size);
  font-size: 0.8rem;
}
</style>
