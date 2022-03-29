<template>
  <view class="container">
    <view class="header">
      <view class="title">{{ detail.title }}</view>
      <view class="title-bar">
        <view class="title-bar-left"><text class="iconfont icon-calendar"></text>{{ detail.created_at }}</view>
        <view class="title-bar-right">
          <view class="favorite"> <text class="iconfont icon-hits"></text> 浏览：{{ detail.hits }} </view>
          <view class="share"> <text class="iconfont icon-share"></text> 分享 </view>
        </view>
      </view>
      <view class="sub-info">{{ detail.desc }}</view>
    </view>
    <view class="detail">
      <image src="/static/icon/goods-detail.png"></image>
      <rich-text :nodes="detail.content"></rich-text>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { Tips } from '@/utils/util'
import { fetchArticleDetail } from '@/api/article'
const id = ref('')

const detail = ref({}) as any
const getDetail = () => {
  fetchArticleDetail({ article_id: id.value })
    .then((r) => {
      if (r.code === 0) {
        detail.value = r.data.article
      }
    })
    .catch((err) => console.log(err))
}

onShow(() => {
  getDetail()
})

onLoad((options) => {
  id.value = options.id ? options.id : '3'
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  padding: 20rpx;
  .header {
    background-color: #fff;
    border-radius: 15rpx;
    padding-bottom: 20rpx;
    .title {
      font-size: 42rpx;
      font-weight: 500;
      text-align: justify;
      color: #353535;
      padding: 20rpx;
    }
    .title-bar {
      padding-top: 20rpx;
      padding-bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28rpx;
      color: #999;
      .title-bar-left {
        padding-left: 20rpx;
        .iconfont {
          padding-right: 10rpx;
          color: $theme-font-color;
        }
      }
      .title-bar-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .iconfont {
          color: $theme-font-color;
        }
        .favorite {
          padding-right: 20rpx;
        }
        .share {
          color: #fff;
          height: 48rpx;
          line-height: 48rpx;
          font-size: 22rpx;
          border-radius: 40rpx 0 0 40rpx;
          padding: 0 14rpx;
          width: 103rpx;
          background-color: $theme-font-color;

          .iconfont {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }
    }
    .sub-info {
      background-color: #ebfffd;
      padding: 20rpx;
      font-size: 24rpx;
      border-radius: 16rpx;
      margin: 0 20rpx;
    }
  }
  .detail {
    padding: 20upx 0;
    background-color: #ffffff;
    border-radius: 15upx;
    margin-top: 24upx;
    min-height: 800rpx;
    image {
      width: 100%;
      height: 80rpx;
      display: block;
    }
  }
}
</style>
