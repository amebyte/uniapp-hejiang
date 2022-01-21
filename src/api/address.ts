import request from '@/utils/request'

/**
 * 获取用户信息
 *
 */
export function fetchUserAddress() {
  return request.get!('&r=api/user/address&type=0&page=1', {})
}

/**
 * 获取全部地区
 * @returns
 */
export function fetchDistrict() {
  return request.get!('&r=api/default/district', {})
}

/**
 * 新增和编辑
 * @returns
 */
export function fetchEidtAddress(data) {
  return request.post!('&r=api/user/address-save', data, {}, true)
}
