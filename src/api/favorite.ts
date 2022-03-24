import request from '@/utils/request'

/**
 * 收藏添加
 *
 */
export function fetchFavoriteAdd(data) {
  return request.get!('&r=api/user/favorite-add', data, { noAuth: false })
}

/**
 * 收藏删除
 *
 */
export function fetchFavoriteRemove(data) {
  return request.get!('&r=api/user/favorite-remove', data, { noAuth: false })
}

/**
 * 收藏商品类目
 *
 */
export function fetchFavoriteGoodsCats() {
  return request.get!('&r=api/user/favorite-cats', {}, { noAuth: false })
}

/**
 * 收藏商品列表
 *
 */
export function fetchFavoriteGoodsList(data) {
  return request.get!('&r=api/user/my-new-favorite-goods', data, { noAuth: false })
}
