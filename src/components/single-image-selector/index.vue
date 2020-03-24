<template>
  <div class="image-viewer image-hover" ref="imageViewerRef">
    <img @error="onImageError" class="image" ref="imageRef" :src="props.src" />
    <input style="display: none;" type="file" :id="props.imageViewerId" ref="fileRef" />
    <div class="overlap">
      <div class="overlap__content">
        <button type="button" class="btn-small-success" :disabled="props.disabled" @click="onSelectFile">
          <i class="fa fa-cloud-upload-alt"></i>
        </button>
        <button type="button" class="btn-small-danger" :disabled="props.disabled" @click="onClearImage">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
export default {
  setup(props: any, context: any) {
    const fileRef = ref(null);
    const imageRef = ref(null);
    const imageViewerRef = ref(null);

    const state = reactive({
      data: props.src
    });

    const onSelectFile = (event) => {
      event.preventDefault();
      fileRef.value.click();
    };
    const onClearImage = (event) => {
      event.preventDefault();
      imageRef.value.src = require('../../assets/images/no-image.png');
      state.data = null;
    };

    const onImageError = () => {
      imageRef.value.src = require('../../assets/images/no-image.png');
    };

    watch(
      () => state.data,
      (data) => {
        context.emit('imageChange', data);
      }
    );

    watch(
      () => props.src,
      (src) => {
        state.data = src;
      }
    );

    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) {
          imageViewerRef.value.classList.remove('image-hover');
        } else {
          imageViewerRef.value.classList.add('image-hover');
        }
        console.log(disabled);
      }
    );

    onMounted(() => {
      $(`#${props.imageViewerId}`).change(function(e) {
        for (var i = 0; i < (e.originalEvent.srcElement as any).files.length; i++) {
          const file = (e.originalEvent.srcElement as any).files[i];

          const reader = new FileReader();
          reader.onloadend = function() {
            imageRef.value.src = reader.result;
            state.data = imageRef.value.src;
          };
          reader.readAsDataURL(file);
        }
      });
    });

    return {
      imageViewerRef,
      onImageError,
      onSelectFile,
      onClearImage,
      imageRef,
      props,
      fileRef
    };
  }
};
</script>

<style lang="scss">
.image-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  border: $default-border;
  .image {
    width: 100%;
    height: 100%;
    display: block;
    background: url('../../assets/images/no-image.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .overlap {
    position: absolute;
    display: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0.9;
    background: gray;
    justify-content: center;
    align-items: center;
  }
}

.image-hover:hover .overlap {
  display: flex;
}
</style>
