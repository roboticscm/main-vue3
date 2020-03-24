import { ref, reactive, watch, inject, onMounted } from 'vue';
import { Debug } from '@/assets/js/debug';
import LanguageDropdown from '@/components/dropdown/language-dropdown/index.vue';
import CompanyDropdown from '@/components/owner-org/company-dropdown/index.vue';
import LangCategoryAuto from '@/components/autocomplete/lang-category-auto/index.vue';
import LangTypeGroupAuto from '@/components/autocomplete/lang-type-group-auto/index.vue';
import { Settings } from '@/types/base/system';
import UseView from '@/assets/js/composition/use-view';
import { SObject } from '@/assets/js/sobject';
import { markStringSearch } from '@/assets/js/util';
import CommonValidation from '@/assets/js/common-validation';
import { StringUtil } from '@/assets/js/string-util';
import { UrlUtil } from '@/assets/js/url-util';
import LanguageView from '@/modules/sys/language/index.vue';

export default {
  components: {
    LanguageDropdown,
    CompanyDropdown,
    LangCategoryAuto,
    LangTypeGroupAuto,
    LanguageView
  },
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  setup(props: any, context: any) {
    const langModalRef = ref(null);
    const languageDropdownRef = ref(null);
    const companyDropdownRef = ref(null);
    const langCategoryAutoRef = ref(null);
    const langTypeGroupAutoRef = ref(null);
    const languageGridRef = ref(null);
    const invRef = ref(null);
    const quickSearchRef = ref(null);
    const pageRef = ref(null);

    const { settingsStore, localeResourceStore } = inject('store');
    const { COMMON, SYS, T } = inject('locale');

    const useView = UseView.setup();
    const { viewState } = useView;
    const FROM = 1;
    const TO = 100;

    const state = reactive({
      columns: [],
      data: [],
      filteredData: [],
      beforeData: [],
      lang: [],
      height: '300px'
    });

    const init = () => {
      viewState.isReadOnlyMode = true;
      viewState.isUpdateMode = true;
      viewState.tableName = 'locale_resource';
      viewState.trashRestoreColumns = ['category', 'type_group', 'key', 'locale', 'value'];
    };
    init();

    localeResourceStore
      .sysGetAllLanguages(false, false)
      .then((lang: any) => {
        state.lang = lang;
        state.columns = lang.map((item: any) => {
          return {
            type: 'text',
            title: item.name,
            name: item.locale,
            width: 100
          };
        });

        state.columns.unshift({
          type: 'text',
          title: COMMON.LABEL.KEY || '#Key',
          name: 'key',
          width: 100
        });
        state.columns.unshift({
          type: 'text',
          title: COMMON.LABEL.TYPE_GROUP || '#Type Group',
          name: 'typeGroup',
          width: 100,
          readOnly: true
        });
        state.columns.unshift({
          type: 'text',
          title: COMMON.LABEL.CATEGORY || '#Category',
          name: 'category',
          width: 100,
          readOnly: true
        });
      })
      .catch((error: any) => {
        Debug.errorSection('sysGetAllLanguages', error);
      });

    const onApplyLanguage = () => {
      let obj = new Settings();
      obj.menuPath = 'system';
      obj.controlId = 'localeResourceId';
      obj.keys = ['lastLocaleResource'];
      obj.values = [languageDropdownRef.value.getSelectedId()];

      let href = new URL((window as any).location.href);
      settingsStore
        .saveOrUpdate(obj)
        .then((_) => {
          href.searchParams.set('localeLanguage', languageDropdownRef.value.getSelectedId());
          (window as any).location.href = href;
        })
        .catch((error) => Debug.error(error));
    };

    const onSearch = (event: any) => {
      const selectedCompanyId = companyDropdownRef.value && companyDropdownRef.value.getSelectedId();

      let selectedCategoryId = langCategoryAutoRef.value && langCategoryAutoRef.value.getSelectedId();
      const categoryText = langCategoryAutoRef.value && langCategoryAutoRef.value.getInputText();

      if (StringUtil.isEmpty(selectedCategoryId) && !StringUtil.isEmpty(categoryText)) {
        selectedCategoryId = categoryText;
      }
      let selectedTypeGroupId = langTypeGroupAutoRef.value && langTypeGroupAutoRef.value.getSelectedId();
      const typeGroupText = langTypeGroupAutoRef.value && langTypeGroupAutoRef.value.getInputText();

      if (StringUtil.isEmpty(selectedTypeGroupId) && !StringUtil.isEmpty(typeGroupText)) {
        selectedTypeGroupId = typeGroupText;
      }

      const textSearch = quickSearchRef.value && quickSearchRef.value.getTextSearch();
      viewState.loading = true;
      localeResourceStore
        .sysGetLocaleResourceByCompanyIdAndCatAndTypeGroup(
          selectedCompanyId,
          selectedCategoryId,
          selectedTypeGroupId,
          textSearch,
          viewState.page,
          viewState.pageSize
        )
        .then((res: any) => {
          // TODO
          viewState.totalRecords = res.fullCount;
          //transform locale into column and add index to distinct object
          const data = res.payload;

          data.map((item: any, index: number) => {
            item[item.locale] = item.value;
            item.index = index;
            delete item.value;
            return item;
          });

          // fill all missing locale value
          data.map((item: any) => {
            state.lang.map((l: any) => {
              // eslint-disable-next-line no-prototype-builtins
              if (!item.hasOwnProperty(l.locale)) {
                const filter = data.filter((d: any) => {
                  return (
                    d.category === item.category &&
                    d.typeGroup === item.typeGroup &&
                    d.key === item.key &&
                    d.locale === l.locale
                  );
                });
                if (filter.length > 0) {
                  item[l.locale] = filter[0][l.locale];
                }
              }
              return l;
            });
            delete item.locale;

            return item;
          });

          //recalculate index
          data.map((item: any) => {
            const filter = data.filter((d: any) => {
              return d.category === item.category && d.typeGroup === item.typeGroup && d.key === item.key;
            });

            filter.map((it: any) => {
              it.index = item.index;
            });
          });

          // distinct array object
          const distinctObj = Array.from(new Set(data.map((it: any) => it.index))).map((index) => {
            const ret = data.find((s) => s.index === index);
            delete ret.index;
            return ret;
          });

          state.data = distinctObj;
          // add blank row at the end
          state.data.push({});
          // state.filteredData = SObject.clone(state.data);
          doFilter(textSearch, SObject.clone(state.data));
          viewState.loading = false;
        })
        .catch((error: any) => {
          Debug.errorSection('Load Locale Resource List', error);
          viewState.loading = false;
        });
    };

    const onFilter = (textSearch: any) => {
      doFilter(textSearch, state.data);
    };

    const doFilter = (textSearch: string, source: any) => {
      if (textSearch.trim().length > source.length / 1000) {
        viewState.loading = true;
        setTimeout(() => {
          state.beforeData = SObject.clone(source);
          state.filteredData = state.filteredData.filter((item: any) => {
            const markedCategory = markStringSearch(item.category, textSearch, true);
            const markedTypeGroup = markStringSearch(item.typeGroup, textSearch, true);
            const markedKey = markStringSearch(item.key, textSearch, true);
            const markedVi = markStringSearch(item['vi-VN'], textSearch, true);
            const markedEn = markStringSearch(item['en-EN'], textSearch, true);
            if (
              markedCategory === item.category &&
              markedTypeGroup === item.typeGroup &&
              markedKey === item.key &&
              markedVi === item['vi-VN'] &&
              markedEn === item['en-EN']
            ) {
              return false;
            } else {
              if (markedCategory !== item.category) {
                item.category = markedCategory;
              }
              if (markedTypeGroup !== item.typeGroup) {
                item.typeGroup = markedTypeGroup;
              }

              if (markedKey !== item.key) {
                item.key = markedKey;
              }

              if (markedVi !== item['vi-VN']) {
                item['vi-VN'] = markedVi;
              }

              if (markedEn !== item['en-EN']) {
                item['en-EN'] = markedEn;
              }
              return true;
            }
          });

          viewState.loading = false;
          invRef.value.snackbarRef.show(state.filteredData.length + ' ' + (SYS.MSG.RECORD || '#Record(s)'));
        }, 0);
      } else if (textSearch.trim().length === 0) {
        viewState.loading = true;
        setTimeout(() => {
          state.filteredData = SObject.clone(source);
          viewState.loading = false;
        }, 0);
      }
    };

    // Method: onViewConfig
    // Purpose: show view config modal
    // This method is called when click View Config button
    const onViewConfig = (event: any) => {
      useView.showViewConfigModal(event.currentTarget.id, invRef);
    };

    // Method: onTrashRestore
    // Purpose: show trash restore modal
    // This method is called when click Trash Restore button
    const onTrashRestore = (event: any) => {
      useView.showTrashRestoreModal(event.currentTarget.id, invRef, () => {
        // after modal closed
        onSearch(null);
        useView.checkDeletedRecord(false);
      });
    };

    const doUpdate = () => {
      const beforeData = SObject.clone(state.beforeData.filter((it) => it.key.trim() !== ''));
      const editedData = languageGridRef.value.getData().filter((it) => it.key.trim() !== '');

      const changedData = useView.checkForNoDataChange2(beforeData, editedData, invRef.value.snackbarRef, [
        'category',
        'typeGroup',
        'key'
      ]);

      if (changedData === true) {
        viewState.isReadOnlyMode = true;
        onSearch(null);
        return;
      }

      viewState.loading = true;
      // convert column (lang locale) to row
      const convertedData = {
        addArray: convertLangLocaleToRow(changedData.addArray).filter((it) => it.value.trim() !== ''),
        editArray: mergeLangLocaleToRow(changedData.editFromArray, changedData.editToArray).filter(
          (it) => it.value.trim() !== it.newValue.trim()
        ),
        removeArray: convertLangLocaleToRow(changedData.removeArray).filter((it) => it.value.trim() !== '')
      };

      localeResourceStore
        .saveOrUpdateOrDelete(convertedData)
        .then((res: any) => {
          viewState.dataChange = false;
          viewState.loading = false;
          useView.checkDeletedRecord(false);
          viewState.isReadOnlyMode = true;
          onSearch(null);
        })
        .catch((error) => {
          viewState.loading = false;
        });
    };

    const convertLangLocaleToRow = (data) => {
      const ret = [];

      for (let row of data) {
        for (let lang of state.lang) {
          const newRow = {
            companyId: UrlUtil.getCompanyId(),
            category: row.category,
            typeGroup: row.typeGroup,
            key: row.key,
            locale: lang.locale,
            value: row[lang.locale]
          };
          ret.push(newRow);
        }
      }

      return ret;
    };

    const mergeLangLocaleToRow = (data1, data2) => {
      const ret = [];

      for (let i = 0; i < data1.length; i++) {
        for (let lang of state.lang) {
          const newRow = {
            companyId: UrlUtil.getCompanyId(),
            category: data1[i].category,
            typeGroup: data1[i].typeGroup,
            key: data1[i].key,
            locale: lang.locale,
            value: data1[i][lang.locale],
            newValue: data2[i][lang.locale]
          };
          ret.push(newRow);
        }
      }

      return ret;
    };

    // Method: onUpdate
    // Purpose: Update data
    // This method is called when click update button
    const onUpdate = (event: any) => {
      useView.verifyUpdateAction(event.currentTarget.id, invRef, () => {
        doUpdate();
      });
    };

    // Method: onEdit
    // Purpose: Set editable for all input
    // This method is called when click edit button
    const onEdit = (event: any) => {
      useView.verifyEditAction(event.currentTarget.id, invRef, () => {
        viewState.isReadOnlyMode = false;
        onSearch(null);
      });
    };

    // Method: onAddNew
    // Purpose: Insert some blank row
    // This method is called when click Add New button
    const onAddNew = (event: any) => {
      useView.verifyEditAction(event.currentTarget.id, invRef, () => {
        doAddNew();
      });
    };

    const doAddNew = () => {
      const selectedCategoryId = langCategoryAutoRef.value && langCategoryAutoRef.value.getSelectedId();
      const categoryText = langCategoryAutoRef.value.getInputText().trim();
      const selectedTypeGroupId = langTypeGroupAutoRef.value && langTypeGroupAutoRef.value.getSelectedId();
      const typeGroupText = langTypeGroupAutoRef.value.getInputText().trim();

      // if category is blank
      if (StringUtil.isEmpty(selectedCategoryId) && StringUtil.isEmpty(categoryText)) {
        invRef.value.snackbarRef.show(SYS.MSG.PLEASE_SELECT_LANG_CATEGORY || '#Please select language Category');
        langCategoryAutoRef.value.focus();
        return;
      } else if (StringUtil.isEmpty(selectedCategoryId)) {
        // if type group is blank
        if (StringUtil.isEmpty(selectedTypeGroupId) && StringUtil.isEmpty(typeGroupText)) {
          invRef.value.snackbarRef.show(SYS.MSG.PLEASE_SELECT_LANG_TYPE_GROUP || '#Please select language Type group');
          langTypeGroupAutoRef.value.focus();
          return;
        }
        // if type group not existed in DB
        let isContinue = true;
        invRef.value.confirmModalRef
          .show(
            `${T('SYS.MSG.LANG_CATEGORY')} <b>${categoryText}</b> ${T('SYS.MSG.DOES_NOT_EXISTED')}. ${T(
              'SYS.MSG.DO_YOU_WANT_INSERT_NEW_ONE'
            )}?`
          )
          .then((pressedButton: string) => {
            if (pressedButton === 'OK') {
              checkForTypeGroup(categoryText, selectedTypeGroupId, typeGroupText);
            }
          });
      } else {
        if (StringUtil.isEmpty(selectedTypeGroupId) && StringUtil.isEmpty(typeGroupText)) {
          invRef.value.snackbarRef.show(SYS.MSG.PLEASE_SELECT_LANG_TYPE_GROUP || '#Please select language Type group');
          langTypeGroupAutoRef.value.focus();
          return;
        }
        checkForTypeGroup(selectedCategoryId, selectedTypeGroupId, typeGroupText);
      }
    };
    const checkForTypeGroup = (selectedCategoryId: any, selectedTypeGroupId: any, typeGroupText) => {
      // if type group is blank
      if (StringUtil.isEmpty(selectedTypeGroupId)) {
        // if type group not existed in DB
        invRef.value.confirmModalRef
          .show(
            `${T('SYS.MSG.LANG_TYPE_GROUP')} <b>${typeGroupText}</b> ${T('SYS.MSG.DOES_NOT_EXISTED')}. ${T(
              'SYS.MSG.DO_YOU_WANT_INSERT_NEW_ONE'
            )}?`
          )
          .then((pressedButton: string) => {
            if (pressedButton === 'OK') {
              showInputModal(selectedCategoryId, typeGroupText);
            }
          });
      } else {
        // if Type group existed
        showInputModal(selectedCategoryId, selectedTypeGroupId);
      }
    };
    const showInputModal = (selectedCategoryId: any, selectedTypeGroupId: any) => {
      invRef.value.inputModalRef
        .show('number', COMMON.LABEL.NUM_ROW || '#Num Row', validateInput, 10)
        .then((pressedButton: any) => {
          if (pressedButton === 'OK') {
            for (let i = 0; i < invRef.value.inputModalRef.getInputValue(); i++) {
              languageGridRef.value.getGridInstance().insertRow([selectedCategoryId, selectedTypeGroupId], 0, true);
            }

            state.data = languageGridRef.value.getData();
          }
        });
    };
    const validateInput = () => {
      const isValid = CommonValidation.isIntegerInRange(invRef.value.inputModalRef.getInputValue(), FROM, TO);
      if (isValid) {
        return true;
      }

      return `${T(CommonValidation.INTEGER_NUMBER_IN_RANGE)}: ${FROM} - ${TO}`;
    };

    const onDropdownChange = (event) => {
      if (typeof event === 'string') {
        onSearch(null);
      } else {
        if ((event.target && StringUtil.isEmpty(event.target.value)) || event.target.id === 'companyDropdownId') {
          onSearch(null);
        }
      }
    };

    onMounted(() => {
      const ele: any = document.querySelector('#languageGridContainer');
      state.height = $(ele).height() - 31 + 'px';
      doLoad();
    });

    const doLoad = () => {
      const companyDropdownPromise = companyDropdownRef.value.loadData();
      const categoryPromise = langCategoryAutoRef.value.loadSettings();
      const typeGroupPromise = langTypeGroupAutoRef.value.loadSettings();
      const pagePromise = pageRef.value.loadSettings();
      Promise.all([companyDropdownPromise, typeGroupPromise, categoryPromise, pagePromise]).then((_) => {
        onSearch(null);
        useView.checkDeletedRecord(false);
      });
    };

    const onLangTableBeforeChange = (event) => {
      if (!viewState.dataChange) {
        state.beforeData = languageGridRef.value.getData();
        viewState.dataChange = true;
      }
    };

    const onLangTableBeforeDeleteRow = (event) => {
      if (!viewState.dataChange) {
        state.beforeData = languageGridRef.value.getData();
        viewState.dataChange = true;
      }
      return true;
    };

    const onLangTableUpdate = (event) => {
      setTimeout(() => {
        const x = Number(event.x);
        if (x > 1) {
          if (viewState.isReadOnlyMode) {
            event.cell.classList.add('readonly');
          } else {
            event.cell.classList.remove('readonly');
          }
        }
      });
    };

    const onLoadPage = (event) => {
      viewState.pageSize = event.pageSize;
      viewState.page = event.page;
      onSearch(null);
    };

    const onPaginationInit = (event) => {
      viewState.pageSize = event;
    };

    const onAddNewLang = (event) => {
      langModalRef.value.show();
    };
    return {
      state,
      props,

      invRef,
      langModalRef,
      languageGridRef,
      companyDropdownRef,
      langCategoryAutoRef,
      langTypeGroupAutoRef,
      languageDropdownRef,
      quickSearchRef,
      pageRef,

      onAddNew,
      onDropdownChange,
      onUpdate,
      onViewConfig,
      onTrashRestore,
      onApplyLanguage,
      onSearch,
      onFilter,
      onEdit,
      onLangTableBeforeChange,
      onLangTableBeforeDeleteRow,
      onLangTableUpdate,
      onLoadPage,
      onPaginationInit,
      onAddNewLang,

      ...useView,
      useView,
      COMMON,
      SYS,
      T
    };
  }
};
