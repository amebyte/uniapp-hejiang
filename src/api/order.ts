import request from '@/utils/request'

export function fetchOrderPreview(data) {
  return request.post!('&r=api/order/preview', data, { noAuth: false }, true)
}

export function fetchOrderList(data) {
  return request.get!('&r=api/order/list', data, { noAuth: false }, false)
}

export function fetchOrderDetail(data) {
  return request.get!('&r=api/order/detail', data, { noAuth: false }, false)
}

export function fetchOrderSubmit(data) {
  return request.post!('&r=api/order/submit', data, { noAuth: false }, true)
}

export function fetchOrderPayOrderId(data) {
  return request.post!('&r=api/order/pay-data', data, { noAuth: false }, true)
}

export function fetchOrderPayments(data) {
  return request.get!('&r=api/payment/get-payments', data, { noAuth: false }, false)
}

export function fetchOrderPayData(data) {
  return request.get!('&r=api/payment/pay-data', data, { noAuth: false }, false)
}

export function fetchOrderPayResult(data) {
  return request.get!('&r=api/order/pay-result', data, { noAuth: false }, false)
}

export function fetchOrderIsPay(data) {
  return request.get!('&r=api/order/is-pay', data, { noAuth: false }, false)
}

export function fetchOrderListPayData(data) {
  return request.get!('&r=api/order/list-pay-data', data, { noAuth: false }, false)
}

export function fetchOrderCancel(data) {
  return request.get!('&r=api/order/cancel', data, { noAuth: false }, false)
}

export function fetchOrderConfirm(data) {
  return request.get!('&r=api/order/confirm', data, { noAuth: false }, false)
}

export function fetchOrderExpressDetail(data) {
  return request.get!('&r=api/order/express-detail', data, { noAuth: false }, false)
}
