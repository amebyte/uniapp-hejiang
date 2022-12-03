<template>
  <view class="wrapper">
    <view class="box" @click="gotoMemberCenter">
      <view class="l">
        <view class="title">会员中心</view>
        <view class="desc">加入会员超多福利</view>
      </view>
      <view class="r">
        <image src="/static/images/skip/home-member.png" mode="scaleToFill"></image>
      </view>
    </view>
    <view class="box" @click="gotoShop">
      <view class="l">
        <view class="title">开卓商城</view>
        <view class="desc">不错过每一件精品</view>
      </view>
      <view class="r">
        <image src="/static/images/skip/home-shop.png" mode="scaleToFill"></image>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
const gotoMemberCenter = () => {
  uni.navigateTo({
    url: `/pages/my/memberCenter`,
  })
}
const gotoShop = () => {
  uni.switchTab({
    url: `/pages/goods/index`,
  })
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    height: 187rpx;
    background: linear-gradient(45deg, #cac531 0%, #f3f9a7 100%);
    box-shadow: 0px 5rpx 5rpx 0px rgba(29, 233, 182, 0.32);
    border-radius: 13rpx;
    margin-right: 40rpx;
    padding-left: 20rpx;
    .l {
      flex: 2;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 32rpx;
        color: #fff;
      }
      .desc {
        font-size: 20rpx;
        color: #fff;
        opacity: 0.8;
        padding-top: 10rpx;
      }
    }
    .r {
      flex: 1;
      image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
    }
    &:last-child {
      margin-right: 0;
      background: linear-gradient(45deg, #cac531 0%, #f3f9a7 100%);
      box-shadow: 0px 5px 5px 0px rgba(29, 233, 182, 0.32);
    }
  }
}
</style>
