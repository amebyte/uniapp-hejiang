<template>
  <view class="goods-curriculum-wrap">
    <view class="content">
      <view class="item">
        <view class="label"> 开课时间： </view>
        <view class="info">{{ goodsInfo.curriculum_start_time }} - {{ goodsInfo.curriculum_end_time }}</view>
      </view>
      <view class="item">
        <view class="label"> 开课地点： </view>
        <view class="info">
          <text class="txt">{{ goodsInfo.curriculum_address }}</text>
          <text class="nav-action" style="display: none">导航</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
const props = defineProps({
  goodsInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
</script>
<style scoped lang="scss">
.goods-curriculum-wrap {
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
        flex: 1;
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
