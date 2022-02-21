<template>
  <view class="app-default" :style="{ width: `${width}rpx`, height: `${height}rpx` }" @click.stop="radioSelection">
    <view
      v-if="modelValue"
      styke
      class="app-default-active"
      :style="{ 'background-color': sign ? '' : theme.background }"
      :class="[{ 'round-active': type === 'round' }, sign ? theme + '-background' : '', theme]"
    ></view>
    <view
      v-if="!modelValue"
      class="app-default-border"
      :class="{ 'round-border': type === 'round' }"
      :style="{
        borderColor: borderColor,
      }"
    ></view>
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
.round-active {
  border-radius: 50%;
}

.round-border {
  border-radius: 50%;
}

.app-default {
  position: relative;
}

.app-default-active {
  position: absolute;
  background-image: url('../../../static/image/icon/yes-radio.png');
  background-size: 100% 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-repeat: no-repeat;
  width: #{40rpx};
  height: #{40rpx};
}

.app-default-border {
  position: absolute;
  border: #{2rpx} solid #cccccc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: #{40rpx};
  height: #{40rpx};
}
</style>
