<template>
  <view class="goods-specs-wrap">
    <view class="content">
      <view class="item">
        <view class="label"> 规格： </view>
        <view class="info">颜色-红色</view>
      </view>
      <view class="item">
        <view class="label"> 运费： </view>
        <view class="info">
          <text class="txt">¥：6</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.goods-specs-wrap {
  margin: 20rpx;
  .content {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-radius: 20rpx;
    .item {
      display: flex;
      justify-content: flex-start;
      font-size: 24rpx;
      padding: 20rpx;
      border-bottom: 2rpx solid #f5f3f3;
      .label {
        color: #5aefc9;
      }
      .info {
        flex: 4.5;
        color: #00796b;
        display: flex;
        justify-content: space-between;
        font-family: PingFang SC;
        font-weight: 600;
        .txt {
          padding-right: 10rpx;
        }
        .nav-action {
          background: #009688;
          border-radius: 7rpx;
          color: #fff;
          width: 67rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: 600;
          color: #fefefe;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
