import request from '@/utils/request'
import { store } from '@/store'

/**
 * 答疑列表
 *
 */
export function fetchAnsweringQuestionList(data) {
  return request.get!('&r=api/answering-question/list', data, { noAuth: true })
}

/**
 * 答疑详情
 *
 */
export function fetchAnsweringQuestionDetail(data) {
  const isLogin = store.state.app.token
  return request.get!('&r=api/answering-question/detail', data, { noAuth: isLogin ? false : true })
}

/**
 * 答疑点赞
 *
 */
export function fetchAnsweringQuestionLikeSave(data) {
  return request.post!('&r=api/answering-question-like/save', data, { noAuth: false }, true)
}

/**
 * 答疑点赞取消
 *
 */
export function fetchAnsweringQuestionLikeDelete(data) {
  return request.post!('&r=api/answering-question-like/delete', data, { noAuth: false }, true)
}
