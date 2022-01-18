import request from '@/utils/request'
import { goodsType } from '@/types'

/**
 * 精选课程
 *
 */
export function fetchRecommendGoodsList(data) {
  return new Promise((resolve, reject) => {
    request.get!('&r=api/default/goods-list&page=1&cat_id=5', data, { noAuth: true })
      .then((r) => {
        const data: goodsType[] = []
        const list = r.data.list as any
        list.map((o) => {
          data.push({
            id: o.id,
            thumb: o.cover_pic,
            productName: o.name,
            marketPrice: o.price,
          })
        })
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

/**
 * 商品列表
 *
 */
export function fetchGoodsList(data) {
  return request.get!('&r=api/default/goods-list&page=1&cat_id=', data, { noAuth: true })
}

/**
 * 商品详情
 *
 */
export function fetchGoodsDetail(data) {
  return request.get!('&r=goods.get_detail', data, { noAuth: true })
}

/**
 * 商品属性
 *
 */
export function fetchGoodsPicker(data) {
  return request.get!('&r=goods.get_picker', data, { noAuth: true })
}
