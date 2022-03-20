import request from '@/utils/request'
import { store } from '@/store'
/**
 * 标签列表
 *
 */
export function fetchBlogTagList(data) {
  return request.get!('&r=api/blog-tag/list', data, { noAuth: true })
}

/**
 * 博文列表
 *
 */
export function fetchBlogList(data) {
  return request.get!('&r=api/blog/list', data, { noAuth: true })
}

/**
 * 保存博文
 *
 */
export function fetchBlogSave(data) {
  return request.post!('&r=api/blog/save', data, { noAuth: false }, true)
}

/**
 * 保存博文评论
 *
 */
export function fetchBlogCommentSave(data) {
  return request.post!('&r=api/blog-comment/save', data, { noAuth: false }, true)
}

/**
 * 博文评论列表
 *
 */
export function fetchBlogCommentList(data) {
  const isLogin = store.state.app.token
  return request.get!('&r=api/blog-comment/list', data, { noAuth: isLogin ? false : true })
}

/**
 * 博文评论点赞
 *
 */
export function fetchBlogCommentLikeSave(data) {
  return request.post!('&r=api/blog-comment-like/save', data, { noAuth: false }, true)
}
