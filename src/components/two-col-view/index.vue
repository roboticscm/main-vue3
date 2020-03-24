<template>
  <div class="view-container two-col-view ">
    <div class="two-col-view__left">
      <div class="two-col-view__left__inner">
        <slot name="left">
          Default Left
        </slot>
      </div>
    </div>
    <div class="two-col-view__right">
      <div class="two-col-view__right__inner">
        <slot name="right">
          Default Center
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Split from 'split.js';
import { onMounted } from 'vue';

import { applyLeftGutterState, leftCollapse } from './helper';

const GUTTER_WIDTH = 16; //pixel
const delta = ((GUTTER_WIDTH / 2) * 100) / window.innerWidth;

let lastLeftContentWidth = 20;

let leftGutterMore = true;

const saveSettingsSplitState = (localStorageKey: string, sizes: any) => {
  localStorage.setItem(localStorageKey, JSON.stringify(sizes));
};
export default {
  setup(props: any) {
    onMounted(() => {
      const savedSizes: any = localStorage.getItem(props.localStorageKey);
      let sizes = [20, 80]; // default size
      if (savedSizes) {
        sizes = JSON.parse(savedSizes);
      }
      let contentSplit = Split(['.two-col-view__left', '.two-col-view__right'], {
        gutterSize: GUTTER_WIDTH,
        sizes: sizes,
        minSize: [0, 0],
        onDragEnd: function(sizes: any) {
          if (sizes[0] > delta * 2) {
            lastLeftContentWidth = sizes[0];
          }

          saveSettingsSplitState(props.localStorageKey, sizes);
          leftGutterMore = sizes[0] <= 2 * delta;
          applyLeftGutterState(leftGutterMore);
        }
      });
      document.querySelector('.two-col-view__left + div').innerHTML =
        '<div id="insideLeftGutter" class="inside-left-gutter-more"></div>';
      (document.querySelector('#insideLeftGutter') as any).onclick = () => {
        leftGutterMore = leftCollapse(contentSplit, leftGutterMore, lastLeftContentWidth, delta);
        saveSettingsSplitState(props.localStorageKey, contentSplit.getSizes());
      };

      if (sizes[0] <= delta * 2) {
        leftGutterMore = true;
        applyLeftGutterState(leftGutterMore);
      }
    });
    return {};
  }
};
</script>

<style lang="scss">
.two-col-view {
  display: flex;
  overflow: auto;
  &__left {
    overflow: auto;
    height: 100%;
    &__inner {
      height: 100%;
    }
  }

  &__right {
    overflow: auto;
    height: 100%;
    &__inner {
      height: 100%;
    }
  }
}

// Colors
$bg-color: var(--bg-primary);
$dot-color: var(--bg-tertiary);

// Dimensions
$dot-size: 2px;
$dot-space: 5px;

.gutter {
  position: relative;
  background: linear-gradient(90deg, $bg-color ($dot-space - $dot-size), transparent 1%) center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center, $dot-color;
  background-size: $dot-space $dot-space;

  cursor: col-resize;

  .inside-left-gutter-more {
    cursor: pointer;
    display: block;
    border: 10px solid transparent;
    border-right-color: var(--primary);
    position: absolute;
    bottom: calc(50% - 10px);
    left: calc(50% - 15px);
  }
  .inside-left-gutter-less {
    cursor: pointer;
    display: block;
    border: 10px solid transparent;
    border-left-color: var(--primary);
    position: absolute;
    bottom: calc(50% - 10px);
    left: calc(50% - 5px);
  }
}
</style>
