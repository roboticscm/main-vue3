import UseView from '@/assets/js/composition/use-view';
import WorkList from './work-list/index.vue';
import MainContent from './main/index.vue';
import { languageStore } from '@/modules/sys/language/store';

export default {
  components: {
    WorkList,
    MainContent
  },
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  setup: (props: any) => {
    const useView = UseView.setup();
    const { viewState } = useView;

    const init = () => {
      viewState.menuPath = 'sys/language';
      viewState.tableName = 'language';
      viewState.columns = ['id', 'name', 'locale'];
      viewState.orderBy = ['sort', 'name'];
      viewState.trashRestoreColumns = ['name'];
      viewState.loading = true;
    };
    const subscribe = () => {
      languageStore.complete$.subscribe((data) => {
        // console.log('completed.....', data)
        viewState.loading = false;
      });
    };

    init();
    subscribe();

    return {
      props,
      useView,
      ...useView
    };
  }
};
