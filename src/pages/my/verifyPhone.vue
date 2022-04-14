<template>
  <view class="bd-verify-phone">
    <view class="bd-content dir-top-nowrap cross-center">
      <image src="./image/phone-1.png" class="bd-iphone"></image>
      <text class="bd-iphone-text"> 验证新手机号 </text>
    </view>
    <view class="bd-item dir-left-nowrap cross-center">
      <image src="./image/earth.png" class="bd-label box-grow-0"></image>
      <input class="bd-input box-grow-1" value="+86" :disabled="true" type="text" />
    </view>
    <view class="bd-item dir-left-nowrap cross-center">
      <image src="./image/phone.png" class="bd-label box-grow-0"></image>
      <input v-model="mobile" class="bd-input box-grow-1" placeholder="请输入手机号" type="text" />
    </view>
    <view class="bd-item dir-left-nowrap cross-center">
      <image src="./image/image.png" class="bd-label box-grow-0"></image>
      <input v-model="pic_captcha" class="bd-input box-grow-1" placeholder="请输入图形验证码" type="text" />
      <image :src="imageUrl" class="bd-image box-grow-0" @click="getImageUrl"></image>
    </view>
    <view class="bd-item dir-left-nowrap cross-center">
      <image src="./image/message.png" class="bd-label box-grow-0"></image>
      <input v-model="sms_captcha" class="bd-input box-grow-1" placeholder="请输入短消息验证码" type="text" />
      <view v-if="!isSend" class="bd-btn box-grow-0" @click="getVerCode">获取验证码</view>
      <view v-else class="bd-btn box-grow-0 bd-send">重新发送{{ timeNum }}S</view>
    </view>
    <view class="bd-bottom" :class="agree ? 'bd-yes-agree' : 'bd-no-agree'" @click="confirm">确认</view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed, watch } from 'vue'
import { store } from '@/store'

export default defineComponent({
  name: 'VerifyPhone',
  setup() {
    const userInfo = ref(store.state.app.userInfo)
    const state = reactive({
      mobile: '',
      pic_captcha: '',
      sms_captcha: '',
      validate_code_id: '',
      imageUrl: '',
      isSend: false,
      timeNum: 60,
      timeIng: 0,
      key: '' as any,
    })

    const agree = computed(() => {
      if (state.pic_captcha && state.sms_captcha && state.mobile) {
        return true
      } else {
        return false
      }
    })

    const getVerCode = () => {
      state.timeNum = 60
      this.$request({
        url: this.$api.registered.sms,
        method: 'post',
        data: {
          mobile: userInfo.value.mobile,
          pic_captcha: state.pic_captcha,
        },
      }).then((response) => {
        if (response.code === 0) {
          state.isSend = true
          state.validate_code_id = response.data.validate_code_id
          change()
        } else {
          getImageUrl()
          uni.showToast({
            icon: 'none',
            title: response.msg,
          })
        }
      })
    }
    const getImageUrl = () => {
      this.$request({
        url: this.$api.registered.captcha,
        data: {
          refresh: true,
        },
      }).then((response) => {
        state.imageUrl = response.url
      })
    }

    const change = () => {
      clearInterval(state.timeIng)
      state.timeIng = setInterval(() => {
        state.timeNum--
        if (state.timeNum === 0) {
          clearInterval(state.timeIng)
          state.isSend = false
        }
      }, 1000)
    }

    const confirm = () => {
      if (!agree.value) return
      let data = {
        mobile: state.mobile,
        validate_code_id: state.validate_code_id,
        key: state.key,
        sms_captcha: state.sms_captcha,
      }
      this.$request({
        url: this.$api.registered.mobile,
        method: 'post',
        data: data,
      }).then((response) => {
        if (response.code === 0) {
          console.log('response', response)
        } else {
          getImageUrl()
          uni.showToast({
            icon: 'none',
            title: response.msg,
          })
        }
      })
    }

    onLoad((options) => {
      state.key = options.key
      getImageUrl()
    })
    return {
      ...toRefs(state),
      confirm,
    }
  },
})
</script>

<style scoped lang="scss">
.bd-verify-phone {
  min-height: 100vh;
  background: #ffffff;
  padding: 46upx 42upx;
}
.bd-iphone {
  width: 110upx;
  height: 110upx;
  margin-top: 54upx;
}
.bd-iphone-text {
  font-size: 32upx;
  font-weight: bold;
  color: #333333;
  margin-top: 60upx;
}
.bd-content {
  border-bottom: 2upx solid #f4f4f4;
  padding-bottom: 65upx;
}
.bd-item {
  height: 100upx;
  border-bottom: 2upx solid #f4f4f4;
}
.bd-label {
  width: 36upx;
  height: 36upx;
  margin: 0 25upx 0 2upx;
}
.bd-btn {
  border-left: 1upx solid #f4f4f4;
  width: 226upx;
  height: 53upx;
  line-height: 53upx;
  font-size: 32upx;
  color: #ff4544;
  text-align: center;
}
.bd-image {
  width: 160upx;
  height: 67upx;
}
.bd-input {
  height: 36upx;
}
.bd-bottom {
  height: 88upx;
  line-height: 88upx;
  color: #ffffff;
  font-size: 36upx;
  border-radius: 44upx;
  margin-top: 68upx;
  text-align: center;
}
.bd-yes-agree {
  background: rgba(255, 69, 68, 1);
}
.bd-no-agree {
  background: rgba(255, 69, 68, 0.5);
}
</style>
