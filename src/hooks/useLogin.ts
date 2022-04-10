import { useStore } from 'vuex'
import Auth from '@/libs/wechat'
import { fetchUserInfo } from '@/api/user'
import { AppMutationTypes } from '@/store/modules/app/mutation-types'
import { Tips } from '@/utils/util'
import { RoutineInstance } from '@/libs/routine'
import { fetchLogin } from '@/api/public'
const store = useStore()
// #ifdef H5
/**
 * 公众号登录
 */
export const wechatH5Login = () => {
  const urlData = location.pathname + location.search
  Auth.oAuth('snsapi_userinfo', urlData)
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
export const getUserProfile = () => {
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
