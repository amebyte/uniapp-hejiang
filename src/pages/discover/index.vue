<template>
  <view class="container">
    <!--top-bar start-->
    <view class="top-bar">
      <view class="search-icon">
        <text class="iconfont icon-search"></text>
      </view>
      <view class="title">发现</view>
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
    <!--答疑列表 start-->
    <view class="list">
      <block v-for="item in list" :key="item.id">
        <BlogItem :item="item" @get-list="getList" />
      </block>
    </view>
    <!--答疑列表 end-->
  </view>
</template>

<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { fetchBlogList } from '@/api/blog'
import BlogItem from '@/components/blog-item/blog-item.vue'
const gotoPage = (url) => {
  uni.navigateTo({
    url: url,
  })
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
    .item {
      padding: 20rpx;
      box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      .recommend {
        text {
          background-color: #80c269;
          border-radius: 7rpx;
          font-size: 19rpx;
          font-family: Hiragino Sans GB;
          font-weight: bold;
          font-style: italic;
          color: #ffffff;
          padding: 5rpx 10rpx;
        }
      }
      .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .profile {
          display: flex;
          justify-content: flex-start;
          padding: 30rpx 20rpx;
          padding-left: 0;
          padding-bottom: 20rpx;
          > .l {
            image {
              width: 66rpx;
              height: 66rpx;
              border-radius: 50%;
            }
          }
          > .r {
            padding-left: 20rpx;
            .name {
              font-size: 28rpx;
              font-family: PingFang SC;
              font-weight: bold;
              color: #80c269;
              @extend .line1;
            }
            .desc {
              font-size: 20rpx;
              font-family: PingFang SC;
              font-weight: bold;
              color: #a6a6a6;
              @extend .line1;
            }
          }
        }
        .more {
          width: 40rpx;
          overflow: hidden;
          margin-left: 10rpx;
          .icon-more {
            font-size: 60rpx;
            color: #bfbfbf;
          }
        }
      }
      .text-content {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #050505;
        line-height: 40rpx;
        padding-left: 20rpx;
        padding-right: 20rpx;
      }
      .image-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 20rpx;
        padding-left: 20rpx;
        padding-right: 20rpx;
        .image {
          width: 193rpx;
          height: 193rpx;
          border-radius: 7rpx;
          margin-bottom: 20rpx;
          image {
            width: 100%;
            height: 100%;
            border-radius: 7rpx;
          }
        }
      }
      .interact-status {
        display: flex;
        justify-content: flex-start;
        margin-top: 20rpx;
        margin-bottom: 20rpx;
        padding-left: 20rpx;
        > .status {
          margin-right: 40rpx;
          color: #a6a6a6;
          .iconfont {
            font-size: 50rpx;
          }
          .txt {
            font-size: 21rpx;
            font-family: Hiragino Sans GB;
            font-weight: bold;
            padding-left: 10rpx;
          }
          &.on {
            color: #80c269;
          }
        }
      }
    }
  }
}
</style>
