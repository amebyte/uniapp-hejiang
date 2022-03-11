import request from '@/utils/request'

/**
 * 活动列表
 *
 */
export function fetchActivityList(data) {
  return request.get!('&r=api/default/activity-list', data, { noAuth: true })
}
