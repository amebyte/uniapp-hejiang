<template>
  <view class="container">
    <view class="header">
      <view class="content"></view>
    </view>
    <!--头像和用户信息 start-->
    <view class="user-info-header" style="">
      <block v-if="userInfo">
        <view class="user-avatar">
          <image :src="userInfo.avatar" />
        </view>
        <view class="user-right">
          <view class="user-right-top">
            <text class="username">{{ userInfo.nickname }}</text>
            <view class="user-level"
              >{{ userInfo.identity ? `LV${userInfo.identity.member_level}` : 'LV0' }}
              <text class="iconfont icon-arrow-right-bold"></text
            ></view>
          </view>
          <view class="user-right-bottom">
            <view>欢迎来到{{ userInfo.nickname }}的作品中心</view>
          </view>
        </view>
        <view class="setup"><text @click="gotoPage('/pages/discover/publish')">发布</text></view>
      </block>
      <block v-else>
        <view class="user-no-head" @click="goLogin">
          <text class="iconfont icon-no-head"></text>
        </view>
        <view class="user-right">
          <view class="user-right-top" @click="goLogin">
            <text class="username">授权登录</text>
          </view>
          <view class="user-right-bottom" @click="goLogin">授权登录之后享受更多优惠福利</view>
        </view>
      </block>
    </view>
    <!--头像和用户信息 end-->
    <!--发现列表 start-->
    <view class="list">
      <block v-for="item in list" :key="item.id">
        <BlogItem :item="item" :is-del="isDel" @get-list="getList" />
      </block>
      <template v-if="list.length === 0">
        <view class="no-list">
          <AppNoGoods background="#f7f7f7" :title="'暂无相关作品'" color="#999999" :is-image="1" />
        </view>
      </template>
    </view>
    <!--发现列表 end-->
    <block v-if="list.length > 0">
      <LoadBar :txt="loadTitle" :loading="loading" />
    </block>
  </view>
</template>

<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { fetchBlogMyList } from '@/api/blog'
import LoadBar from '@/components/load-bar/load-bar.vue'
import BlogItem from '@/components/blog-item/blog-item.vue'
import AppNoGoods from '@/components/app-no-goods/app-no-goods.vue'
import { store } from '@/store'

const userInfo = ref(null) as any
const isDel = ref(false)
const userid = ref('')
const gotoPage = (url) => {
  uni.navigateTo({
    url: url,
  })
}

const loading = ref(true)
const loadTitle = ref('加载更多')
const page = ref(1)
const list = ref([]) as any
const getList = () => {
  const param = { page: page.value, limit: 10, userid: userid.value }
  fetchBlogMyList(param)
    .then((r) => {
      if (r.code === 0) {
        if (r.data.list.length !== 0) {
          page.value++
          list.value = list.value.concat(r.data.list)
          const member = r.data.member
          if (member) {
            userInfo.value = {
              avatar: member.userInfo.avatar,
              nickname: member.nickname,
              identity: { member_level: member.identity.member_level },
            }
          } else {
            userInfo.value = store.state.app.userInfo
          }
        } else {
          loading.value = false
          loadTitle.value = '已经到底了~'
        }
      }
    })
    .catch((err) => console.log('fetchBlogMyList:', err))
}

const goLogin = () => {
  uni.navigateTo({
    url: `/pages/my/login`,
  })
}

onShow(() => {
  console.log('onShow')
  getList()
})
onLoad((options) => {
  userid.value = options.userid || ''
  isDel.value = options.userid ? false : true
})
onReachBottom(() => {
  getList()
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  .header {
    position: absolute;
    width: 100%;
    margin: auto;
    overflow: hidden;

    .content {
      position: relative;
      width: 100%;
      height: 246rpx;
      text-align: center;
      line-height: 100rpx;

      &::after {
        width: 140%;
        height: 246rpx;
        position: absolute;
        left: -20%;
        top: 0;
        content: '';
        border-radius: 0 0 50% 50%;
        background-color: $top-background-color;
      }
    }
  }

  .user-info-header {
    position: relative;
    display: flex;
    padding: 22rpx;
    height: 246rpx;
    overflow: hidden;
    padding-top: 30rpx;

    .user-avatar {
      image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
    }

    .user-top-icon {
      position: absolute;
      right: 0;
      bottom: -87rpx;
      width: 320rpx;
    }

    .user-right {
      display: flex;
      flex-direction: column;
      align-items: left;
      padding-left: 20rpx;
      margin-top: 17rpx;

      .user-right-top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 40rpx;
        line-height: 40rpx;
        margin-bottom: 10rpx;

        .username {
          font-size: 35rpx;
          padding-right: 6rpx;
          color: #fff;
        }

        .user-level {
          height: 30rpx;
          line-height: 30rpx;
          font-size: 20rpx;
          background-color: #e7e7e7;
          border-radius: 10rpx;
          padding-left: 10rpx;
          padding-right: 10rpx;
          margin-right: 6px;
          color: #f33333;

          .iconfont {
            font-size: 15rpx;
          }
        }
      }

      .user-right-bottom {
        color: #fff;
        opacity: 0.7;
      }
    }

    .user-no-head {
      padding-top: 20rpx;
      .icon-no-head {
        color: #fff;
        font-size: 84rpx;
      }
    }

    .setup {
      position: absolute;
      top: 70rpx;
      right: 40rpx;
      color: #fff;
      text {
        border: 2rpx solid #fff;
        border-radius: 20rpx;
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #fff;
        padding: 5rpx 20rpx;
        padding-top: 8rpx;
      }
    }
  }
  .list {
    margin: 20rpx;
    .no-list {
      margin-top: 120rpx;
    }
  }
}
</style>
