<template>
  <view class="container">
    <!--top-bar start-->
    <view class="top-bar">
      <view class="search-icon">
        <text class="iconfont icon-search"></text>
      </view>
      <view class="title"></view>
      <view class="action" @click="gotoPage('/pages/discover/publish')">
        <text>发布</text>
      </view>
    </view>
    <!--top-bar end-->
    <!--banner-nav start-->
    <view class="banner-nav">
      <view class="content">
        <view class="item">
          <view class="l">
            <image
              src="http://tstatic.mevikycloud.cn/image/product/2021/07/29/12051e1933364cd68168020f923e1a9fsjokznvbvn.jpg"
              mode="scaleToFill"
            ></image>
          </view>
          <view class="r">
            <view class="name">合作伙伴</view>
            <view class="desc">我们的合作伙伴</view>
          </view>
        </view>
        <view class="item">
          <view class="l">
            <image
              src="http://tstatic.mevikycloud.cn/image/product/2021/07/29/12051e1933364cd68168020f923e1a9fsjokznvbvn.jpg"
              mode="scaleToFill"
            ></image>
          </view>
          <view class="r">
            <view class="name">品牌中心</view>
            <view class="desc">诠释我们的品牌</view>
          </view>
        </view>
      </view>
    </view>
    <!--banner-nav end-->
    <!--发现列表 start-->
    <view class="list">
      <block v-for="item in list" :key="item.id">
        <BlogItem :item="item" :is-list="true" @get-list="getList" />
      </block>
    </view>
    <!--发现列表 end-->
  </view>
</template>

<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { store } from '@/store'
import { fetchBlogList } from '@/api/blog'
import BlogItem from '@/components/blog-item/blog-item.vue'

let isLogin = ref(store.getters.isLogin)

const gotoPage = (url) => {
  if (isLogin.value) {
    uni.navigateTo({
      url: url,
    })
  } else {
    uni.navigateTo({
      url: '/pages/my/login',
    })
  }
}

const list = ref([]) as any
const getList = () => {
  const param = { page: 1, limit: 10 }
  fetchBlogList(param)
    .then((r) => {
      if (r.code === 0) {
        list.value = r.data.list
      }
    })
    .catch((err) => console.log(err))
}

onShow(() => {
  getList()
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  margin: 20rpx;
  .top-bar {
    display: flex;
    justify-content: space-between;
    color: $theme-font-color;
    margin-bottom: 10rpx;
    .search-icon {
      padding-left: 15rpx;
      .icon-search {
        font-size: 32rpx;
      }
    }
    .title {
      font-size: 28rpx;
    }
    .action {
      text {
        border: 2rpx solid #009688;
        border-radius: 20rpx;
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #00796b;
        padding: 5rpx 20rpx;
      }
    }
  }
  .banner-nav {
    margin-bottom: 40rpx;
    .content {
      display: flex;
      justify-content: space-between;
      .item {
        display: flex;
        justify-content: flex-start;
        padding: 30rpx 20rpx;
        padding-left: 0;
        > .l {
          image {
            width: 66rpx;
            height: 66rpx;
            border-radius: 7rpx;
          }
        }
        > .r {
          padding-left: 20rpx;
          .name {
            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #00796b;
            @extend .line1;
          }
          .desc {
            font-size: 20rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #b7b7b7;
            @extend .line1;
          }
        }
        &:last-child {
          padding-right: 130rpx;
        }
      }
    }
  }
  .list {
  }
}
</style>
