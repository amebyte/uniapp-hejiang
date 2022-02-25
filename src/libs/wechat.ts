// #ifdef H5
import WechatJSSDK from 'weixin-js-sdk'
import { getWechatConfig, fetchLogin } from '@/api/public'
import { WX_AUTH, STATE_KEY, BACK_URL } from '@/config/cache'
import { parseQuery } from '@/utils'
import { store } from '@/store'
import Cache from '@/utils/cache'

class AuthWechat {
  constructor() {
    // 微信实例化对象
    this.instance = WechatJSSDK
    // 是否实例化
    this.status = false

    this.initConfig = {}
  }

  isAndroid() {
    const u = navigator.userAgent
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  }

  signLink() {
    if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
      window.entryUrl = location.href.split('#')[0]
    }
    return /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl
  }

  /**
   * 初始化wechat(分享配置)
   */
  wechat() {
    return new Promise((resolve, reject) => {
      getWechatConfig()
        .then((res) => {
          const config = {
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: [
              'chooseWXPay',
              'openLocation',
              'getLocation',
              'openAddress',
              'scanQRCode',
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareAppMessage',
              'onMenuShareTimeline',
            ],
          }
          this.instance.config(config)
          this.initConfig = config
          this.status = true
          this.instance.ready(() => {
            resolve(this.instance)
          })
        })
        .catch((err) => {
          console.log('微信分享配置失败', err)
          this.status = false
          reject(err)
        })
    })
  }

  /**
   * 验证是否初始化
   */
  verifyInstance() {
    const that = this
    return new Promise((resolve, reject) => {
      if (that.instance === null && !that.status) {
        that
          .wechat()
          .then((res) => {
            resolve(that.instance)
          })
          .catch(() => {
            return reject()
          })
      } else {
        return resolve(that.instance)
      }
    })
  }
  // 微信公众号的共享地址
  openAddress() {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.openAddress)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 获取经纬度；
  location() {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.getLocation, {
            type: 'wgs84',
          })
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 使用微信内置地图查看位置接口；
  seeLocation(config) {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.openLocation, config)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 微信支付
   * @param {Object} config
   */
  pay(config) {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.chooseWXPay, config)
            .then((res) => {
              resolve(res)
            })
            .catch((res) => {
              resolve(res)
            })
        })
        .catch((res) => {
          reject(res)
        })
    })
  }

  /**
   * 微信扫一扫
   * @param {Object} config
   */
  scanQRCode(config) {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.scanQRCode, config)
            .then((res) => {
              resolve(res)
            })
            .catch((res) => {
              resolve(res)
            })
        })
        .catch((res) => {
          reject(res)
        })
    })
  }

  toPromise(fn, config = {}) {
    return new Promise((resolve, reject) => {
      fn({
        ...config,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        },
        complete(err) {
          reject(err)
        },
        cancel(err) {
          reject(err)
        },
      })
    })
  }

  /**
   * 自动去授权
   */
  oAuth(snsapiBase, url) {
    if (uni.getStorageSync(WX_AUTH) && store.state.app.token && snsapiBase == 'snsapi_base') return
    const { code } = parseQuery()
    if (!code || code == uni.getStorageSync('snsapiCode')) {
      return this.toAuth(snsapiBase, url)
    } else {
      if (Cache.has('snsapiKey'))
        return this.auth(code).catch((error) => {
          uni.showToast({
            title: error,
            icon: 'none',
          })
        })
    }
  }

  clearAuthStatus() {}

  /**
   * 授权登录获取token
   * @param {Object} code
   */
  auth(code, loginType = loginType.WECHAT_H5) {
    return new Promise((resolve, reject) => {
      const params = {
        code: code,
        loginType,
      }
      fetchLogin(params)
        .then(async ({ data }) => {
          console.log('data', data)
          // 更新用户信息
          data && (await store.dispatch('USERINFO'))
          resolve(data)
        })
        .catch((err) => {
          console.log('err', err)
          if (loginType === loginType.WECHAT_H5) {
            uni.showToast({
              icon: 'none',
              title: err,
              duration: 2000,
            })
          }
          reject(err)
        })
    })
  }

  /**
   * 获取跳转授权后的地址
   * @param {Object} appId
   */
  getAuthUrl(appId, snsapiBase, backUrl) {
    let url = `${location.origin}${backUrl}`
    if (url.indexOf('?') == -1) {
      url = url + '?'
    } else {
      url = url + '&'
    }
    const redirect_uri = encodeURIComponent(
      `${url}&back_url=` +
        encodeURIComponent(
          encodeURIComponent(
            uni.getStorageSync(BACK_URL) ? uni.getStorageSync(BACK_URL) : location.pathname + location.search
          )
        )
    )
    uni.removeStorageSync(BACK_URL)
    const state = encodeURIComponent(('' + Math.random()).split('.')[1] + 'authorizestate')
    uni.setStorageSync(STATE_KEY, state)
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=${snsapiBase}&state=${state}#wechat_redirect`
  }

  /**
   * 跳转自动登录
   */
  toAuth(snsapiBase, backUrl) {
    const that = this
    this.wechat().then((wx) => {
      location.href = this.getAuthUrl(that.initConfig.appId, snsapiBase, backUrl)
    })
  }

  /**
   * 绑定事件
   * @param {Object} name 事件名
   * @param {Object} config 参数
   */
  wechatEvevt(name, config) {
    const that = this
    return new Promise((resolve, reject) => {
      const configDefault = {
        fail(res) {
          if (that.instance)
            return reject({
              is_ready: true,
              wx: that.instance,
            })
          that.verifyInstance().then((wx) => {
            return reject({
              is_ready: true,
              wx: wx,
            })
          })
        },
        success(res) {
          return resolve(res, 2222)
        },
      }
      Object.assign(configDefault, config)
      that.wechat().then((wx) => {
        if (typeof name === 'object') {
          name.forEach((item) => {
            wx[item] && wx[item](configDefault)
          })
        } else {
          wx[name] && wx[name](configDefault)
        }
      })
    })
  }

  isWeixin() {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  }
}

export default new AuthWechat()
// #endif
