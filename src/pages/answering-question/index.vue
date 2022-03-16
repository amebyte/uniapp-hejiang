<template>
  <view class="container">
    <!--轮播图 start-->
    <view class="ad-banner">
      <ad-swiper :img-urls="indexBanner" :image-h="173"></ad-swiper>
    </view>
    <view class="group-title acea-row row-center-wrapper">
      <view class="line"><image src="/static/images/groupLine.png"></image></view>
      <div class="name">
        <span class="iconfont icon-question"></span>
        专家答疑
      </div>
      <view class="line right"><image src="/static/images/groupLine.png"></image></view>
    </view>
    <view class="list">
      <block v-for="(item, index) in list" :key="index">
        <view class="item" @click="gotoDetail(item)">
          <view class="question-box">
            <view class="label"><view class="text">问</view></view>
            <view class="content">{{ item.title }}</view>
          </view>
          <view class="answers-box">
            <view class="label"><view class="text">答</view></view>
            <view class="content">{{ item.desc }}</view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed } from 'vue'
import AdSwiper from '@/components/ad-swiper/index.vue'
import { useStore, mapActions } from 'vuex'
import { BannerActionTypes } from '@/store/modules/banner/action-types'
import { fetchAnsweringQuestionList } from '@/api/answeringQuestion'
const store = useStore()
const fetchBanner = mapActions(['banner', BannerActionTypes.ACTION_GET_BANNER]).ACTION_GET_BANNER.bind({
  $store: store,
})
fetchBanner()
const indexBanner = computed(() => store.state.banner.indexBanner)

const gotoDetail = (item) => {
  uni.navigateTo({
    url: '/pages/activity/detail?id=' + item.id,
  })
}

const list = ref([]) as any
const getAnsweringQuestionList = () => {
  const params = {
    page: 1,
    limit: 5,
  }
  fetchAnsweringQuestionList(params)
    .then((r) => {
      if (r.code === 0) {
        list.value = r.data.list
      }
    })
    .catch((err) => console.log(err))
}
</script>
<style lang="scss">
page {
  background-color: #ebfffd;
}
.container {
  .ad-banner {
    margin: 20rpx;
    overflow: hidden;
    border-radius: 10rpx;
  }
  .group-title {
    height: 100rpx;
    background: linear-gradient(0deg, #2fb383 0%, #18a86b 100%);
    border-radius: 20rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
    .line {
      width: 102rpx;
      height: 4rpx;
      &.right {
        transform: rotate(180deg);
      }
      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .name {
      margin: 0 20rpx;
      color: #fff;
      .iconfont {
        margin-right: 10rpx;
        color: #fff !important;
      }
    }
    .member {
      color: #fff;
      margin: 0 30rpx;
      .pictrue {
        width: 46rpx;
        height: 46rpx;
        position: relative;
        image {
          border: 2rpx solid #fff;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        & ~ .pictrue {
          margin-left: -8rpx;
        }
        .iconfont {
          position: absolute;
          width: 43rpx;
          height: 43rpx;
          background: rgba(51, 51, 51, 0.6);
          border-radius: 50%;
          top: 2rpx;
          left: 2rpx;
          color: #fff;
          font-size: 10rpx;
          text-align: center;
          line-height: 43rpx;
        }
      }
    }
  }
  .list {
    padding-left: 20rpx;
    padding-right: 20rpx;
    margin-bottom: 20rpx;
    .item {
      padding-top: 40rpx;
      padding-bottom: 40rpx;
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
