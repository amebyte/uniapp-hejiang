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
            <view class="user-person" @click="loginHandler">点击刷新</view>
          </view>
          <view class="user-right-bottom">
            <block v-if="mall.setting.is_icon_members_grade == 1">
              <image
                class="level-icon"
                load-lazy="true"
                :src="userInfo.identity.member_pic_url"
                mode="aspectFill"
              ></image>
              <view class="level-name">{{ userInfo.identity.level_name || '' }}</view>
            </block>
          </view>
        </view>
        <view class="setup" @click="toPage('/pages/my/setting')"><text class="iconfont icon-setting"></text></view>
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
    <!--会员中心入口 start-->
    <view class="member-center">
      <view class="image"><image src="../../static/images/skip/vip.png" /></view>
      <view class="desc">只有会员才知道的世界</view>
      <view class="action"><text @click="gotoMemberCenter">进入</text></view>
    </view>
    <!--会员中心入口 end-->
    <!-- 我的订单 start-->
    <view class="user-order">
      <view class="box-header two_sides">
        <view>我的订单</view>
        <view class="all" @click="toPage('/pages/order/list')">
          <text>全部订单</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="box-content row">
        <view class="box-item col-4" @click="toPage('/pages/order/list?status=1')">
          <text class="iconfont icon-pending-payment icon"></text>
          <text>待付款</text>
        </view>
        <view class="box-item col-4" @click="toPage('/pages/order/list?status=2')">
          <text class="iconfont icon-wait-send icon"></text>
          <text>待发货</text>
          <view v-if="orderCounts.unauditedOrderCounts > 0" class="desc">
            {{ orderCounts.unauditedOrderCounts > 99 ? '99+' : orderCounts.unauditedOrderCounts }}
          </view>
        </view>
        <view class="box-item col-4" @click="toPage('/pages/order/list?status=3')">
          <text class="iconfont icon-dispatched icon"></text>
          <text>待收货</text>
          <view v-if="orderCounts.unauditedOrderCounts > 0" class="desc">
            {{ orderCounts.unauditedOrderCounts > 99 ? '99+' : orderCounts.unauditedOrderCounts }}
          </view>
        </view>
        <view class="box-item col-4" @click="toPage('/pages/order/list?status=4')">
          <text class="iconfont icon-completed icon"></text>
          <text>已完成</text>
          <view v-if="orderCounts.unauditedOrderCounts > 0" class="desc">
            {{ orderCounts.unauditedOrderCounts > 99 ? '99+' : orderCounts.unauditedOrderCounts }}
          </view>
        </view>
      </view>
    </view>
    <!-- 我的订单 end-->
    <!-- 我的内容 start-->
    <view class="user-order">
      <view class="box-header two_sides"> 我的内容 </view>
      <view class="box-content row">
        <view class="box-item col-3" @click="toPage('/pages/my/myBlog')">
          <text class="iconfont icon-picture icon"></text>
          <text>我的作品</text>
        </view>
        <view class="box-item col-3" @click="toPage('/pages/my/myComment')">
          <text class="iconfont icon-comment icon"></text>
          <text>我的评论</text>
        </view>
        <view class="box-item col-3" @click="toPage('/pages/my/favorite')">
          <text class="iconfont icon-love icon"></text>
          <text>我的收藏</text>
        </view>
      </view>
    </view>
    <!-- 我的内容 end-->
    <!-- 我的服务 start-->
    <view class="user-order">
      <view class="box-header two_sides"> 我的服务 </view>
      <view class="box-content row">
        <view class="box-item col-3" @click="toPage('/pages/order/list')">
          <text class="iconfont icon-subject-talk icon"></text>
          <text>我的课程</text>
        </view>
        <view class="box-item col-3" @click="toPage('/pages/activity/myBooking')">
          <text class="iconfont icon-calendar icon"></text>
          <text>我的预约</text>
        </view>
        <view class="box-item col-3" @click="toPage('/pages/my/favoriteAnswer')">
          <text class="iconfont icon-question icon"></text>
          <text>我的答疑</text>
        </view>
      </view>
    </view>
    <!-- 我的服务 end-->
    <!-- 我的设置 start-->
    <view class="user-order">
      <view class="box-header two_sides"> 我的设置 </view>
      <view class="box-content row">
        <view class="box-item col-3" @click="toPage('/pages/my/setting')">
          <text class="iconfont icon-data icon"></text>
          <text>修改资料</text>
        </view>
        <view class="box-item col-3" @click="toPage('/pages/my/address')">
          <text class="iconfont icon-address icon"></text>
          <text>收货地址</text>
        </view>
        <view class="box-item col-3" @click="logout">
          <text class="iconfont icon-sign-out icon"></text>
          <text>退出账号</text>
        </view>
      </view>
    </view>
    <!-- 我的设置 end-->
    <!--客服 start-->
    <view class="service" style="display: none">
      <view class="btn">
        <text class="iconfont icon-wechat"></text>
        <text>联系客服</text>
      </view>
      <view class="desc">在线答疑时间：工作日8:00-20:00</view>
    </view>
    <!--客服 end-->
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { store } from '@/store'
import { fetchLogout } from '@/api/public'
import { AppMutationTypes } from '@/store/modules/app/mutation-types'
import { Tips } from '@/utils/util'
import { getUserProfile, wechatH5Login } from '@/hooks/useLogin'
const isLogin = ref(store.getters.isLogin)
const userInfo = ref(store.state.app.userInfo)
const mall = store.state.mallConfig.mall

const orderCounts = ref({}) as any
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
const gotoMemberCenter = () => {
  uni.navigateTo({
    url: `/pages/my/memberCenter`,
  })
}

const loginHandler = () => {
  // #ifdef MP-WEIXIN
  getUserProfile()
  // #endif
  // #ifdef H5
  wechatH5Login()
  // #endif
}

const logout = () => {
  if (isLogin.value) {
    fetchLogout()
      .then((r) => {
        if (r.code === 0) {
          store.commit(AppMutationTypes.LOGOUT)
          Tips({ title: '退出登录成功' })
          uni.navigateTo({
            url: `/pages/my/login`,
          })
        }
      })
      .catch((err) => console.log('fetchLogout:', fetchLogout))
  } else {
    Tips(
      {
        title: '您还没登录，请先登录',
      },
      {
        tab: 2,
        url: '/pages/my/login',
      }
    )
  }
}
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
page {
  background-color: $background-color;
}
</style>
<style lang="scss" scoped>
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
        display: flex;
        color: #fff;
        opacity: 0.7;
        .level-icon {
          border-radius: 50%;
          margin-bottom: -3rpx;
          height: 44rpx;
          width: 44rpx;
        }
        .level-name {
          padding-left: 10rpx;
        }
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
      .iconfont {
        font-size: 40rpx;
      }
    }
  }
  .member-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 20rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;

    background: #00342e;
    border: 3px solid #ffffff;
    box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-radius: 20rpx;
    padding: 20rpx;
    height: 120rpx;
    .image {
      position: relative;
      image {
        position: absolute;
        top: -65rpx;
        width: 103rpx;
        height: 93rpx;
      }
    }
    .desc {
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fcb81d;
    }
    .action {
      text {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #00342e;
        background-color: #fcb81d;
        border-radius: 27rpx;
        padding: 10rpx 30rpx;
      }
    }
  }

  .user-order {
    margin-left: 20rpx;
    margin-right: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    margin-bottom: 20rpx;

    .box-header {
      padding: 20rpx 20rpx 0 20rpx;
      font-size: 32rpx;
      color: $theme-font-color;

      & > view:nth-child(1) {
        font-family: PingFangSC-Regular;
        font-size: 32rpx;
        color: $theme-font-color;
      }

      & > view:nth-child(2) {
        font-family: PingFangSC-Light;
        font-size: 24rpx;
        color: $theme-font-color;
        line-height: 24rpx;

        .iconfont {
          margin-left: 10rpx;
          font-size: 24rpx;
          color: $theme-font-color;
        }
      }
    }

    .box-content {
      padding: 60rpx 0 10rpx;
      padding-top: 40rpx;
      flex-wrap: wrap;
      .box-item {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 30rpx;
        image {
          width: 44rpx;
          height: 40rpx;
        }

        .icon {
          font-size: 62rpx;
          padding-bottom: 20rpx;
        }

        text {
          margin-top: 4rpx;
          font-family: PingFangSC-Light;
          font-size: 24rpx;
          color: $theme-font-color;
        }

        .desc {
          top: -20rpx;
          right: 80rpx;
        }
      }
    }
  }

  .service {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 50rpx;
    margin-bottom: 40rpx;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 253rpx;
      height: 93rpx;
      background: linear-gradient(0deg, #2fb383 0%, #18a86b 100%);
      box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
      border-radius: 47rpx;

      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      line-height: 48rpx;
      .iconfont {
        padding-right: 20rpx;
      }
    }
    .desc {
      font-size: 20rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #b5b5b5;
      line-height: 48rpx;
      padding-top: 20rpx;
    }
  }
}
</style>
