<template>
  <view class="load-bar">
    <view class="line"></view>
    <view class="txt">{{ txt }}</view>
    <view class="line"></view>
  </view>
</template>
<script setup lang="ts">
const props = defineProps({
  txt: { type: String, required: false },
  loading: { type: Boolean, required: false },
})
</script>
<style lang="scss">
.load-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  .line {
    width: 130rpx;
    height: 2rpx;
    background-color: #e9e9e9;
  }
  .txt {
    margin: 0 20rpx;
    font-size: 24rpx;
  }
}
</style>
