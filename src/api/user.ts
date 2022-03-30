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
  return request.post!('&r=plugin/mobile/api/user/avatar', data)
}
