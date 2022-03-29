import request from '@/utils/request'
import { store } from '@/store'

/**
 * 文章列表
 *
 */
export function fetchArticleList(data) {
  return request.get!('&r=api/default/article-list', data, { noAuth: true })
}

/**
 * 文章详情
 *
 */
export function fetchArticleDetail(data) {
  return request.get!('&r=api/default/article', data, { noAuth: true })
}
