<template>
  <view class="container">
    <view class="header">
      <view class="content"></view>
    </view>
    <!--头像和用户信息 start-->
    <view class="user-info-header" style="">
      <block v-if="isLogin">
        <view class="user-avatar" @click="toPage('/pages/my/edit')">
          <image :src="userInfo.avatar" />
        </view>
        <view class="user-right">
          <view class="user-right-top">
            <text class="username">{{ userInfo.nickname }}</text>
            <view class="user-level"
              >{{ userInfo.identity ? `LV${userInfo.identity.member_level}` : 'LV0' }}
              <text class="iconfont icon-arrow-right-bold"></text
            ></view>
            <view class="user-person">点击刷新</view>
          </view>
          <view class="user-right-bottom">
            <view>{{ userInfo.identity.level_name || '' }}</view>
          </view>
        </view>
        <view class="setup" @click="toPage('/pages/my/memberUpgrade')"><text class="txt">等级规则</text></view>
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
    <!--会员级别 start-->
    <view class="member-level">
      <view class="title">会员级别</view>
      <view class="bottom">
        <view class="growth-value">
          <text class="num">{{ state.prop }}</text> 成长值
          <text v-if="state.nextList.length > 0">
            消费￥{{ state.list !== null ? state.list.consumption_money : '0' }}/￥
            {{ state.detail !== null ? state.nextMember.money : '0' }}
          </text>
        </view>
        <view class="line"></view>
        <view class="level-desc">当前是{{ userInfo.identity.level_name || '初级等级' }}</view>
      </view>
      <view class="bg-image"><image src="../../static/images/skip/vip.png" /></view>
    </view>
    <!--会员级别 end-->
    <!--特惠标题 start-->
    <view class="preferential-title">会员专享特惠商品</view>
    <!--特惠标题 end-->
    <!--特惠商品列表 start-->
    <ProductListGrid :is_level="1" />
    <!--特惠商品列表 end-->
  </view>
</template>
<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import ProductListGrid from '@/components/product-list-grid/index.vue'
import { store } from '@/store'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { fetchMemberLevelInfo, fetchMemberRechargeSetting } from '@/api/user'

const state = reactive({
  tabbarbool: false,
  detail: {
    rules: '',
    level: 0,
  },
  list: [] as any,
  nextList: [],
  goods: [],
  first: false,
  haveBackground: false,
  coupon: [],
  balance: 0,
  loading: false,
  member_pic_url: null,
  nextMember: {
    money: 0,
  },
  recharge: false,
  current: 'wechat',
  prop: 0,
  page_loading: true,
  level: 0,
})

const isLogin = ref(store.getters.isLogin)
const userInfo = ref(store.state.app.userInfo)

const toPage = (path) => {
  uni.navigateTo({
    url: path,
  })
}

const goLogin = () => {
  uni.navigateTo({
    url: `/pages/my/login`,
  })
}

const getList = () => {
  let that = this
  fetchMemberLevelInfo()
    .then((response) => {
      if (response.code == 0) {
        state.list = response.data
        state.detail = state.list.mall_member
        state.goods = state.list.member_goods
        state.coupon = state.list.member_coupons
        state.nextMember = state.list.next_consume_upgrade_member
        state.member_pic_url = state.list.member_pic_url
        state.nextList = state.list.next_mall_member
        if (state.recharge) {
          state.balance = state.list.user_info.balance
        }
        if (state.detail != null) {
          state.level = state.detail.level
        }
        if (state.nextMember) {
          state.prop = (state.list.consumption_money / state.nextMember.money) * 100
          if (state.prop > 100) {
            state.prop = 100
          }
        }
        if (state.detail == null && state.nextList && state.nextList.length > 0) {
          state.detail = state.nextList[0]
        }
      } else {
        uni.showToast({
          title: response.msg,
          icon: 'none',
          duration: 1000,
        })
      }
    })
    .catch((response) => {
      console.log('fetchMemberLevelInfo:', response)
    })
}

onShow(() => {
  getList()
})

onLoad(() => {
  fetchMemberRechargeSetting()
    .then((response) => {
      if (response.code == 0) {
        if (Number(response.data.setting.status) === 1) {
          state.recharge = true
        }
      } else {
        uni.showToast({
          title: response.msg,
          icon: 'none',
          duration: 1000,
        })
      }
    })
    .catch((response) => {
      console.log('fetchMemberRechargeSetting:', response)
    })
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
page {
  background-color: $background-color;
}
</style>
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
        background-color: #102c24;
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

        .user-person {
          height: 30rpx;
          line-height: 30rpx;
          font-size: 20rpx;
          background-color: #ffcc00;
          border-radius: 10rpx;
          padding-left: 10rpx;
          padding-right: 10rpx;
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
      .txt {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: bold;
        text-decoration: underline;
        color: #23ad77;
        line-height: 0px;
      }
    }
  }
  .member-level {
    position: relative;
    margin-left: 20rpx;
    margin-right: 20rpx;
    height: 369rpx;
    background: linear-gradient(0deg, #2fb383 0%, #18a86b 100%);
    border-radius: 20rpx;
    padding: 40rpx;
    overflow: hidden;
    .title {
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fcb81d;
    }
    .bottom {
      margin-top: 100rpx;
      .growth-value {
        font-size: 40rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        .num {
          font-size: 50rpx;
        }
      }
      .line {
        height: 3rpx;
        background: #ffffff;
        border-radius: 1rpx;
        margin-top: 20rpx;
        margin-bottom: 20rpx;
      }
      .level-desc {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .bg-image {
      position: absolute;
      bottom: -80rpx;
      right: -100rpx;
      image {
        width: 325rpx;
        height: 306rpx;
        opacity: 0.3;
      }
    }
  }
  .preferential-title {
    text-align: center;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 600;
    color: #1aa86c;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
  }
}
</style>
