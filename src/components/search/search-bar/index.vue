<template>
  <div class="search-bar-wrapper">
    <input
      ref="inputRef"
      class="form-control"
      @keyup="onSearch"
      type="text"
      v-model="state.textSearch"
      :placeholder="props.placeholder"
    />
    <i class="fa fa-search" @click="onSearch"></i>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';

export default {
  setup(props: any, context: any) {
    const inputRef = ref(null);
    const state = reactive({
      textSearch: ''
    });
    let timeoutHandler = null;

    const onSearch = (event) => {
      inputRef.value.focus();
      if (event.code === 'Enter' || event.type === 'click') {
        context.emit('search', state.textSearch);
      }
    };

    return {
      state,
      props,
      onSearch,
      inputRef
    };
  }
};
</script>

<style lang="scss"></style>
