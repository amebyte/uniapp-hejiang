<template>
  <view class="app-no-goods dir-top-nowrap main-center cross-center" :style="{ backgroundColor: background }">
    <image v-if="isImage === 0" class="icon" src="/static/images/no-goods.png"></image>
    <image v-else-if="isImage === 1" class="icon" src="/static/images/order-empty.png"></image>
    <text class="text" :style="{ color: color }">{{ title }}</text>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed, watch } from 'vue'
export default defineComponent({
  name: 'AppNoGoods',
  props: {
    background: {
      type: String,
      default() {
        return '#ffffff'
      },
    },
    color: {
      type: String,
      default() {
        return '#666666'
      },
    },
    title: {
      type: String,
      default() {
        return '没有任何商品哦~'
      },
    },
    isImage: {
      type: Number,
      default() {
        return 0
      },
    },
  },
})
</script>

<style scoped lang="scss">
.app-no-goods {
  width: 100%;
  height: #{400upx};
  .icon {
    width: #{240upx};
    height: #{240upx};
  }
  .text {
    font-size: #{24upx};
    line-height: 1;
    margin-top: #{25upx};
  }
}
</style>
