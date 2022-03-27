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
 * 收藏批量删除
 *
 */
export function fetchFavoriteBatchRemove(data) {
  return request.post!('&r=api/user/favorite-batch-remove', data, { noAuth: false }, true)
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

/**
 * 收藏作品列表
 *
 */
export function fetchMyBlogLikeList(data) {
  return request.get!('&r=api/user/my-blog-like-list', data, { noAuth: false })
}

/**
 * 收藏作品列表
 *
 */
export function fetchMyAnsweringQuestionLikeList(data) {
  return request.get!('&r=api/user/my-answering_question-like-list', data, { noAuth: false })
}
