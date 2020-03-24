<template>
  <div class="layout-container">
    <div class="layout-header">
      <slot name="header">Header Section</slot>
    </div>
    <div class="layout-horizontal-gutter"></div>
    <div class="layout-content">
      <slot name="content">Content Section</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import Split from 'split-grid';
import UseSettings from '@/assets/js/composition/use-settings';
import { applyLayout } from './helper';
import LoginInfo from '@/assets/js/login-info';

export default {
  setup() {
    const useSettings = UseSettings.setup();
    onMounted(() => {
      Split({
        rowGutters: [
          {
            track: 1,
            element: document.querySelector('.layout-horizontal-gutter')
          }
        ],
        onDrag: (direction: any, track: number, gridTemplateStyle: string) => {
          applyLayout();
        },
        onDragEnd: (direction: any, track: number) => {
          const gridEle: any = document.querySelector('.layout-container');
          const [headerHeight] = gridEle.style['grid-template-rows'].split(' ');
          useSettings.saveSettingsWithPath('sys/main-layout', 'mainLayoutId', ['lastHeaderHeight'], [headerHeight]);
        }
      });

      // apply main layout - header height
      const gridEle: any = document.querySelector('.layout-container');
      gridEle.style['grid-template-rows'] = `${LoginInfo.headerHeight} 2px auto`;
      applyLayout();
    });
    return {};
  }
};
</script>

<style lang="scss"></style>
