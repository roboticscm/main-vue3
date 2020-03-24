<template>
  <div class="view-title">
    <span
      v-if="loginInfoStore.selectedDepartment.depUseFontIcon"
      v-html="loginInfoStore.selectedDepartment.depFontIcon"
    >
    </span>
    <span v-else-if="loginInfoStore.selectedDepartment.depIconData">
      <img class="image" :src="loginInfoStore.selectedDepartment.depIconData" alt="" />
    </span>
    <span v-else>
      <i class="nav-bar-item__icon fa fa-bars"></i>
    </span>
    <span class="text">{{ ' ' + loginInfoStore.selectedDepartment.departmentName + ' \\ ' }} </span>

    <span v-if="loginInfoStore.selectedMenu.useFontIcon" v-html="loginInfoStore.selectedMenu.fontIcon"> </span>
    <span v-else-if="loginInfoStore.selectedMenu.iconData">
      <img class="image" :src="loginInfoStore.selectedMenu.iconData" alt="" />
    </span>
    <span v-else>
      <i class="nav-bar-item__icon fa fa-bars"></i>
    </span>
    <span class="text">{{ ' ' + getViewTitle() }} </span>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { inject } from 'vue';

export default {
  setup(props: any) {
    const { loginInfoStore } = inject('store');
    return {
      props,
      loginInfoStore,
      ...props.useView
    };
  }
};
</script>

<style lang="scss"></style>
