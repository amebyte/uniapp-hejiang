import request from '@/utils/request'

/**
 * 获取用户信息
 *
 */
export function fetchUserAddress() {
  return request.get!('&r=api/user/address&type=0&page=1', {})
}

export function fetchDistrict() {
  return request.get!('&r=api/default/district', {})
}
