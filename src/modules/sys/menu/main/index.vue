<template>
  <div class="template-wrapper">
    <set-invisible-modal ref="invRef" :useView="useView"></set-invisible-modal>
    <div class="view-content-main">
      <form class="form" @keydown="state.form.errors.clear($event.target.name)">
        <div class="row ">
          <div class="col-xs-24 col-lg-21">
            <div class="row">
              <c>---------------------Code--------------------</c>
              <div class="col-xs-24 col-sm-12">
                <div class="row">
                  <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">
                    {{ SYS.LABEL.CODE || `#Code` }}:
                  </div>
                  <div class="col-sm-24 col-lg-16">
                    <input
                      ref="codeRef"
                      id="code"
                      :disabled="viewState.isReadOnlyMode"
                      class="form-control"
                      type="text"
                      v-model="state.form.code"
                    />
                    <span
                      class="error"
                      v-if="state.form.errors.has('code')"
                      v-text="state.form.errors.get('code')"
                    ></span>
                  </div>
                </div>
              </div>
              <c>---------------------Code--------------------</c>

              <c>---------------------Name--------------------</c>
              <div class="col-xs-24 col-sm-12 pl-xs-0 pl-sm-2 pl-md-0">
                <div class="row">
                  <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">
                    {{ SYS.LABEL.NAME || `#Name` }}:
                  </div>
                  <div class="col-sm-24 col-lg-16">
                    <input
                      :disabled="viewState.isReadOnlyMode"
                      id="name"
                      class="form-control"
                      type="text"
                      v-model="state.form.name"
                    />
                    <span
                      class="error"
                      v-if="state.form.errors.has('name')"
                      v-text="state.form.errors.get('name')"
                    ></span>
                  </div>
                </div>
              </div>
              <c>---------------------//Name--------------------</c>
            </div>

            <div class="row">
              <c>---------------------Path--------------------</c>
              <div class="col-xs-24 col-sm-12">
                <div class="row">
                  <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">
                    {{ SYS.LABEL.PATH || `#Path` }}:
                  </div>
                  <div class="col-sm-24 col-lg-16">
                    <input
                      :disabled="viewState.isReadOnlyMode"
                      id="path"
                      class="form-control"
                      type="text"
                      v-model="state.form.path"
                    />
                    <span
                      class="error"
                      v-if="state.form.errors.has('path')"
                      v-text="state.form.errors.get('path')"
                    ></span>
                  </div>
                </div>
              </div>
              <c>---------------------//Path--------------------</c>

              <c>---------------------Font Icon--------------------</c>
              <div class="col-xs-24 col-sm-12 pl-xs-0 pl-sm-2 pl-md-0">
                <div class="row">
                  <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">
                    <input :disabled="viewState.isReadOnlyMode" type="checkbox" v-model="state.form.useFontIcon" />
                    {{ SYS.LABEL.FONT_ICON || `#Font Icon` }}:
                  </div>
                  <div class="col-sm-24 col-lg-14">
                    <input
                      :disabled="viewState.isReadOnlyMode"
                      class="form-control"
                      type="text"
                      v-model="state.form.fontIcon"
                    />
                  </div>

                  <div class="col-sm-24 col-lg-2 pl-md-0 pl-lg-1">
                    <span
                      class="menu-font-icon"
                      v-if="
                        state.form.fontIcon !== null && state.form.fontIcon !== undefined
                          ? state.form.fontIcon.includes('<')
                          : false
                      "
                      v-html="state.form.fontIcon"
                    ></span>
                  </div>
                </div>
              </div>
              <c>---------------------//Font Icon--------------------</c>
            </div>

            <div class="row">
              <c>---------------------Sort--------------------</c>
              <div class="col-xs-24 col-sm-12">
                <div class="row">
                  <div class="label text-sm-left text-xx-right col-sm-24 col-lg-8">
                    {{ SYS.LABEL.SORT || `#Sort` }}:
                  </div>
                  <div class="col-sm-24 col-lg-16">
                    <input
                      :disabled="viewState.isReadOnlyMode"
                      id="sort"
                      class="form-control"
                      type="number"
                      v-model="state.form.sort"
                    />
                    <span
                      class="error"
                      v-if="state.form.errors.has('sort')"
                      v-text="state.form.errors.get('sort')"
                    ></span>
                  </div>
                </div>
                <c>---------------------//Sort--------------------</c>
              </div>

              <c>---------------------Disabled--------------------</c>
              <div class="col-xs-24 col-sm-12 pl-xs-0 pl-sm-2 pl-md-0">
                <div class="row">
                  <div class="col-sm-24 col-lg-8"></div>
                  <div class="label col-sm-24 col-lg-16">
                    <input
                      :disabled="viewState.isReadOnlyMode"
                      id="disabled"
                      type="checkbox"
                      v-model="state.form.disabled"
                    />
                    {{ SYS.LABEL.DISABLED || `#Disabled` }}
                  </div>
                </div>
              </div>
              <c>---------------------//Disabled--------------------</c>
            </div>
          </div>

          <c>---------------------Image Selector--------------------</c>
          <div class="image-container col-xs-24 col-lg-3 mt-xs-0 mt-sm-6  mt-md-0">
            <single-image-selector
              imageViewerId="menuImageViewerId"
              :src="state.form.iconData"
              :disabled="viewState.isReadOnlyMode"
              @imageChange="onImageChange"
            >
            </single-image-selector>
          </div>
          <c>---------------------//Image Selector--------------------</c>
        </div>

        <c>---------------------Department Tree--------------------</c>
        <div class="row">
          <div class="default-border col-md-24 col-lg-12">
            <available-department-for-menu-tree-view
              ref="availableDepTreeRef"
              id="availableDepTreeId"
              :disabled="viewState.isReadOnlyMode"
            ></available-department-for-menu-tree-view>
          </div>
          <div class="default-border col-md-24 col-lg-12 pl-md-0 pl-lg-1 pt-md-1 pt-lg-0">
            <assigned-department-for-menu-tree-view
              ref="assignedDepTreeRef"
              id="assignedDepTreeId"
              :disabled="viewState.isReadOnlyMode"
            ></assigned-department-for-menu-tree-view>
          </div>
        </div>
        <c>---------------------//Deprtment Tree--------------------</c>
      </form>
    </div>

    <c>---------------------Controller--------------------</c>
    <div class="view-content-bottom">
      <add-new-button @click="onAddNew" :disabled="isDisabled('btnAddNew')" v-if="isRendered('btnAddNew')" />
      <save-button
        ref="btnSaveRef"
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

<style lang="scss" scoped>
.image-container {
  height: 100px;
}
.menu-font-icon {
  font-size: 1.6rem !important;
}
</style>
