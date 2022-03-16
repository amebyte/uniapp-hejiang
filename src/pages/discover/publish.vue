<template>
  <view class="container">
    <view class="cells">
      <textarea
        class="textarea"
        name="content"
        placeholder="分享你的学习成果或者作业吧！ #作业题目"
        maxlength="2000"
        placeholder-class="phcolor-color"
        auto-focus
      />
      <view class="textarea-counter">0/1000</view>
    </view>
    <view class="enclosure"></view>
    <view class="cat-btn-wrap">
      <view class="cat-btn">
        <view class="l">
          <view class="icon">＃</view>
          <view class="txt">选择作业题目</view>
        </view>
        <view class="r">
          <text class="iconfont icon-arrow-down"></text>
        </view>
      </view>
      <view class="cat-item">
        <view class="item">＃水培</view>
        <view class="item">＃水培水</view>
        <view class="item">＃水培</view>
        <view class="item">＃水培水培水培</view>
        <view class="item on">＃水培水培</view>
        <view class="item">＃水培水</view>
        <view class="item">＃水培</view>
        <view class="item">＃水培水培</view>
        <view class="item">＃水培</view>
        <view class="item">＃水培水培</view>
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
  padding-top: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .cells {
    border-radius: 4rpx;
    height: 280rpx;
    box-sizing: border-box;
    position: relative;
    margin-left: 20rpx;
    margin-right: 20rpx;
    .textarea {
      height: 210rpx;
      width: 94%;
      color: #666;
      font-size: 28rpx;
      background: #ffffff;
      box-shadow: 0px 0px 14px 6px rgba(29, 233, 182, 0.11);
      border-radius: 20px;
      padding: 20rpx;
    }
    .textarea-counter {
      display: none;
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
  .cat-btn-wrap {
    margin-left: 20rpx;
    margin-right: 20rpx;
    background: #f6f8f9;
    border: 3rpx solid #cbcbcb;
    box-shadow: 0rpx 0rpx 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-radius: 20rpx;
    .cat-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 93rpx;
      background: #ffffff;
      box-shadow: 0rpx 0rpx 14rpx 6rpx rgba(29, 233, 182, 0.11);
      border-radius: 20rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      .l {
        display: flex;
        align-items: center;
        .icon {
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          background: #1aa86c;
          border: 2rpx solid #ebfffd;
          border-radius: 50%;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #fefefe;
        }
        .txt {
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #00796b;
          padding-left: 20rpx;
        }
      }
      .r {
        .iconfont {
          color: #1aa86c;
          font-size: 36rpx;
        }
      }
    }
    .cat-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      .item {
        color: #cacccb;
        background: #ffffff;
        border-radius: 27rpx;
        padding: 30rpx;
        margin: 20rpx;
        &.on {
          color: #fff;
          background-color: #409e5b;
        }
      }
    }
  }
}
</style>
