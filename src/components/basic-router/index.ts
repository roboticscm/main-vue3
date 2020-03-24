import { App, Component } from 'vue';
import * as Components from './components';

let routes: any[] = [];

function install(vue: App, options: any) {
  for (const [name, component] of Object.entries(Components)) {
    vue.component(name, component as Component);
  }

  routes = options.routes;
}

interface Router {
  push(path: string): void;
}

function useRoutes(): any[] {
  return routes;
}

function useRouter() {
  const router: Router = {
    push: (path: string) => {
      window.location.replace('#' + path);
    }
  };

  return {
    router
  };
}

export default install;

export { install, useRoutes, useRouter };
