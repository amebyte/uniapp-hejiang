export const APP_NAME = '开卓教育'

export const IMAGE_URL = '' // 静态资源的cos地址

// export const HTTP_REQUEST_URL = process.uniEnv.HTTP_REQUEST_URL
// export const HTTP_REQUEST_URL = 'https://mall.fsbaide.cn/'
export const HTTP_REQUEST_URL = 'https://kaizhuo.eadts.cn'

export const HEADER = {
  'content-type': 'application/json',
}

export const HEADERPARAMS = {
  'content-type': 'application/x-www-form-urlencoded',
}

export const TOKENNAME = 'X-Access-Token'

// 缓存时间 0 永久
export const EXPIRE = 0

// #ifdef MP-WEIXIN
export const X_APP_PLATFORM = 'wxapp'
// #endif
// #ifdef H5
export const X_APP_PLATFORM = 'wechat'
// #endif

export const X_APP_VERSION = '4.4.45'
