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
        if (r.code === 0) {
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
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log(err))
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
  return new Promise((resolve, reject) => {
    request.get!('&r=api/goods/detail&id=2&plugin=mall', data, { noAuth: true })
      .then((r) => {
        if (r.code === 0) {
          const d = r.data.goods
          const sliderImage: string[] = []
          d.pic_url.forEach((v) => {
            sliderImage.push(v.pic_url)
          })
          let content = d.detail.replace(
            /<img/gi,
            "<img class='richImg' style='width:auto!important;height:auto!important;max-height:100%;width:100%;'"
          )
          content = content.replace(/&nbsp;/g, '&ensp;')
          const data: goodsType = {
            id: d.id,
            thumb: d.cover_pic,
            productName: d.name,
            marketPrice: d.price,
            minprice: d.price,
            prevPrice: d.price,
            sliderImage,
            content,
          }
          resolve(data)
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log((err) => console.log(err)))
  })
}

/**
 * 商品属性
 *
 */
export function fetchGoodsPicker(data) {
  return request.get!('&r=goods.get_picker', data, { noAuth: true })
}
