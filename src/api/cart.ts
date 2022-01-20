import request from '@/utils/request'

/**
 * 购物车列表
 *
 */
export function fetchCartList() {
  return new Promise((resolve, reject) => {
    request.get!('&r=api/cart/list', {}, { noAuth: false })
      .then((r) => {
        if (r.code === 0) {
          const normalizeCartList = (r) => {
            const temp: any[] = []
            r.data &&
              r.data.list &&
              r.data.list.forEach((v) => {
                v.goods_list.forEach((val) => {
                  temp.push({
                    ...val,
                    shopId: v.mch_id,
                    shopName: v.name || '自营商品',
                    id: val.id,
                    productId: val.goods_id,
                    // 预售价
                    presellPrice: val.attrs.price,
                    // 现价/市场价
                    marketPrice: val.attrs.price,
                    // 原价
                    productPrice: val.attrs.price,
                    // 成本价
                    costPrice: val.attrs.price,
                    // 库存
                    stock: val.attrs.stock,
                    skuName: normalizeSkuName(val.attrs.attr),
                    skuId: val.attr_id,
                    productName: val.goods.name,
                    thumb: val.attrs.pic_url,
                    cartNum: val.num,
                  })
                })
              })
            return temp
          }

          const normalizeSkuName = (attr) => {
            const attrTxt = attr.reduce((prev, curr) => `${prev};${curr.attr_name}`, '')
            return `已选择：${attrTxt.slice(1)}`
          }

          resolve(normalizeCartList(r))
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log(err))
  })
}

/**
 * 添加购物车
 *
 */
export function fetchAddCart(data) {
  const params = {
    goods_id: data.id,
    num: data.cartNum,
    attr: data.skuId,
  }
  return request.post!('&r=api/cart/add', params, { noAuth: false }, true)
}

/**
 * 更新购物车
 *
 */
export function fetchUpdateCart(data) {
  const editList = [{ goods_id: data.productId, num: data.cartNum, attr: data.skuId }]
  const params = {
    list: JSON.stringify(editList),
  }
  return request.post!('&r=api/cart/edit', params, { noAuth: false }, true)
}

/**
 * 删除购物车
 *
 */
export function fetchDeleteCart(data) {
  const cart_id_list: any[] = []
  data.forEach((item) => {
    cart_id_list.push({ mch_id: item.shopId, id: item.id })
  })
  const params = { cart_id_list: JSON.stringify(cart_id_list) }
  return request.post!('&r=api/cart/delete', params, { noAuth: false }, true)
}
