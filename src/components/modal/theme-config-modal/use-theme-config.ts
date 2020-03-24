import { inject, reactive, onMounted } from 'vue';
import { UserSettings } from '@/store/settings';
import LoginInfo from '@/assets/js/login-info';

export default {
  setup() {
    const { T } = inject('locale');
    const columns = [
      {
        type: 'hidden',
        name: 'key'
      },
      {
        type: 'text',
        title: T('COMMON.LABEL.THEME'),
        name: 'theme',
        width: 120,
        readOnly: true
      },
      {
        type: 'color',
        title: T('COMMON.LABEL.PREVIEW'),
        name: 'preview',
        width: 120,
        readOnly: true,
        render: 'square'
      },
      {
        type: 'radio',
        title: T('COMMON.LABEL.CHOOSE'),
        name: 'choose',
        width: 80
      }
    ];

    const themeState = reactive({
      themes: []
    });

    const loadData = () => {
      themeState.themes = [
        {
          key: 'theme-red',
          theme: T('COMMON.COLOR.RED'),
          preview: '#FF0000',
          choose: LoginInfo.theme === 'theme-red'
        },
        {
          key: 'theme-green',
          theme: T('COMMON.COLOR.GREEN'),
          preview: '#1b5e20',
          choose: LoginInfo.theme === 'theme-green'
        },
        {
          key: 'theme-blue',
          theme: T('COMMON.COLOR.BLUE'),
          preview: '#0000FF',
          choose: LoginInfo.theme === 'theme-blue'
        },
        {
          key: 'theme-pink',
          theme: T('COMMON.COLOR.PINK'),
          preview: '#880e4f',
          choose: LoginInfo.theme === 'theme-pink'
        },
        {
          key: 'theme-brown',
          theme: T('COMMON.COLOR.BROWN'),
          preview: '#3e2723',
          choose: LoginInfo.theme === 'theme-brown'
        },
        {
          key: 'theme-dark',
          theme: T('COMMON.COLOR.DARK'),
          preview: '#212121',
          choose: LoginInfo.theme === 'theme-dark'
        },
        {
          key: 'theme-purple',
          theme: T('COMMON.COLOR.PURPLE'),
          preview: '#6a1b9a',
          choose: LoginInfo.theme === 'theme-purple'
        },
        {
          key: 'theme-orange',
          theme: T('COMMON.COLOR.ORANGE'),
          preview: '#e65100',
          choose: LoginInfo.theme === 'theme-orange'
        }
      ];
    };

    loadData();
    return {
      themeState,
      columns,
      T,
      loadData
    };
  }
};
