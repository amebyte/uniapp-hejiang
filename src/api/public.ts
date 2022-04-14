import request from '@/utils/request'
// #ifdef H5
import wechat from '@/libs/wechat'
// #endif

/**
 * 用户登录 - 小程序
 * @param data object
 *
 *	smsCode
 */
export function fetchLogin(data) {
  return request.post!('&r=api/passport/login', data, { noAuth: true }, true)
}

/**
 * 用户登录 - H5
 * @param data object
 *
 *	smsCode
 */
export function fetchWechatH5Login(data) {
  return request.post!('&r=api/passport/login', data, { noAuth: true }, true)
}

/**
 * 用户登录 - H5
 * @param data object
 *
 *	smsCode
 */
export function fetchWechatH5Register(data) {
  return request.get!('&r=plugin/wechat/api/passport/login-url', data, { noAuth: true }, true)
}

/**
 * 用户登出
 * @param data object
 *
 *	smsCode
 */
export function fetchLogout() {
  return request.get!('&r=plugin/mobile/api/passport/logout', {}, { noAuth: true })
}

// #ifdef H5
/**
 * 获取微信公众号js配置
 * @returns {*}
 */
export function getWechatConfig() {
  return request.get!(
    '&r=plugin/wechat/api/passport/check',
    {
      url: wechat.signLink(),
      refresh: true,
      //   url: encodeURIComponent('https://mall.fsbaide.cn'),
    },
    {
      noAuth: true,
    }
  )
}
// #endif

/**
 * 验证码图片
 * @param data object
 *
 *	smsCode
 */
export function fetchCaptcha(data) {
  return request.get!('&r=site/pic-captcha', data, { noAuth: true })
}

/**
 * 验证码
 * @param data object
 *
 *	smsCode
 */
export function fetchPhoneCode(data) {
  return request.get!('&r=api/user/phone-code', data, { noAuth: false })
}

/**
 * 绑定手机号码
 * @param data object
 *
 *	smsCode
 */
export function fetchPhoneEmpower(data) {
  return request.post!('&r=api/user/phone-empower', data, { noAuth: false }, true)
}
