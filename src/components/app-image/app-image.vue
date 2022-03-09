<template>
  <view v-if="imgSrc" class="app-image" :style="appBackground">
    <image
      v-if="is_loading"
      src="/static/icon/image/loading-img.png"
      class="img"
      :class="is_error ? '' : 'default'"
      mode="aspectFill"
      lazy-load
      :style="imgStyle"
    ></image>
    <image
      v-if="!is_error"
      :src="imgSrc"
      class="img"
      :mode="mode"
      lazy-load
      :style="imgStyle"
      @error="imgError"
      @load="imgLoad"
    ></image>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs, watch } from 'vue'
export default defineComponent({
  name: 'AppImage',
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: () => {
        return 'aspectFill'
      },
    },
    borderRadius: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const state = reactive({
      is_loading: true,
      is_error: false,
    })

    const appBackground = computed(() => `width: ${props.width};height: ${props.height};`)
    const imgStyle = computed(() => `border-radius: ${props.borderRadius}`)

    const imgError = () => {
      state.is_error = true
    }
    const imgLoad = () => {
      state.is_loading = false
    }

    return {
      ...toRefs(state),
      appBackground,
      imgStyle,
      imgError,
      imgLoad,
    }
  },
})
</script>

<style scoped lang="scss">
.app-image {
  display: block;
  position: relative;
  .img {
    width: 100%;
    height: 100%;
    display: block;
    will-change: transform;

    &.default {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
    }
  }
}
</style>
