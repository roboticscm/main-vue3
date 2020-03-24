<template>
  <form @submit.prevent="onSearch()">
    <div class="search-text-field">
      <input
        @keyUp="onRealtimeSearch"
        type="text"
        class="form-control-search"
        v-model="state.textSearch"
        :placeholder="props.placeholder"
      />

      <button type="submit" class="form-control-search-button"><i class="fa fa-search"></i></button>
    </div>
  </form>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import LoginInfo from '@/assets/js/login-info';

export default {
  setup(props: any, context: any) {
    const state = reactive({
      textSearch: ''
    });
    let timeoutHandler = null;

    const onSearch = () => {
      context.emit('search', state.textSearch);
    };

    const onRealtimeSearch = () => {
      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
      }
      timeoutHandler = setTimeout(() => {
        context.emit('realtimeSearch', state.textSearch);
      }, LoginInfo.delayTyping);
    };

    const getTextSearch = () => {
      return state.textSearch;
    };
    return {
      state,
      props,
      onSearch,
      onRealtimeSearch,
      getTextSearch
    };
  }
};
</script>

<style lang="scss" scoped></style>
