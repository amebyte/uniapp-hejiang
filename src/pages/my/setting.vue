<template>
  <view class="bd-setting">
    <view
      class="bd-item dir-left-nowrap main-between cross-center"
      style="display: none"
      @click="router('/pages/registered/authentication')"
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
export default defineComponent({
  name: 'SettingPage',
  setup() {
    const userInfo = ref(store.state.app.userInfo)

    const router = (data) => {
      uni.navigateTo({
        url: data,
      })
    }

    const logOut = () => {
      this.$request({
        url: this.$api.registered.logout,
      }).then((res) => {
        if (res.code === 0) {
          this.$store.dispatch('user/logout')
          uni.navigateBack({})
        }
      })
    }
    const setAvatar = () => {
      let _this = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          uni.uploadFile({
            url: _this.$api.upload.file,
            filePath: res.tempFilePaths[0],
            name: 'file',
            success(response) {
              _this.userInfo.avatar = JSON.parse(response.data).data.url
              _this.$request({
                url: _this.$api.registered.avatar,
                method: 'post',
                data: {
                  avatar: JSON.parse(response.data).data.url,
                },
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
