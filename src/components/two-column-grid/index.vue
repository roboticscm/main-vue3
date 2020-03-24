<template>
  <div :class="{ 'view-container-2-col': props.showTitle, 'view-container-2-col-modal': !props.showTitle }">
    <div class="view-left">
      <slot name="viewLeft"></slot>
    </div>
    <div class="left-grid-vertical-gutter"></div>
    <div class="view-content">
      <slot name="viewContent"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import Split from 'split-grid';
import { applyLeftGutterState, leftCollapse } from './helper';
import UseSettings from '@/assets/js/composition/use-settings';
import { GUTTER_WIDTH } from '@/assets/js/constants';

// const delta = ((GUTTER_WIDTH / 2) * 100) / window.innerWidth;
// let lastLeftContentWidth = 20;
// let leftGutterMore = true;

export default {
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  setup(props: any) {
    const useSettings = UseSettings.setup();
    onMounted(() => {
      const contentSplit = Split({
        columnGutters: [
          {
            track: 1,
            element: document.querySelector('.left-grid-vertical-gutter')
          }
        ],
        onDragEnd: (direction: any, track: number) => {
          const gridEle: any = document.querySelector('.view-container-2-col');
          const [leftWidth] = gridEle.style['grid-template-columns'].split(' ');
          useSettings.saveSettings(`left${props.id}`, ['lastLeftWidth'], [leftWidth]);
        }
      });

      const divElement = document.createElement('div');
      divElement.id = 'leftGutter';
      divElement.classList.add('left-gutter-more');

      divElement.addEventListener('click', () => {
        // leftGutterMore = leftCollapse(contentSplit, leftGutterMore, lastLeftContentWidth, delta);
        // saveSettingsSplitState(props.is, contentSplit.getSizes());
      });

      document.querySelector('.left-grid-vertical-gutter').appendChild(divElement);

      // loadSettings
      useSettings.loadSettings(`left${props.id}`).then((res: any) => {
        const filter = res.filter((it) => it.key === 'lastLeftWidth');
        if (filter.length > 0) {
          const { value } = filter[0];
          const containerEle: any = document.querySelector('.view-container-2-col');
          containerEle.style['grid-template-columns'] = `${value} ${GUTTER_WIDTH}px auto`;
        }
      });
    });
    return {
      props
    };
  }
};
</script>

<style lang="scss">
/*
.left-grid-vertical-gutter {
  position: relative;
}
.left-gutter-more {
  cursor: pointer;
  border: calc(#{$horizontal-gutter-width} * 2 / 3) solid transparent;
  border-right-color: var(--primary);
  position: absolute;
  bottom: calc(50% - #{$horizontal-gutter-width});
  left: calc(50% - #{$horizontal-gutter-width});
}*/
</style>
