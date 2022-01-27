import request from '@/utils/request'

export function fetchOrderPreview(data) {
  return request.post!('&r=api/order/preview', data, { noAuth: false }, true)
}

export function fetchOrderList(data) {
  return request.get!('&r=api/order/list', data, { noAuth: false }, false)
}

export function fetchOrderDetail(data) {
  console.log('data', data)
  return request.get!('&r=api/order/detail', data, { noAuth: false }, false)
}
