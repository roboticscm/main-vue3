<template>
  <div class="template-wrapper">
    <view-title v-if="props.showTitle" :useView="useView"></view-title>
    <progress-bar :loading="viewState.loading"></progress-bar>
    <two-column-grid :id="getViewName()" :showTitle="props.showTitle">
      <template #viewLeft>
        <work-list :useView="useView"></work-list>
      </template>

      <template #viewContent>
        <suspense>
          <template #default>
            <main-content :useView="useView"></main-content>
          </template>
        </suspense>
        <!--
       <main-content :useView="useView"></main-content>
       -->
      </template>
    </two-column-grid>
  </div>
</template>

<script lang="ts" src="./index.ts">
export  default {}
</script>

<style lang="scss"></style>
