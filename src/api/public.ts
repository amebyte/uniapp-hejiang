import request from '@/utils/request'
import wechat from '@/libs/wechat'

/**
 * 用户登录 - 微信/H5/
 * @param data object
 *
 *	loginType: xcx 小程序 h5 phone
 *	smsCode
 */
export function fetchLogin(data) {
  return request.post!('&r=api/passport/login', data, { noAuth: true }, true)
}

/**
 * 获取微信公众号js配置
 * @returns {*}
 */
export function getWechatConfig() {
  return request.get!(
    '&r=plugin/wechat/api/passport/check',
    {
      url: encodeURIComponent(wechat.signLink()),
    },
    {
      noAuth: true,
    }
  )
}
