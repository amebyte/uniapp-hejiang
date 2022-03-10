<template>
  <view class="teacher-wrap">
    <view class="content">
      <view class="title">授课老师</view>
      <view class="list">
        <view v-for="(item, index) in goodsInfo.curriculum_content" :key="index" class="item">
          <view class="l">
            <image :src="item.thumb" mode="scaleToFill"></image>
          </view>
          <view class="r">
            <view class="name">{{ item.name }}</view>
            <view class="desc">{{ item.info }}</view>
          </view>
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
<style lang="scss">
@import '@/static/css/variable.scss';
.teacher-wrap {
  margin-left: 20rpx;
  margin-right: 20rpx;
  .content {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-radius: 20rpx;
    .title {
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #00796b;
      letter-spacing: 4rpx;
      padding-left: 20rpx;
      padding-top: 30rpx;
    }
    .list {
      min-height: 200rpx;
      .item {
        display: flex;
        justify-content: flex-start;
        padding: 30rpx 20rpx;
        border-bottom: 2rpx solid #f5f3f3;
        > .l {
          image {
            width: 100rpx;
            height: 100rpx;
            border-radius: 7rpx;
          }
        }
        > .r {
          padding-left: 20rpx;
          .name {
            font-size: 32rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #00796b;
            padding-bottom: 20rpx;
            @extend .line1;
          }
          .desc {
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #b7b7b7;
            @extend .line1;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
