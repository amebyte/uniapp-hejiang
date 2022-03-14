<template>
  <view class="container">
    <view class="list">
      <view class="item">
        <view class="question-box">
          <view class="label"><view class="text">问</view></view>
          <view class="content">水培是什么意思？</view>
        </view>
        <view class="answers-box">
          <view class="label"><view class="text">答</view></view>
          <view class="content">水培是什么意思？</view>
        </view>
      </view>
      <view class="item">
        <view class="question-box">
          <view class="label"><view class="text">问</view></view>
          <view class="content">水培是什么意思？</view>
        </view>
        <view class="answers-box">
          <view class="label"><view class="text">答</view></view>
          <view class="content">水培是什么意思？</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
</script>
<style lang="scss">
page {
  background-color: #ebfffd;
}
.container {
  .list {
    padding-left: 20rpx;
    padding-right: 20rpx;
    margin-bottom: 20rpx;
    .item {
      padding-top: 20rpx;
      padding-bottom: 20rpx;
      background-color: #fff;
      box-shadow: 0px 0px 14px 6px rgba(29, 233, 182, 0.11);
      border-radius: 20px;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      .question-box {
        display: flex;
        padding-bottom: 20rpx;
        .label {
          flex: 1;
          display: flex;
          justify-content: center;
          .text {
            width: 47rpx;
            height: 47rpx;
            line-height: 47rpx;
            background: linear-gradient(0deg, #2fb383 0%, #18a86b 100%);
            opacity: 0.6;
            border-radius: 7px;

            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #fff;
            text-align: center;
          }
        }
        .content {
          flex: 5;
        }
      }
      .answers-box {
        padding-top: 20rpx;
        display: flex;
        .label {
          flex: 1;
          display: flex;
          justify-content: center;
          .text {
            width: 47rpx;
            height: 47rpx;
            line-height: 47rpx;
            background: linear-gradient(0deg, #72d7cc 0%, #28cfb3 100%);
            opacity: 0.6;
            border-radius: 7px;

            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #fff;
            text-align: center;
          }
        }
        .content {
          flex: 5;
          color: #00796b;
        }
      }
    }
  }
}
</style>
