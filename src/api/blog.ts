import request from '@/utils/request'
/**
 * 标签列表
 *
 */
export function fetchBlogTagList(data) {
  return request.get!('&r=api/blog-tag/list', data, { noAuth: true })
}

/**
 * 保存博文
 *
 */
export function fetchBlogSave(data) {
  return request.post!('&r=api/blog/save', data, { noAuth: true }, true)
}
