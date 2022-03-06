import request from '@/utils/request'

/**
 *  获取轮播图
 *
 */
export function fetchTpl(data) {
  return request.get!('&r=api/index/tpl-index&page_id=0', data, {
    noAuth: true,
  })
}
