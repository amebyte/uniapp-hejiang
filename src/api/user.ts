import request from '@/utils/request'

/**
 * 获取用户信息
 *
 */
export function fetchUserInfo() {
  return request.get!('&r=api/user/user-info', {})
}

/**
 * 更新头像
 *
 */
export function fetchUpdateAvatar(data) {
  return request.post!('&r=api/user/avatar', data, { noAuth: false }, true)
}

/**
 * 更新昵称
 *
 */
export function fetchUpdateNickname(data) {
  return request.post!('&r=api/user/nickname', data, { noAuth: false }, true)
}

/**
 * 获取全部会员规则
 *
 */
export function fetchAllMemberRules() {
  return request.get!('&r=api/mall-member/all-member', {}, { noAuth: false }, true)
}

/**
 * 购买会员
 *
 */
export function fetchMemberPurchase(data) {
  return request.post!('&r=api/mall-member/purchase-member', data, { noAuth: false }, true)
}

/**
 * 会员等级信息
 *
 */
export function fetchMemberLevelInfo() {
  return request.get!('&r=api/mall-member/index', {}, { noAuth: false }, true)
}

/**
 * 会员充值信息
 *
 */
export function fetchMemberRechargeSetting() {
  return request.get!('&r=api/recharge/setting', {}, { noAuth: false }, true)
}
