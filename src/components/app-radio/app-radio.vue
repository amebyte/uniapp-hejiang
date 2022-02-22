<template>
  <view class="app-default" :style="{ width: `${width}rpx`, height: `${height}rpx` }" @click.stop="radioSelection">
    <text v-if="modelValue" class="iconfont icon-radio-checked"></text>
    <text v-else class="iconfont icon-radio-uncheck"></text>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onUnload, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
export default defineComponent({
  name: 'AppRadio',
  props: {
    type: {
      type: String,
      default: 'round',
    },
    theme: {
      type: Object || String,
      default: () => {
        return {}
      },
    },
    modelValue: {
      type: Boolean,
      default: () => false,
    },
    width: {
      type: String,
      default: '40',
    },
    height: {
      type: String,
      default: '40',
    },
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
    sign: {
      type: String,
      default: null,
    },
    borderColor: {
      type: String,
      default: '#cccccc',
    },
  },
  emits: ['update:modelValue', 'click'],
  setup(props, { emit }) {
    let active = ref(props.modelValue)
    const radioSelection = () => {
      active.value = !active.value
      emit('update:modelValue', { active: active.value, item: props.sign })
      emit('click', { active: active.value, item: props.item })
    }

    return {
      radioSelection,
    }
  },
})
</script>

<style lang="scss">
@import '@/static/css/variable.scss';
.app-default {
  position: relative;
  .iconfont {
    color: $theme-font-color;
  }
}
</style>
