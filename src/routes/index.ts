import AssignmentRole from '@/modules/sys/assignment-role/index.vue';
import RoleDetail from '@/modules/sys/role-detail/index.vue';
import LocaleResource from '@/modules/sys/locale-resource/index.vue';
import Menu from '@/modules/sys/menu/index.vue';
import Test from '@/modules/sys/test/index.vue';
import Language from '@/modules/sys/language/index.vue';

// const createDynRoute = (path: string, component: string) => {
//   return {
//     path: path,
//     name: path.replace('/', '_'),
//     component: () => import(component)
//   };
// };

const createRoute = (path: string, component: any) => {
  return {
    path: path,
    name: path.replace('/', '_'),
    component: component
  };
};

const Routes: any = {
  routes: [
    createRoute('/sys/assignment-role', AssignmentRole),
    // createDynRoute('/sys/assignment-role', '@/modules/sys/assignment-role/index.vue'),
    createRoute('/sys/role-detail', RoleDetail),
    createRoute('/sys/locale-resource', LocaleResource),
    createRoute('/sys/menu', Menu),
    createRoute('/sys/test', Test),
    createRoute('/sys/language', Language)
  ]
};

export default Routes;
