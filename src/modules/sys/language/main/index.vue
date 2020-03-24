<template>
  <div class="template-wrapper">
    {{ state.form }}
    <set-invisible-modal ref="invRef" :useView="useView"></set-invisible-modal>
    <div class="view-content-main">
      <form class="form" @keydown="state.form.errors.clear($event.target.name)">
        <div class="row ">
          <c>---------------------Name--------------------</c>
          <div class="col-xs-24 col-sm-8">
            <div class="row">
              <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">{{ T('COMMON.LABEL.NAME') }}:</div>
              <div class="col-sm-24 col-lg-16">
                <input
                  ref="nameRef"
                  id="name"
                  :disabled="viewState.isReadOnlyMode"
                  class="form-control"
                  type="text"
                  v-model="state.form.name"
                />
                <span class="error" v-if="state.form.errors.has('name')" v-text="state.form.errors.get('name')"></span>
              </div>
            </div>
          </div>
          <c>---------------------Name--------------------</c>

          <c>---------------------Locale--------------------</c>
          <div class="col-xs-24 col-sm-8 pl-xs-0 pl-sm-2 pl-md-0">
            <div class="row">
              <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">{{ T('SYS.LABEL.LOCALE') }}:</div>
              <div class="col-sm-24 col-lg-16">
                <input
                  :disabled="viewState.isReadOnlyMode"
                  id="locale"
                  class="form-control"
                  type="text"
                  v-model="state.form.locale"
                />
                <span
                  class="error"
                  v-if="state.form.errors.has('locale')"
                  v-text="state.form.errors.get('locale')"
                ></span>
              </div>
            </div>
          </div>
          <c>---------------------//Locale--------------------</c>

          <c>---------------------Sort--------------------</c>
          <div class="col-xs-24 col-sm-8">
            <div class="row">
              <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">{{ T('SYS.LABEL.SORT') }}:</div>
              <div class="col-sm-24 col-lg-16">
                <input
                  :disabled="viewState.isReadOnlyMode"
                  id="sort"
                  class="form-control"
                  type="number"
                  v-model="state.form.sort"
                />
                <span class="error" v-if="state.form.errors.has('sort')" v-text="state.form.errors.get('sort')"></span>
              </div>
            </div>
          </div>
          <c>---------------------//Sort--------------------</c>
        </div>
      </form>
    </div>

    <c>---------------------Controller--------------------</c>
    <div class="view-content-bottom">
      <add-new-button @click="onAddNew" :disabled="isDisabled('btnAddNew')" v-if="isRendered('btnAddNew')" />
      <save-button
        @click="onSaveOrUpdate"
        v-if="isRendered('btnSave', !viewState.isUpdateMode)"
        :running="viewState.saveRunning"
        :disabled="isDisabled('btnSave', state.form.errors.any())"
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
        :disabled="isDisabled('btnUpdate', state.form.errors.any())"
      />

      <delete-button
        @click="onDelete"
        v-if="isRendered('btnDelete', viewState.isUpdateMode)"
        :running="viewState.deleteRunning"
        :disabled="isDisabled('btnDelete')"
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
</template>

<script src="./index" lang="ts">
export default {};
</script>

<style lang="scss" scoped></style>
