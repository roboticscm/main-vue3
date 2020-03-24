<template>
  <div class="template-wrapper" style="display: flex; align-items: center;">
    <theme-config-modal ref="themeConfigModalRef" id="themeConfigModalId"> </theme-config-modal>
    <div class="user-profiles" @mouseOver.stop="showPopup" @mouseOut="hidePopup">
      <span v-if="user.useFontIcon" v-html="user.fontIcon" class="user-profiles__icon"> </span>
      <span v-else-if="user.iconData">
        <img class="user-profiles__img" :src="user.iconData" :alt="user.username" />
      </span>
      <span v-else class="user-profiles__icon">
        <i class="fa fa-camera"> </i>
      </span>
      <div id="userProfilesDropdown" class="right-dropdown-content">
        <div class="user-profiles__fullname">{{ ` ${user.username} - ${user.lastName} ${user.firstName}` }}</div>
        <a @click.stop="showUserProfiles()" class="dropdown-item"
          ><i class="fa fa-file-invoice"></i> {{ T('SYS.MENU.USER_PROFILES') }}</a
        >
        <a href="#" @click="doLogout()" class="dropdown-item"
          ><i class="fa fa-sign-out-alt"></i> {{ T('SYS.MENU.LOGOUT') }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, inject } from 'vue';
import { logout } from '@/assets/js/security';
import { API } from '@/assets/js/constants';
import LoginInfo from '@/assets/js/login-info';

import ThemeConfigModal from '@/components/modal/theme-config-modal/index.vue';

export default {
  components: {
    ThemeConfigModal
  },
  setup(props: any) {
    const themeConfigModalRef = ref(null);
    const { T } = inject('locale');

    const doLogout = () => {
      logout(API.HOST_URL);
    };

    const showUserProfiles = () => {
      hidePopup();
      themeConfigModalRef.value.show();
    };
    const showPopup = () => {
      (document.querySelector('#userProfilesDropdown') as any).classList.add('show-dropdown');
    };

    const hidePopup = () => {
      (document.querySelector('#userProfilesDropdown') as any).classList.remove('show-dropdown');
    };
    return {
      showPopup,
      hidePopup,
      doLogout,
      showUserProfiles,
      T,
      themeConfigModalRef,
      ...LoginInfo
    };
  }
};
</script>

<style lang="scss"></style>
