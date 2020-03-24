<template>
  <div ref="themeConfigModalWrapperRef" class="modal-wrapper">
    <div ref="themeConfigModalRef" :id="props.id" class="modal" @mouseup="onMouseUp">
      <div :id="props.id + 'header'" class="modal-header">
        <div class="modal-title">
          <div>
            <span><i class="fa fa-theater-masks"></i></span>
            {{ T('SYS.LABEL.THEME_CONFIG') }}
          </div>
        </div>
        <div>
          <close-modal-button @click="onCloseModal"></close-modal-button>
        </div>
      </div>
      <div class="modal-content-full">
        <excel-grid
          ref="excelGridRef"
          id="themeGridId"
          :columns="columns"
          :data="themeState.themes"
          :containerWidth="modalState.width"
          :fullWidth="true"
          @changed="onThemeChanged"
        >
          <template #label>
            <span class="label"> {{ T('SYS.LABEL.AVAILABLE_THEME') }}: </span></template
          >
        </excel-grid>
        <range-slider ref="rangeSliderRef" :max="MAX_STEP" @input="onSliderInput" :value="currentValue"></range-slider>
        <div class="label">
          <tabs :titleKeys="titleKeys" :activeKey="activeKey" :saveState="true" @change="onTabChange" ref="tabsRef">
            <template #tab1>
              <div id="tab1" class="tab-content">
                Tab1 content
              </div>
            </template>

            <template #tab2>
              <div id="tab2" class="tab-content">
                Tab2 content
              </div>
            </template>

            <template #tab3>
              <div id="tab3" class="tab-content">
                Tab3 content
              </div>
            </template>
          </tabs>
        </div>
        <div class="modal-controller">
          <ok-button @click="onOk"></ok-button>
          <cancel-button @click="onCancel"></cancel-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, inject, onUnmounted, computed } from 'vue';
import { Settings } from '@/types/base/system';
import { Window } from '@/assets/js/window';
import Form from '@/assets/js/form/form';
import { getMethodNameInSnackCase } from '@/assets/js/util';
import UseModal from '../use-modal';
import UseThemeConfig from './use-theme-config';
import UseSettings from '@/assets/js/composition/use-settings';
import jexcel from 'jexcel';
import { Debug } from '@/assets/js/debug';
import Color from '@/assets/js/color';
import { UserSettings } from '@/store/settings';
import { getThemeColors } from './helper';
import LoginInfo from '@/assets/js/login-info';

export default {
  setup(props: any, context: any) {
    const MAX_STEP = 100;
    const themeConfigModalRef = ref(null);
    const themeConfigModalWrapperRef = ref(null);
    const excelGridRef = ref(null);
    const rangeSliderRef = ref(null);
    const tabsRef = ref(null);
    const { settingsStore } = inject('store');
    const { T } = inject('locale');
    const useModal = UseModal.setup(props, context, themeConfigModalRef);
    const useThemeConfig = UseThemeConfig.setup();
    const useSettings = UseSettings.setup();

    let beforeColor = [];
    let alpha = 1;

    const titleKeys = ['tab1', 'tab2', 'tab3'];
    const activeKey = 'tab2';

    const currentValue = computed(() => {
      return LoginInfo.alpha * MAX_STEP;
    });

    const show = async () => {
      return new Promise((resolve, reject) => {
        themeConfigModalWrapperRef.value && themeConfigModalWrapperRef.value.classList.add('show-modal');
        useModal.modalState.resolve = resolve;
      });
    };

    const onCloseModal = () => {
      useModal.closeModal(themeConfigModalWrapperRef, 'CLOSE');
    };

    const onCancel = () => {
      applyTheme(LoginInfo.theme);
      useThemeConfig.loadData();
      useModal.closeModal(themeConfigModalWrapperRef, 'CANCEL');
    };

    const onOk = () => {
      const selectedTheme = excelGridRef.value.getData().filter((item: any) => item.choose === true)[0].key;

      applyTheme(selectedTheme);

      Color.applyApha(beforeColor, alpha);

      useSettings
        .saveSettingsWithPath('sys/theme', 'themeId', ['lastTheme', 'lastAlpha'], [selectedTheme, alpha])
        .then((res: any) => {
          useModal.closeModal(themeConfigModalWrapperRef, 'OK');
        })
        .catch((error) => {
          Debug.errorSection('SaveSettings Theme', error);
        });
    };

    const onSliderInput = (event: any) => {
      alpha = Number(event) / MAX_STEP;

      beforeColor = getThemeColors();
      Color.applyApha(beforeColor, alpha);
    };

    const onThemeChanged = (event: any) => {
      const selectedRow = Number(event.y);
      applyTheme(useThemeConfig.themeState.themes[selectedRow].key);
      rangeSliderRef.value.setValue(MAX_STEP);
    };

    const applyTheme = (theme: string) => {
      const body: any = document.querySelector('body');
      body.className = '';
      body.style = '';
      // add new theme
      if (theme !== 'theme-green') {
        body.classList.add(theme);
      }
    };

    const onTabChange = (event: any) => {};

    return {
      onTabChange,
      onThemeChanged,
      onCancel,
      onSliderInput,
      onOk,
      show,
      onCloseModal,
      props,
      themeConfigModalRef,
      themeConfigModalWrapperRef,
      rangeSliderRef,
      ...useModal,
      ...useThemeConfig,
      ...useSettings,
      excelGridRef,
      tabsRef,
      T,
      MAX_STEP,
      currentValue,
      titleKeys,
      activeKey
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  text-align: left;
}
</style>
