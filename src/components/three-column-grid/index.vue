<template>
  <div class="view-container-3-col">
    <div class="view-left">
      <slot name="viewLeft"></slot>
    </div>
    <div class="left-grid-vertical-gutter"></div>
    <div class="view-content">
      <slot name="viewContent"></slot>
    </div>
    <div class="right-grid-vertical-gutter"></div>
    <div class="view-right">
      <slot name="viewRight"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import Split from 'split-grid';
import UseSettings from '@/assets/js/composition/use-settings';
import { GUTTER_WIDTH } from '@/assets/js/constants';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props: any) {
    const useSettings = UseSettings.setup();

    onMounted(() => {
      Split({
        columnGutters: [
          {
            track: 1,
            element: document.querySelector('.left-grid-vertical-gutter')
          },
          {
            track: 3,
            element: document.querySelector('.right-grid-vertical-gutter')
          }
        ],
        onDragEnd: (direction: any, track: number) => {
          const gridEle: any = document.querySelector('.view-container-3-col');
          const split = gridEle.style['grid-template-columns'].split(' ');
          const leftWidth = split[0];
          const rightWidth = split[split.length - 1];
          useSettings.saveSettings(
            `leftRight${props.id}`,
            ['lastLeftWidth', 'lastRightWidth'],
            [leftWidth, rightWidth]
          );
        }
      });

      // loadSettings
      useSettings.loadSettings(`leftRight${props.id}`).then((res: any) => {
        let leftWidth = '250px';
        let rightWidth = '150px';

        let filter = res.filter((it) => it.key === 'lastLeftWidth');
        if (filter.length > 0) {
          leftWidth = filter[0].value;
        }

        filter = res.filter((it) => it.key === 'lastRightWidth');
        if (filter.length > 0) {
          rightWidth = filter[0].value;
        }

        const containerEle: any = document.querySelector('.view-container-3-col');
        containerEle.style[
          'grid-template-columns'
        ] = `${leftWidth} ${GUTTER_WIDTH}px auto ${GUTTER_WIDTH}px ${rightWidth}`;
      });
    });
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
