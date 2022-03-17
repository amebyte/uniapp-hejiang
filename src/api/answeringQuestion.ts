import request from '@/utils/request'

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
  return request.get!('&r=api/answering-question/detail', data, { noAuth: true })
}