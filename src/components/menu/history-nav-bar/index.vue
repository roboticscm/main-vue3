<template>
  <div class="main-nav-bar" style="margin-top: 5px;">
    <router-link
      class="tooltip"
      v-for="(menu, index) in state.historyMenus"
      :to="getPath(menu.path)"
      :selected="state.selectedItems[index]"
      :key="index"
      @click="onItemClick($event, menu.departmentId)"
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

      <template #default>
        <div class="left-top-tooltip-text-arrow">{{ menu.departmentName }}</div>
      </template>
    </router-link>
  </div>
</template>

<script lang="ts">
import { ref, reactive, inject, watch } from 'vue';
import { logout } from '@/assets/js/security';
import { API, Token, Net, Proxy } from '@/assets/js/constants';
import { UrlUtil } from '@/assets/js/url-util';
import LoginInfo from '@/assets/js/login-info';
import { Debug } from '@/assets/js/debug';
import { Settings } from '@/types/base/system';

export default {
  setup(props: any) {
    const state = reactive({
      historyMenus: [],
      selectedItems: []
    });

    const { menuStore, menuHistoryStore, loginInfoStore, settingsStore } = inject('store');
    const { COMMON } = inject('locale');

    const getPath = (path: string) => {
      return `/${path}`;
    };

    const onItemClick = (menuPath: string, departmentId: any) => {
      if (typeof menuPath !== 'string') {
        return;
      }
      menuPath = menuPath.startsWith('/') ? menuPath.slice(1) : menuPath;
      // save menu history first
      menuHistoryStore
        .saveOrUpdate({
          menuPath,
          departmentId
        })
        .then((_) => {
          // load view
          if (LoginInfo.departmentId != departmentId) {
            let obj = new Settings();
            obj.menuPath = 'system';
            obj.controlId = 'moduleId';
            obj.keys = ['lastDepartmentId'];
            obj.values = [departmentId + ''];
            settingsStore
              .saveOrUpdate(obj)
              .then((_: any) => {
                //reload
                UrlUtil.updateUrlHash(menuPath);
                location.reload();
              })
              .catch((error: any) => {
                console.error(error);
              });
          } else {
            UrlUtil.updateUrlHash(menuPath);
            menuStore.selectedMenuPath = menuPath;
          }
        });
    };

    const loadData = () => {
      //dep id is null, mean load all menu of all dep
      menuStore
        .sysGetRoledMenuListByUserIdAndDepId(null)
        .then((data: any) => {
          const selectedMenuPath = menuStore.selectedMenuPath.startsWith('/')
            ? menuStore.selectedMenuPath.slice(1)
            : menuStore.selectedMenuPath;
          data = data.filter((item) => {
            return (
              item.departmentId !== null &&
              (item.path !== selectedMenuPath ||
                (item.path === selectedMenuPath && item.departmentId != LoginInfo.departmentId))
            );
          });
          state.historyMenus = data.slice(0, Math.min(data.length, loginInfoStore.historyCount));
        })
        .catch((error: any) => {
          Debug.errorSection('History Nav Bar', error);
        });
    };

    watch(
      () => menuStore.selectedMenuPath,
      (menuPath: string) => {
        loadData();
      }
    );

    return {
      getPath,
      state,
      onItemClick,
      ...COMMON
    };
  }
};
</script>

<style lang="scss"></style>
