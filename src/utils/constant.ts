import Enum from './Enum'

/**
 * 订单类型
 */
export const orderStatusEnum = new Enum({
  PENDING_PAYMENT: [1, '待付款'],
  WAIT_SEND: [2, '待发货'],
  DISPATCHED: [3, '待收货'],
  COMPLETED: [4, '已完成'],
  PENDING_SHOPPING_EVALUATION: [5, '待评价'],
  TRANSACTION_CLOSURE: [6, '交易关闭'],
  APPLY_FOR_REFUND: [7, '申请退款'],
  REFUNDING: [8, '退款中'],
  REFUNDED: [9, '已退款'],
  REFUND_FAILED: [10, '退款失败'],
  PICK_UP_PENDING: [11, '待自提'],
  REFUSE_REFUND: [12, '拒绝退款'],
})

/**
 * 登录方式
 */
export const loginType = {
  WECHAT_H5: 'wechat', // 微信公众号
  MINI: 'xcx', // 小程序
}
