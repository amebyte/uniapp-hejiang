import request from '@/utils/request'

/**
 * 获取收货地址列表
 *
 */
export function fetchAddressList() {
  return request.get!('&r=api/user/address&type=0&page=1', {})
}

/**
 * 获取收货地址列表
 *
 */
export function fetchAddressDetail(data) {
  return request.get!('&r=api/user/address-detail', data)
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

/**
 * 新增和编辑
 * @returns
 */
export function fetchChangeDefault(data) {
  return request.post!('&r=api/user/address-default', data, {}, true)
}

/**
 * 删除
 * @returns
 */
export function fetchDelAddress(data) {
  return request.post!('&r=api/user/address-destroy', data, {}, true)
}
