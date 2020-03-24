<template>
  <div class="three-col-view">
    <div class="three-col-view__left">
      <div class="three-col-view__left__inner">
        <slot name="left">
          Default Left
        </slot>
      </div>
    </div>
    <div class="three-col-view__center">
      <div class="three-col-view__center__inner">
        <slot name="center">
          Default Center
        </slot>
      </div>
    </div>
    <div class="three-col-view__right">
      <div class="three-col-view__right__inner">
        <slot name="right">
          Default Right
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Split from 'split.js';
import { onMounted } from 'vue';

import { applyLeftGutterState, leftCollapse, applyRightGutterState, rightCollapse } from './helper';

const GUTTER_WIDTH = 18; //pixel
const delta = ((GUTTER_WIDTH / 2) * 100) / window.innerWidth;

let lastLeftContentWidth = 20;
let lastRightContentWidth = 20;

let leftGutterMore = true;
let rightGutterMore = false;

const saveSettingsSplitState = (localStorageKey: string, sizes: any) => {
  localStorage.setItem(localStorageKey, JSON.stringify(sizes));
};
export default {
  setup(props: any) {
    onMounted(() => {
      const savedSizes: any = localStorage.getItem(props.localStorageKey);
      let sizes = [20, 80, 0]; // default size
      if (savedSizes) {
        sizes = JSON.parse(savedSizes);
      }
      let contentSplit = Split(['.three-col-view__left', '.three-col-view__center', '.three-col-view__right'], {
        gutterSize: GUTTER_WIDTH,
        sizes: sizes,
        minSize: [0, 0, 0],
        onDragEnd: function(sizes: any) {
          if (sizes[0] > delta * 2) {
            lastLeftContentWidth = sizes[0];
          }
          if (sizes[sizes.length - 1] > delta * 2) {
            lastRightContentWidth = sizes[sizes.length - 1];
          }
          saveSettingsSplitState(props.localStorageKey, sizes);
          leftGutterMore = sizes[0] <= 2 * delta;
          applyLeftGutterState(leftGutterMore);
          rightGutterMore = sizes[sizes.length - 1] <= 2 * delta;
          applyRightGutterState(rightGutterMore);
        }
      });
      document.querySelector('.three-col-view__left + div').innerHTML =
        '<div id="insideLeftGutter" class="inside-left-gutter-more"></div>';
      (document.querySelector('#insideLeftGutter') as any).onclick = () => {
        leftGutterMore = leftCollapse(contentSplit, leftGutterMore, lastLeftContentWidth, delta);
        saveSettingsSplitState(props.localStorageKey, contentSplit.getSizes());
      };
      document.querySelector('.three-col-view__center + div').innerHTML =
        '<div id="insideRightGutter" class="inside-right-gutter-more"></div>';
      (document.querySelector('#insideRightGutter') as any).onclick = () => {
        rightGutterMore = rightCollapse(contentSplit, rightGutterMore, lastRightContentWidth, delta);
        saveSettingsSplitState(props.localStorageKey, contentSplit.getSizes());
      };
      if (sizes[0] <= delta * 2) {
        leftGutterMore = true;
        applyLeftGutterState(leftGutterMore);
      }
      if (sizes[sizes.length - 1] > delta * 2) {
        rightGutterMore = false;
        applyRightGutterState(rightGutterMore);
      }
    });
    return {};
  }
};
</script>

<style lang="scss">
.three-col-view {
  display: flex;
  height: 100%;
  &__left {
    overflow: auto;
    &__inner {
      padding: $default_padding;
      padding-bottom: $footer-height;
    }
  }

  &__center {
    overflow: auto;
    &__inner {
      padding: $default_padding;
      padding-bottom: $footer-height;
    }
  }
  &__right {
    overflow: auto;
    &__inner {
      padding: $default_padding;
      padding-bottom: $footer-height;
    }
  }
}

// Colors
$bg-color: $bg-primary;
$dot-color: $bg-tertiary;

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
    border-right-color: $primary;
    position: absolute;
    bottom: calc(50% - 10px);
    left: calc(50% - 15px);
  }
  .inside-left-gutter-less {
    cursor: pointer;
    display: block;
    border: 10px solid transparent;
    border-left-color: $primary;
    position: absolute;
    bottom: calc(50% - 10px);
    left: calc(50% - 5px);
  }

  .inside-right-gutter-more {
    cursor: pointer;
    display: block;
    border: 10px solid transparent;
    border-right-color: $primary;
    position: absolute;
    bottom: calc(50% - 10px);
    left: calc(50% - 15px);
  }
  .inside-right-gutter-less {
    cursor: pointer;
    display: block;
    border: 10px solid transparent;
    border-left-color: $primary;
    position: absolute;
    bottom: calc(50% - 10px);
    left: calc(50% - 5px);
  }
}
</style>
