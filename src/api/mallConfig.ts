import request from '@/utils/request'

/**
 *  获取商城配置
 *
 */
export function fetchMallConfig(data) {
  return request.get!('&r=api/index/config', data, {
    noAuth: true,
  })
}
