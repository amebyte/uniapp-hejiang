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

          const normalizeGoodsInfo = (d) => {
            console.log('dd', d)
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
              attrGroups: normalizeAttrGroups(d.attr_groups),
              skus: normalizeGoodsSkus(d.attr),
            }
            return data
          }

          const normalizeGoodsSkus = (data) => {
            return data.map((o) => {
              o['attrOptions'] = normalizeAttrOptions(o.attr_list)
              // 预售价
              o['presellPrice'] = o.price
              // 现价/市场价
              o['marketPrice'] = o.price
              // 原价
              o['prevPrice'] = o.price
              // 成本价
              o['costPrice'] = o.price
              // 库存
              o['stock'] = o.stock
              o['skuUniqueIds'] = o.sign_id
              return o
            })
          }

          const normalizeAttrOptions = (options) => {
            return options.map((o) => {
              o['attrId'] = o.attr_group_id
              o['attrName'] = o.attr_group_name
              o['val'] = o.attr_name
              o['valId'] = o.attr_id
              return o
            })
          }

          const normalizeAttrGroups = (skus) => {
            return skus.map((o) => {
              o['attrId'] = o.attr_group_id
              o['attrName'] = o.attr_group_name
              o['attrValues'] = o.attr_list
              o.attrValues.map((val) => {
                val['isSelect'] = false
                val['val'] = val.attr_name
                val['valId'] = val.attr_id
                val['thumb'] = val.pic_url
                return val
              })
              return o
            })
          }

          const data = normalizeGoodsInfo(d)

          resolve(data)
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log(err))
  })
}
