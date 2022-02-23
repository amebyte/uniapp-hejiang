<template>
  <view class="login-wrap">
    <view class="header">
      <view class="image"></view>
      <view class="name">开卓教育商城</view>
    </view>
    <view class="login-submit-wrap">
      <view class="txt">
        <text class="login-desc">登录即表示同意开卓教育商城</text>
        <text class="login-desc-rule" @click="toPage('/pages/my/agreement')">《法律条款与隐私协议》</text>
      </view>
      <view class="login-button" @click="loginHandler">
        <text class="iconfont icon-wechat"></text>
        <button hover-class="hover-button">微信账号一键登录</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { fetchUserInfo } from '@/api/user'
import { fetchLogin } from '@/api/public'
import { RoutineInstance } from '@/libs/routine'
import { Tips } from '@/utils/util'
import Cache from '@/utils/cache'
import { AppMutationTypes } from '@/store/modules/app/mutation-types'
export default defineComponent({
  name: 'LoginPage',
  setup() {
    const store = useStore()
    const loginHandler = () => {
      // #ifdef MP-WEIXIN
      getUserProfile()
      // #endif
      // #ifdef H5
      wechatLogin()
      // #endif
    }
    // #ifdef H5
    /**
     * 公众号登录
     */
    const wechatLogin = () => {
      // this.$wechat.oAuth('snsapi_userinfo', '/pages/auth/index')
    }
    // #endif

    // #ifdef MP
    /**
     * 获取个人用户信息
     */
    const getUserInfo = () => {
      fetchUserInfo().then((res) => {
        uni.hideLoading()
        store.commit(AppMutationTypes.SET_USER_INFO, res.data)
        Tips(
          {
            title: '登录成功',
            icon: 'success',
          },
          {
            tab: 3,
          }
        )
      })
    }
    /**
     * 微信小程序登录
     */
    const getUserProfile = () => {
      uni.showLoading({
        title: '正在登录中',
      })
      RoutineInstance.getUserProfile()
        .then((res) => {
          RoutineInstance.getCode()
            .then((code) => {
              goLogin(code, res)
            })
            .catch((res) => {
              uni.hideLoading()
            })
        })
        .catch((res) => {
          uni.hideLoading()
        })
    }

    const goLogin = (code, res) => {
      fetchLogin({
        encryptedData: res.userInfo.encryptedData,
        iv: res.userInfo.iv,
        signature: res.userInfo.signature,
        rawData: JSON.stringify(res.userInfo.userInfo),
        code,
      })
        .then((r) => {
          if (r.code === 0) {
            store.commit(AppMutationTypes.SET_TOKEN, r.data.access_token)
            getUserInfo()
          } else {
            uni.showToast({
              title: `获取用户登录态失败:` + r.message,
              icon: 'none',
              duration: 2000,
            })
          }
        })
        .catch((err) => console.log(err))
    }
    // #endif
    const toPage = (url) => {
      Tips(url)
    }
    return {
      loginHandler,
      toPage,
    }
  },
})
</script>

<style lang="scss">
@import '@/static/css/variable.scss';
page {
  background-color: $background-color;
}

.login-wrap {
  .header {
    height: 400rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #00796b;
    .image {
      width: 107rpx;
      height: 107rpx;
      background-color: #c8e6c9;
      border-radius: 50%;
    }
    .name {
      padding-top: 20rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .login-submit-wrap {
    margin: 0 auto;
    margin-top: 40rpx;
    padding: 32rpx 20rpx 40rpx 20rpx;
    width: calc(100% - 80rpx);
    border-radius: 16rpx;
    background-color: #fff;

    .txt {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 20rpx;
      .login-desc {
        font-size: 24rpx;
        color: #333;
      }

      .login-desc-rule {
        font-size: 24rpx;
        color: #ea1717;
      }
    }

    .login-button {
      width: 100%;
      margin-top: 48rpx;
      height: 92rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #28c445;
      color: #fff;
      font-family: PingFangSC-Light;
      border-radius: 60rpx;
      text-align: center;

      .login-wechat-icon {
        height: 100%;
        width: 46rpx;
      }

      button {
        background: transparent;
        font-size: 28rpx;
        color: #fff;
        margin-left: 12rpx;
      }
    }
    .btn-white {
      margin-top: 40rpx;
      border: 1rpx solid #aaa;
      background-color: #fff;
      button {
        color: #666;
      }
    }
  }
}
</style>
