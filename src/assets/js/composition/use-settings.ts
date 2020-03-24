import { ref, reactive, inject } from 'vue';

import { UrlUtil } from '@/assets/js/url-util';
import { Settings } from '@/types/base/system';
import { Debug } from '@/assets/js/debug';

export default {
  setup() {
    const { settingsStore } = inject('store');

    const saveSettings = (id: any, keys: any[], values: any[]) => {
      saveSettingsWithPath(UrlUtil.getMenuPathFromUrl(), id, keys, values);
    };

    const saveSettingsWithPath = (path: string, id: any, keys: any[], values: any[]) => {
      let obj = new Settings();
      obj.menuPath = path;
      obj.controlId = id;
      obj.keys = keys;
      obj.values = values;

      return new Promise((resolve, reject) => {
        settingsStore
          .saveOrUpdate(obj)
          .then((res: any) => {
            resolve(res);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    };

    const loadSettings = (id: any) => {
      return new Promise((resolve, reject) => {
        settingsStore
          .getUserSettings(UrlUtil.getMenuPathFromUrl(), id)
          .then((data: any) => {
            resolve(data);
          })
          .catch((error: any) => {
            Debug.errorSection('Settings ComAPI', error);
            reject(error);
          });
      });
    };

    return {
      saveSettings,
      saveSettingsWithPath,
      loadSettings
    };
  }
};
