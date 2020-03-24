<template>
  <component :is="currentComponent" />
</template>

<script lang="ts">
import { computed, reactive, inject } from 'vue';
import { onMounted } from 'vue';
import { useRoutes } from '../';
import { checkLogin } from '@/assets/js/security';
import { API } from '@/assets/js/constants';
import View404 from '@/view/404/index.vue';
import { Settings } from '@/types/base/system';
import LoginInfo from '@/assets/js/login-info';

export default {
  name: 'RouterView',
  setup() {
    const { menuStore, settingsStore, menuHistoryStore } = inject('store');

    const routes = useRoutes();

    const current = reactive({
      path: window.location.hash ? window.location.hash.replace('#', '') : '*'
    });

    const currentComponent = computed(() => {
      checkLogin(API.HOST_URL);

      if (menuStore.hasMenu(current.path.startsWith('/') ? current.path.slice(1) : current.path)) {
        let route = routes.find((route) => route.path === current.path);

        const saveMenuPath = current.path.startsWith('/') ? current.path.slice(1) : current.path;

        if (route) {
          let obj = new Settings();
          obj.menuPath = 'system';
          obj.controlId = 'mainNavBarId';
          obj.keys = ['lastMenuPath'];
          obj.values = [saveMenuPath];
          settingsStore.saveOrUpdate(obj);
          // menuHistoryStore
          //   .saveOrUpdate({
          //     menuPath: saveMenuPath,
          //     departmentId: LoginInfo.departmentId
          //   })
          //   .then((_) => {
          //     console.log('saved menu history');
          //   });

          return route.component;
        } else {
          return null;
        }
      } else {
        return View404;
      }
    });

    onMounted(() => {
      window.addEventListener('popstate', (event) => {
        const hash = window.location.hash;
        current.path = hash ? hash.replace('#', '') : '*';
      });
    });

    return {
      current,
      currentComponent
    };
  }
};
</script>
