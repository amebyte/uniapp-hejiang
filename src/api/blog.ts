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
  const isLogin = store.state.app.token
  return request.get!('&r=api/blog/list', data, { noAuth: isLogin ? false : true })
}

/**
 * 我的博文列表
 *
 */
export function fetchBlogMyList(data) {
  const isLogin = store.state.app.token
  return request.get!('&r=api/blog/my-list', data, { noAuth: isLogin ? false : true })
}

/**
 * 我的博文删除
 *
 */
export function fetchBlogDelete(data) {
  return request.post!('&r=api/blog/delete', data, { noAuth: false }, true)
}

/**
 * 博文详情
 *
 */
export function fetchBlogDetail(data) {
  const isLogin = store.state.app.token
  return request.get!('&r=api/blog/detail', data, { noAuth: isLogin ? false : true })
}

/**
 * 保存博文
 *
 */
export function fetchBlogSave(data) {
  return request.post!('&r=api/blog/save', data, { noAuth: false }, true)
}

/**
 * 博文点赞
 *
 */
export function fetchBlogLikeSave(data) {
  return request.post!('&r=api/blog-like/save', data, { noAuth: false }, true)
}

/**
 * 博文点赞取消
 *
 */
export function fetchBlogLikeDelete(data) {
  return request.post!('&r=api/blog-like/delete', data, { noAuth: false }, true)
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

/**
 * 博文评论点赞取消
 *
 */
export function fetchBlogCommentLikeDelete(data) {
  return request.post!('&r=api/blog-comment-like/delete', data, { noAuth: false }, true)
}

/**
 * 我的博文评论列表
 *
 */
export function fetchBlogCommentMyList(data) {
  const isLogin = store.state.app.token
  return request.get!('&r=api/blog-comment/my-list', data, { noAuth: isLogin ? false : true })
}

/**
 * 我的博文评论删除
 *
 */
export function fetchBlogCommentDelete(data) {
  return request.post!('&r=api/blog-comment/delete', data, { noAuth: false }, true)
}
