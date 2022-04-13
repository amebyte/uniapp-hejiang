<template>
  <view class="container">
    <!--轮播图 start-->
    <view class="ad-banner">
      <ad-swiper :img-urls="banner" :image-h="173"></ad-swiper>
    </view>
    <view class="group-title acea-row row-center-wrapper">
      <view class="line"><image src="/static/images/groupLine.png"></image></view>
      <div class="name">
        <span class="iconfont icon-question"></span>
        精品课程
      </div>
      <view class="line right"><image src="/static/images/groupLine.png"></image></view>
    </view>
    <GoodsListColumnStyle />
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed } from 'vue'
import AdSwiper from '@/components/ad-swiper/index.vue'
import Thumb from './components/thumb.vue'
import GoodsListColumnStyle from './components/GoodsListColumnStyle.vue'
import { useStore, mapActions } from 'vuex'
import { BannerActionTypes } from '@/store/modules/banner/action-types'
import { fetchArticleList } from '@/api/article'
import { fetchBannerList } from '@/api/banner'
const store = useStore()
// const fetchBanner = mapActions(['banner', BannerActionTypes.ACTION_GET_BANNER]).ACTION_GET_BANNER.bind({
//   $store: store,
// })
// fetchBanner()
// const indexBanner = computed(() => store.state.banner.indexBanner)

const list = ref([]) as any

const getArticleList = () => {
  const params = {
    page: 1,
    limit: 10,
    article_cat_id: 4,
  }
  fetchArticleList(params)
    .then((r) => {
      if (r.code === 0) {
        list.value = r.data.list
      }
    })
    .catch((err) => console.log('fetchArticleList:', err))
}
const banner = ref([])
const getBanner = () => {
  fetchBannerList({ catid: 2 })
    .then((r) => {
      if (r.code === 0) {
        banner.value = r.data.list
      }
    })
    .catch((err) => console.log('fetchBannerList:', err))
}

onLoad(() => {
  getArticleList()
  getBanner()
})
onReachBottom(() => {})
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
  }
}
</style>
