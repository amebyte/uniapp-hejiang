import request from '@/utils/request'
// #ifdef H5
import wechat from '@/libs/wechat'
// #endif

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
