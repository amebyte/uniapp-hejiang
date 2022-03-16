<template>
  <view class="container">
    <view class="cells">
      <textarea
        class="textarea"
        name="content"
        placeholder="发表你的内容..."
        maxlength="1000"
        placeholder-class="phcolor-color"
        auto-focus
      />
      <view class="textarea-counter">0/1000</view>
    </view>
    <view class="enclosure"></view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
</script>
<style lang="scss">
.container {
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .cells {
    border-radius: 4rpx;
    height: 280rpx;
    box-sizing: border-box;
    padding: 20rpx 20rpx 0 20rpx;
    position: relative;
    .textarea {
      height: 210rpx;
      width: 100%;
      color: #666;
      font-size: 28rpx;
    }
    .textarea-counter {
      font-size: 24rpx;
      color: #999;
      text-align: right;
      height: 40rpx;
      line-height: 40rpx;
      padding-top: 4rpx;
    }
  }
  .enclosure {
    display: flex;
    align-items: center;
    padding: 26rpx 10rpx;
    box-sizing: border-box;
  }
}
</style>
