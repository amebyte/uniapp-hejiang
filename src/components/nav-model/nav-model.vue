<template>
  <view class="nav-model">
    <view class="item nav-home" :class="navMask ? 'out' : ''">
      <text class="desc">商城首页</text>
      <navigator class="navigator iconfont icon-home" open-type="switchTab" url="/pages/index/index"> </navigator>
    </view>
    <view class="item nav-member" :class="navMask ? 'out' : ''">
      <text class="desc">会员中心</text>
      <navigator class="navigator iconfont icon-member-empty" url="/pages/my/memberCenter"></navigator>
    </view>
    <view class="item nav-shopping-cart" :class="navMask ? 'out' : ''">
      <text class="desc">购物车</text>
      <navigator class="navigator iconfont icon-shopping-cart-mini" url="/pages/shopping-cart/index"></navigator>
    </view>
    <view class="item nav-btn" :class="navMask ? 'nav-btn-on' : ''" @click="navToggle">
      <text v-if="!navMask">快捷</text>
      <text v-if="!navMask">导航</text>
      <text v-if="navMask" class="iconfont icon-close-bold"></text>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
const navMask = ref(false)
const navToggle = () => {
  navMask.value = !navMask.value
}
</script>
<style lang="scss">
.nav-model {
  .item {
    position: fixed;
    right: 20rpx;
    z-index: 999;
    font-size: 22rpx;
    color: #fff;
    transition: all 0.7s;
    bottom: 180rpx;
    opacity: 0;
    .desc {
      display: none;
    }
    .navigator {
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      font-size: 66rpx;
      width: 84rpx;
      height: 84rpx;
      display: inline-block;
      text-align: center;
      line-height: 84rpx;
    }
    &.out {
      opacity: 1;
      transform: rotate(360deg);
    }
    &.nav-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 84rpx;
      height: 84rpx;
      border-radius: 50%;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.5);
      bottom: 180rpx;
      text-align: center;
      box-sizing: border-box;
      opacity: 1;
      z-index: 999;
      transition: none;
      text {
        display: block;
        line-height: 30rpx;
      }
    }
    &.nav-btn-on {
      background-color: #f55;
    }
    &.nav-home {
      bottom: 282rpx;
    }
    &.nav-member {
      bottom: 396rpx;
    }
    &.nav-shopping-cart {
      bottom: 510rpx;
    }
  }
}
</style>
