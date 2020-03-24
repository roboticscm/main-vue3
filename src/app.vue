<template>
  <main-layout>
    <template #header>
      <div class="header-left">
        <branch-dropdown></branch-dropdown>
        <main-nav-bar></main-nav-bar>
      </div>

      <div v-if="loginInfoStore.showSearchBar" class="header-center full-width">
        <search-bar
          :placeholder="T('SYS.MSG.WHAT_ARE_YOU_THINKING_ABOUT') + '?'"
          @search="onGeneralSearch"
        ></search-bar>
      </div>

      <div class="header-right">
        <history-nav-bar
          v-if="loginInfoStore.showHistoryNavBar"
        ></history-nav-bar>
        <div class="seperator"></div>
        <modules-dropdown moduleId="moduleId"> </modules-dropdown>
        <user-profiles></user-profiles>
      </div>
    </template>

    <template #content>
      <router-view />
    </template>
  </main-layout>
</template>

<script lang="ts">
import { onMounted, inject } from "vue";
import MainNavBar from "@/components/menu/main-nav-bar/index.vue";
import HistoryNavBar from "@/components/menu/history-nav-bar/index.vue";
import BranchDropdown from "@/components/dropdown/branch-dropdown/index.vue";
import ModulesDropdown from "@/components/dropdown/modules-dropdown/index.vue";
import UserProfiles from "@/components/user-profiles/index.vue";

export default {
  components: {
    MainNavBar,
    HistoryNavBar,
    BranchDropdown,
    ModulesDropdown,
    UserProfiles
  },
  setup: () => {
    const { T } = inject("locale");
    const { loginInfoStore } = inject("store");
    onMounted(() => {
      const viewRouterEle = document.querySelector(".layout-content > div");
      (viewRouterEle as any).style.height = "100%";
    });

    const onGeneralSearch = event => {
      console.log(event);
    };
    return {
      T,
      loginInfoStore,
      onGeneralSearch
    };
  }
};
</script>

<style lang="scss">
.header-left {
  display: flex;
  justify-content: start;
}

.header-center {
  padding: 0 $default-padding;
  width: 100%;
  display: flex;
}

.header-right {
  display: flex;
  justify-content: end;
}
</style>
