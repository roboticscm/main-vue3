<template>
  <div v-if="props.loading" class="progress-bar">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</template>

<script lang="ts">
import { watch } from 'vue';

export default {
  setup(props: any) {
    watch(
      () => props.loading,
      (loading: boolean) => {
        if (loading) {
          const iEle: any = document.querySelector('.progress-bar i');
          iEle.style.fontSize = props.fontSize ? props.fontSize : '4rem';
        }
      }
    );

    return { props };
  }
};
</script>

<style lang="scss">
.progress-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: $highest-z-index;
  i {
    font-size: 4rem;
    color: var(--bg-primary);
  }
}
</style>
