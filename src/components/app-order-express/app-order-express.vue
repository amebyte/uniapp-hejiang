<template>
  <view class="app-order-express">
    <view class="e-box dir-left-nowrap cross-center">
      <view class="dir-top-nowrap box-grow-1">
        <view class="express-name">快递公司: {{ express }}</view>
        <view style="margin-bottom: 15rpx">快递单号: {{ expressNo }}</view>
        <view v-if="merchantRemark">商家物流留言: {{ merchantRemark }}</view>
      </view>
      <image class="box-grow-0 img" src="/static/image/icon/arrow-right.png"></image>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed, watch } from 'vue'
export default defineComponent({
  name: 'AppOrderExpress',
  props: {
    express: {
      type: String,
      default: '',
    },
    expressNo: {
      type: String,
      default: '',
    },
    pageUrl: {
      type: String,
      default: '',
    },
    merchantRemark: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="scss">
.e-box {
  width: 100%;
}

.e-box .img {
  width: 12rpx;
  height: 24rpx;
}

.e-box .express-name {
  margin-bottom: 15rpx;
}
</style>
