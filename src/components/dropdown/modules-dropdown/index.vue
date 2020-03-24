<template>
  <div class="modules">
    <div>
      <div>
        <span class="modules__icon" v-if="state.selectedDep.depUseFontIcon" v-html="state.selectedDep.depFontIcon">
        </span>

        <span v-else-if="state.selectedDep.depIconData">
          <img class="modules__image" :src="state.selectedDep.depIconData" alt="" />
        </span>

        <span v-else class="modules__icon">
          <i class="fa fa-bars"></i>
        </span>
      </div>
      <div class="modules__text">{{ state.selectedDep.departmentName }}</div>
      <div class="modules__arrow">
        <i class="fa fa-angle-double-down"></i>
        <div class="right-dropdown-content">
          <a
            :class="{
              'dropdown-content__selected': isSelectedItem(module.departmentId),
              'a-disabled': isSelectedItem(module.departmentId)
            }"
            v-for="(module, index) in state.modules"
            :key="index"
            @click="onNavigate($event, module.departmentId)"
          >
            <span class="dropdown-item" v-if="module.depUseFontIcon" v-html="module.depFontIcon"> </span>

            <span v-else-if="module.depIconData" class="dropdown-item">
              <img :src="module.depIconData" alt="" />
            </span>

            <span v-else class="dropdown-item">
              <i class="nav-bar-item__icon fa fa-bars"></i>
            </span>

            <span class="more-text">
              {{ ` ${module.departmentName}` }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, inject } from 'vue';
import { Modules, Settings } from '@/types/base/system';
import LoginInfo from '@/assets/js/login-info';
import { UrlUtil } from '@/assets/js/url-util';

export default {
  setup(props: any) {
    const state = reactive({
      modules: [],
      selectedDep: {}
    });

    const { SYS } = inject('locale');
    const { orgStore, settingsStore, menuStore, loginInfoStore } = inject('store');

    const onNavigate = (event: Event, departmentId: any, url: string) => {
      let obj = new Settings();
      obj.menuPath = 'system';
      obj.controlId = props.moduleId;
      obj.keys = ['lastDepartmentId'];
      obj.values = [departmentId + ''];
      settingsStore
        .saveOrUpdate(obj)
        .then((_: any) => {
          // get last menu path of department
          menuStore.sysGetRoledMenuListByUserIdAndDepId(departmentId).then((data: any) => {
            if (data.length > 0) {
              UrlUtil.updateUrlHash(data[0].path);
              location.reload();
            }
          });
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    const isSelectedItem = (moduleId: string): boolean => {
      return LoginInfo.departmentId == moduleId;
    };

    const loadData = () => {
      orgStore
        .sysGetRoledDepartmentListByUserId()
        .then((data: any) => {
          state.modules = data;
          const filterDep = state.modules.filter((dep) => dep.departmentId == LoginInfo.departmentId);
          if (filterDep.length > 0) {
            state.selectedDep = filterDep[0];
            loginInfoStore.selectedDepartment = state.selectedDep;
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    loadData();

    return {
      state,
      isSelectedItem,
      loadData,
      props,
      onNavigate,
      SYS
    };
  }
};
</script>

<style lang="scss" scoped>
.a-disabled {
  pointer-events: none;
  cursor: default;
}
</style>
