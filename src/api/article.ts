import request from '@/utils/request'
import { store } from '@/store'

/**
 * 文章列表
 *
 */
export function fetchArticleList(data) {
  return request.get!('&r=api/default/article-list', data, { noAuth: true })
}
