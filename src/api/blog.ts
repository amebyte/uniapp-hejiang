import request from '@/utils/request'
/**
 * 活动详情
 *
 */
export function fetchBlogTagList(data) {
  return request.get!('&r=api/blog-tag/list', data, { noAuth: true })
}
