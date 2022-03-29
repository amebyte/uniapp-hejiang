<template>
  <view class="thumb">
    <view class="pictrue">
      <image :src="item.thumb"></image>
    </view>
    <view class="title">{{ item.title }}</view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})
</script>
<style lang="scss">
.thumb {
  height: 400upx;
  width: 344upx;
  border-radius: 12upx;
  margin-top: 14upx;
  background-color: #fff;
  overflow: hidden;
  &:nth-child(odd) {
    margin-right: 15upx;
  }
  .pictrue {
    width: 344upx;
    height: 344upx;
    position: relative;
    > image {
      width: 344upx;
      height: 344upx;
    }
  }
  .title {
    width: 100%;
    height: 54upx;
    line-height: 54upx;
    text-align: center;
    font-size: 28rpx;
  }
}
</style>
