import request from '@/utils/request'
import { goodsType } from '@/types'

const normalizeTeacherNames = (data) => {
  let teacherNames = ''
  data &&
    data.forEach((o) => {
      teacherNames += o.name + ','
    })
  return teacherNames.slice(0, teacherNames.length - 1)
}

/**
 * 热搜商品
 *
 */
export function fetchHotGoodsSearch(data) {
  return request.get!('&r=api/goods/hot-search', data, { noAuth: true })
}

/**
 * 搜索推荐商品
 *
 */
export function fetchRecommendSearch(data) {
  return request.get!('&r=api/goods/new-recommend', data, { noAuth: true })
}

/**
 * 推荐商品
 *
 */
export function fetchRecommendGoodsList(data) {
  return request.get!('&r=api/goods/new-recommend', data, { noAuth: true })
}

/**
 * 搜索商品
 *
 */
export function fetchSearchGoods(data) {
  return request.get!('&r=api/default/goods-list', data, { noAuth: true })
}

/**
 * 商品列表
 *
 */
export function fetchGoodsList(data) {
  return new Promise((resolve, reject) => {
    request.get!(`&r=api/default/goods-list`, data, { noAuth: true })
      .then((r) => {
        if (r.code === 0) {
          const data: goodsType[] = []
          const list = r.data.list as any
          list.map((o) => {
            const salesNum = o.sales.replace('已售', '').replace(o.unit, '')
            const curriculumContentParse = o.curriculum_content && JSON.parse(o.curriculum_content)
            const curriculumDatetimeParse = o.curriculum_datetime && JSON.parse(o.curriculum_datetime)
            data.push({
              id: o.id,
              thumb: o.cover_pic,
              productName: o.name,
              marketPrice: o.price,
              originalPrice: o.original_price,
              salesNum,
              curriculum_content: curriculumContentParse,
              curriculum_datetime: curriculumDatetimeParse,
              curriculum_type: o.curriculum_type,
              teacherNames: normalizeTeacherNames(curriculumContentParse),
              curriculum_start_time: curriculumDatetimeParse && curriculumDatetimeParse[0],
              curriculum_end_time: curriculumDatetimeParse && curriculumDatetimeParse[1],
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
              attr: d.attr,
              cats: d.cats,
              curriculum_content: d.curriculum_content,
              curriculum_datetime: d.curriculum_datetime,
              curriculum_type: d.curriculum_type,
              curriculum_start_time: d.curriculum_datetime[0],
              curriculum_end_time: d.curriculum_datetime[1],
              teacherNames: normalizeTeacherNames(d.curriculum_content),
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
