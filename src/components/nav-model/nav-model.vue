<template>
  <view class="nav-model">
    <view class="item nav-home {{nav_mask2&&navbar==1?'out2':''}} {{nav_mask&&navbar==0?'out':''}}">
      <span>商城首页</span>
      <navigator class="icox icox-homepage" open-type="switchTab" url="/pages/index/index"></navigator>
    </view>
    <view class="item nav-member {{nav_mask2&&navbar==1?'out2':''}} {{nav_mask&&navbar==0?'out':''}}" wx:if="{{limits}}">
      <span>个人中心</span>
      <navigator class="icox icox-people" open-type="switchTab" url="/pages/member/index/index"></navigator>
    </view>
    <view
      bindtap="favorite"
      class="item nav-collect {{nav_mask2&&navbar==1?'out2':''}} {{nav_mask&&navbar==0?'out':''}}"
      data-isfavorite="{{goods.isfavorite?1:0}}"
      wx:if="{{limits&&goods.customer==1}}"
    >
      <span>关注商品</span>
      <navigator class="icox {{goods.isfavorite?'icox-collection_fill':'icox-collection'}}"></navigator>
    </view>
    <view bindtap="nav" class="item nav {{nav_mask?'icox icox-close':''}}">
      <text wx:if="{{!nav_mask}}">快捷</text>
      <text wx:if="{{!nav_mask}}">导航</text>
    </view>
  </view>
</template>
<script lang="ts" setup></script>
<style lang="scss">
.nav-model .item {
  position: fixed;
  right: 20rpx;
  z-index: 999;
  font-size: 22rpx;
  color: #fff;
  transition: all 0.7s;
  bottom: 180rpx;
  opacity: 0;
}
</style>
