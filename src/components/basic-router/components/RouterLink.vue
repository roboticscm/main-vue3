<template>
  <div class="nav-bar-item" :class="{ 'nav-bar-item__selected': props.selected }" @click="onNavigate($event, props.to)">
    <div :class="props.class">
      <slot></slot>
      <div>
        <slot name="icon"></slot>
      </div>
      <div>
        <a class="nav-bar-item__text" :href="props.to"><slot name="text"/></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, reactive } from 'vue';

export default {
  setup(props: any, context: any) {
    const onNavigate = (event: Event, to: string) => {
      event.preventDefault();
      // window.location.replace('#' + props.to);

      context.emit('click', props.to);
    };

    return {
      props,
      onNavigate
    };
  }
};
</script>

<style lang="scss"></style>
