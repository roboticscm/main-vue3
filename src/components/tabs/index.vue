<template>
  <div class="tabs-container">
    <div class="tabs">
      <div>
        <button
          :id="`btn_${key}`"
          v-for="(key, index) in props.titleKeys"
          :key="index"
          @click="openTab($event, key)"
          class="tab-links"
        >
          {{ key }}
        </button>
      </div>
      <div>
        <toggle-button ref="btnToggleTabViewRef" @click="toggleTabView"></toggle-button>
      </div>
    </div>
    <div class="tab-view">
      <slot v-for="(key, index) in props.titleKeys" :key="index" :name="key"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, reactive } from 'vue';
import UseSettings from '@/assets/js/composition/use-settings';

export default {
  setup(props: any, context: any) {
    const btnToggleTabViewRef = ref(null);

    const useSettings = UseSettings.setup();

    const state = reactive({
      activeKey: props.activeKey
    });

    const openTab = (event, tabKey) => {
      const tabContent: any = document.querySelectorAll('.tab-content');
      for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
      }
      const tabLinks = document.querySelectorAll('.tab-links');
      for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(' active', '');
      }

      const currentTab: any = document.querySelector(`#${tabKey}`);
      currentTab.style.display = 'block';
      event.currentTarget.className += ' active';

      if (props.saveState === true) {
        useSettings.saveSettings('activeTabKeyId', ['activeTabKey'], [tabKey]);
      }

      state.activeKey = tabKey;
      context.emit('change', state.activeKey);
    };

    onMounted(() => {
      if (props.saveState === true) {
        // load toggle tab view settings
        useSettings.loadSettings('tabViewToggleId').then((data: any) => {
          if (data.length > 0) {
            const savedMode = Boolean(JSON.parse(data[0].value));
            btnToggleTabViewRef.value.setValue(savedMode);
          }
        });

        // load active tab settings
        useSettings.loadSettings('activeTabKeyId').then((data: any) => {
          if (data.length > 0) {
            const savedActiveTabKey = data[0].value;
            if (savedActiveTabKey) {
              (document.querySelector(`#btn_${savedActiveTabKey}`) as any).click();
              return;
            }
          }
        });
      }

      (document.querySelector(`#btn_${props.activeKey}`) as any).click();
    });

    const toggleTabView = (event) => {
      if (typeof event !== 'boolean') {
        return;
      }

      const tabViewEle: any = document.querySelector('.tab-view');

      if (event === true) {
        tabViewEle.style.display = 'none';
      } else {
        tabViewEle.style.display = 'block';
      }

      if (props.saveState === true) {
        useSettings.saveSettings('tabViewToggleId', ['tabViewToggle'], [`${event}`]);
      }
    };

    const getActiveIndex = () => {
      for (let i = 0; i < props.titleKeys.length; i++) {
        if (props.titleKeys[i] === state.activeKey) {
          return i;
        }
      }
      return -1;
    };

    const getActiveTitleKey = () => {
      return state.activeKey;
    };

    return {
      props,
      state,
      openTab,
      toggleTabView,
      btnToggleTabViewRef,
      getActiveTitleKey,
      getActiveIndex
    };
  }
};
</script>

<style lang="scss">
.tabs {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  display: flex;
  justify-content: space-between;
}

/* Style the buttons inside the tab */
.tabs button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
}

/* Change background color of buttons on hover */
.tabs button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tabs button.active {
  background-color: #ccc;
}

.tab-content {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}

.tabs-container {
  border: $default-border;
}
</style>
