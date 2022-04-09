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
  return request.post!('&r=plugin/mobile/api/user/avatar', data, { noAuth: false }, true)
}

/**
 * 更新昵称
 *
 */
export function fetchUpdateNickname(data) {
  return request.post!('&r=plugin/mobile/api/user/nickname', data, { noAuth: false }, true)
}

/**
 * 获取全部会员规则
 *
 */
export function fetchAllMemberRules() {
  return request.get!('&r=api/mall-member/all-member', {}, { noAuth: false }, true)
}
