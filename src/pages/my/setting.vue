<template>
  <view class="bd-setting">
    <view
      class="bd-item dir-left-nowrap main-between cross-center"
      style="display: none"
      @click="router('/pages/my/verifyPhone')"
    >
      <text>手机号</text>
      <view>
        <text>{{ setIphone(userInfo.mobile) }}</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    <view
      class="bd-item dir-left-nowrap main-between cross-center"
      style="display: none"
      @click="router('/pages/registered/password')"
    >
      <text>登入密码</text>
      <view>
        <text>修改</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    <view class="bd-item dir-left-nowrap main-between cross-center" @click="setAvatar">
      <text>头像</text>
      <view class="cross-center">
        <image class="bd-avatar" :src="userInfo.avatar"></image>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    <view class="bd-item dir-left-nowrap main-between cross-center" @click="router('/pages/my/setNickname')">
      <text>昵称</text>
      <view>
        <text>{{ userInfo.nickname }}</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    <view class="bd-btn" @click="logOut">退出登入</view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { store } from '@/store'
import { fetchLogout } from '@/api/public'
import { AppMutationTypes } from '@/store/modules/app/mutation-types'
import { Tips } from '@/utils/util'
import { HTTP_REQUEST_URL } from '@/config/app'
import { fetchUpdateAvatar } from '@/api/user'
export default defineComponent({
  name: 'SettingPage',
  setup() {
    const isLogin = ref(store.getters.isLogin)
    const userInfo = ref(store.state.app.userInfo)

    const router = (data) => {
      uni.navigateTo({
        url: data,
      })
    }

    const logOut = () => {
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
    const setAvatar = () => {
      let _this = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          uni.uploadFile({
            url: HTTP_REQUEST_URL + '/web/index.php?_mall_id=1&r=api/attachment/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success(response) {
              userInfo.value.avatar = JSON.parse(response.data).data.url
              fetchUpdateAvatar({
                avatar: JSON.parse(response.data).data.url,
              })
            },
          })
        },
      })
    }
    const setIphone = (data) => {
      return data && data.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    return {
      userInfo,
      router,
      logOut,
      setAvatar,
      setIphone,
    }
  },
})
</script>

<style scoped lang="scss">
.bd-setting {
  padding: 0 24upx;
  background-color: #ffffff;
}
.bd-item {
  height: 100upx;
  font-size: 28upx;
  color: #353535;
  border-bottom: 2upx solid #f4f4f4;
}
.bd-arrow {
  width: 12upx;
  height: 22upx;
  margin-left: 20upx;
}
.bd-btn {
  text-align: center;
  height: 100upx;
  line-height: 100upx;
  position: fixed;
  bottom: 30upx;
  width: 702upx;
  color: #353535;
  border-radius: 16upx;
  box-shadow: 0 0 8upx rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}
.bd-avatar {
  width: 80upx;
  height: 80upx;
}
</style>
