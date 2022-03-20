<template>
  <view class="container">
    <view class="operation">
      <view class="operation-left">
        <textarea
          class="textarea"
          placeholder="请友善交流"
          maxlength="2000"
          placeholder-class="phcolor-color"
          auto-focus
        />
      </view>
      <view class="operation-right">
        <view class="sumbit">发送</view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
</script>
<style lang="scss">
.container {
  .operation {
    width: 100%;
    height: 100rpx;
    overflow: hidden;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99999;
    padding-bottom: env(safe-area-inset-bottom);
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      border-top: 1rpx solid #eaeef1;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-top-width: 0.5px;
      border-top-style: solid;
      border-top-color: rgb(234, 238, 241);
    }
  }
}
</style>
