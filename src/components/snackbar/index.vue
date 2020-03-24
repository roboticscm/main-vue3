<template>
  <div class="snackbar" id="snackbar" ref="snackbarRef">{{ state.msg }}</div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { UserSettings } from '@/store/settings';
import { SYS } from '@/assets/js/locale/locale';

export default {
  setup(props: any) {
    const snackbarRef = ref(null);
    const state = reactive({
      msg: null
    });

    const show = (msg) => {
      state.msg = msg;
      snackbarRef.value.className = 'show-snackbar';
      setTimeout(() => {
        snackbarRef.value.classList.remove('show-snackbar');
      }, UserSettings.snackbarTimeout);
    };
    const showSaveSuccess = () => {
      show(SYS.MSG.SAVE_SUCCESS || '#SYS.MSG.SAVE_SUCCESS');
    };
    const showUpdateSuccess = () => {
      show(SYS.MSG.SAVE_SUCCESS || '#SYS.MSG.UPDATE_SUCCESS');
    };
    const showDeleteSuccess = () => {
      show(SYS.MSG.SAVE_SUCCESS || '#SYS.MSG.DELETE_SUCCESS');
    };
    const showNoDataChange = () => {
      show(SYS.MSG.SAVE_SUCCESS || '#SYS.MSG.NO_DATA_CHANGE');
    };
    return {
      state,
      props,
      show,
      snackbarRef,
      showSaveSuccess,
      showUpdateSuccess,
      showDeleteSuccess,
      showNoDataChange
    };
  }
};
</script>

<style lang="scss">
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
  border: $default-border;
  border-radius: $default-border-radius;
}

#snackbar.show-snackbar {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 3s;
  animation: fadein 0.5s, fadeout 0.5s 3s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
