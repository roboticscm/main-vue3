<template>
  <div class="template-wrapper">
    <view-title v-if="props.showTitle" :useView="useView" icon="<i class='fa fa-cog'></i>"></view-title>
    <div class="view-container">
      <c>---------------------Invisible Component--------------------</c>
      <set-invisible-modal ref="invRef" :saveStateInputModal="true" :useView="useView"></set-invisible-modal>
      <view-wrapper-modal id="langModalId" ref="langModalRef">
        <template #content>
          <language-view :showTitle="false"> </language-view>
        </template>
      </view-wrapper-modal>
      <c>---------------------//Invisible Component--------------------</c>
      <div class="view-content">
        <div class="view-content-main">
          <c>---------------------Change language--------------------</c>
          <div class="row">
            <div class="col-xs-24 col-md-12 col-lg-7">
              <div class="row">
                <div class="label col-xs-24 sm-12 col-lg-10 text-xs-left text-xx-right">
                  {{ COMMON.LABEL.LANGUAGE || '#Language' }}:
                </div>
                <div class="col-xs-24 sm-12 col-lg-14">
                  <language-dropdown ref="languageDropdownRef"></language-dropdown>
                </div>
              </div>
            </div>
            <div class="col-xs-24 col-md-12 col-lg-3">
              <apply-button class="full-width" @click="onApplyLanguage"></apply-button>
            </div>
          </div>
          <c>---------------------//Change Language--------------------</c>
          <div class="row">
            <c>---------------------Company--------------------</c>
            <div class="col-xs-24 col-md-8 col-lg-7">
              <div class="row">
                <div class="label col-md-24 col-lg-10 text-md-left  text-xx-right">
                  {{ COMMON.LABEL.COMPANY || `#Company` }}:
                </div>
                <div class="col-md-24 col-lg-14">
                  <company-dropdown
                    ref="companyDropdownRef"
                    :saveState="true"
                    @change="onDropdownChange"
                  ></company-dropdown>
                </div>
              </div>
            </div>
            <c>---------------------//Company--------------------</c>

            <c>---------------------Category--------------------</c>
            <div class="col-xs-24 col-md-8 col-lg-7 pl-xs-0 pl-md-1 pl-lg-0">
              <div class="row">
                <div class="label col-md-24 col-lg-10 text-md-left  text-xx-right">
                  {{ COMMON.LABEL.CATEGORY || `#Category` }}:
                </div>
                <div class="col-md-24 col-lg-14">
                  <lang-category-auto
                    ref="langCategoryAutoRef"
                    :saveState="true"
                    @change="onDropdownChange"
                  ></lang-category-auto>
                </div>
              </div>
            </div>
            <c>---------------------//Category--------------------</c>

            <c>---------------------Type Group--------------------</c>
            <div class="col-xs-24 col-md-8 col-lg-7 pl-xs-0 pl-md-1 pl-lg-0">
              <div class="row">
                <div class="label col-md-24 col-lg-10 text-md-left  text-xx-right">
                  {{ T('COMMON.LABEL.TYPE_GROUP') }}:
                </div>
                <div class="col-md-24 col-lg-14">
                  <lang-type-group-auto ref="langTypeGroupAutoRef" :saveState="true" @change="onDropdownChange">
                  </lang-type-group-auto>
                </div>
              </div>
            </div>
            <c>---------------------//Type Group--------------------</c>

            <c>---------------------Search or Filter--------------------</c>
            <div class="col-md-24 col-lg-3">
              <quick-search
                ref="quickSearchRef"
                @search="onSearch"
                @realtimeSearch="onFilter"
                :placeholder="T('COMMON.LABEL.FILTER') + '...'"
              ></quick-search>
            </div>
            <c>---------------------//Search or Filter--------------------</c>
          </div>
          <c>---------------------Language Grid--------------------</c>
          <div
            id="languageGridContainer"
            class="row"
            :class="{ 'language-grid': viewState.totalRecords > 0, 'full-language-grid': viewState.totalRecords === 0 }"
          >
            <div class="col-24">
              <excel-grid
                id="languageGridId"
                ref="languageGridRef"
                :columns="state.columns"
                :data="state.filteredData"
                :fullWidth="true"
                :height="state.height"
                @beforeChange="onLangTableBeforeChange"
                @beforeDeleteRow="onLangTableBeforeDeleteRow"
                @updateTable="onLangTableUpdate"
              >
                <template #label></template>
              </excel-grid>
            </div>
          </div>
          <c>---------------------//Language Grid--------------------</c>

          <c>---------------------Pagination--------------------</c>
          <div class="row">
            <div class="col-24">
              <pagination
                ref="pageRef"
                @init="onPaginationInit"
                @loadPage="onLoadPage"
                :totalRecords="viewState.totalRecords"
                :smallSize="false"
              >
              </pagination>
            </div>
          </div>
          <c>---------------------//Pagination--------------------</c>
        </div>

        <c>---------------------Controller--------------------</c>
        <div class="view-content-bottom">
          <add-new-button @click="onAddNew" :disabled="isDisabled('btnAddNew')" v-if="isRendered('btnAddNew')" />

          <add-new-button
            id="btnAddNew2"
            class="btn-success"
            :label="T('SYS.BUTTON.ADD_LANGUAGE')"
            @click="onAddNewLang"
            :disabled="isDisabled('btnAddNew2')"
            v-if="isRendered('btnAddNew2')"
          />

          <edit-button
            @click="onEdit"
            v-if="isRendered('btnEdit', viewState.isReadOnlyMode && viewState.isUpdateMode)"
            :disabled="isDisabled('btnUpdate')"
          />
          <update-button
            @click="onUpdate"
            v-if="isRendered('btnUpdate', !viewState.isReadOnlyMode && viewState.isUpdateMode)"
            :running="viewState.saveRunning"
            :disabled="isDisabled('btnUpdate')"
          />

          <config-button @click="onViewConfig" v-if="isRendered('btnConfig')" :disabled="isDisabled('btnConfig')" />

          <trash-restore-button
            @click="onTrashRestore"
            v-if="isRendered('btnTrashRestore', viewState.hasAnyDeletedRecord)"
            :disabled="isDisabled('btnTrashRestore')"
          />
        </div>
        <c>---------------------//Controller--------------------</c>
      </div>
    </div>
  </div>
</template>

<script src="./index" lang="ts">
export default {};
</script>

<style lang="scss" scoped>
#languageGridContainer {
  border: $default-border;
  width: 100%;
}
.language-grid {
  height: calc(100% - 2.2rem * 2 - #{$footer_height});
}
.full-language-grid {
  /*overflow: auto;*/
  height: calc(100% - 2.2rem * 2 - 10px);
}
</style>
