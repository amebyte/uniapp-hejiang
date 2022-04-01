<template>
  <view class="container">
    <!--top-bar start-->
    <AppSearch v-model="keyword" @onSearch="handleSearch" />
    <!--top-bar end-->

    <template v-if="searchList.length === 0">
      <view class="no-list">
        <AppNoGoods background="#fff" :title="'暂无相关搜索结课'" color="#999999" :is-image="1" />
      </view>
    </template>
    <template v-else>
      <view class="app-top dir-left-nowrap main-center cross-center">
        <view class="app-content dir-left-nowrap main-between cross-center">
          <view class="app-line"></view>
          <view class="app-icon-love iconfont icon-selected"></view>
          <text class="app-text">搜索结果</text>
          <view class="app-line"></view>
        </view>
      </view>
      <view class="list">
        <block v-for="item in searchList" :key="item.id">
          <BlogItem :item="item" :is-list="true" @get-list="handleSearch" />
        </block>
      </view>
    </template>
    <!--发现列表 start-->
    <view class="app-top dir-left-nowrap main-center cross-center">
      <view class="app-content dir-left-nowrap main-between cross-center">
        <view class="app-line"></view>
        <view class="app-icon-love iconfont icon-love"></view>
        <text class="app-text">或您会喜欢</text>
        <view class="app-line"></view>
      </view>
    </view>
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
import AppSearch from '@/components/app-search/app-search.vue'
import BlogItem from '@/components/blog-item/blog-item.vue'
import AppNoGoods from '@/components/app-no-goods/app-no-goods.vue'

const keyword = ref('')

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

const searchList = ref([]) as any
const handleSearch = () => {
  const param = { page: 1, limit: 10, keyword: keyword.value }
  fetchBlogList(param)
    .then((r) => {
      if (r.code === 0) {
        searchList.value = r.data.list
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
  background-color: #fff;

  .app-top {
    width: 100%;
    height: 40+32+24rpx;
    .app-content {
      height: 24rpx;
      width: calc(100% - 450rpx);
      .app-line {
        width: 56rpx;
        height: 2rpx;
        background-color: #bbbbbb;
      }
      .app-icon-love {
        color: #999;
      }
      .app-text {
        font-size: 24rpx;
        color: #999999;
      }
    }
  }

  .list {
    margin: 20rpx;
  }

  .no-list {
    margin-top: 120rpx;
  }
}
</style>
