import request from '@/utils/request'
import { store } from '@/store'

/**
 * 月活动标记
 *
 */
export function fetchActivityDoByMonth(data) {
  return new Promise((resolve, reject) => {
    request.get!('&r=api/activity/dot-by-month', data, { noAuth: true })
      .then((r) => {
        if (r.code === 0) {
          const list = r.data.list.map((o) => {
            o.datetime = o.datetime.slice(0, 10)
            return o
          })
          resolve({ list, pagination: r.data.pagination })
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log(err))
  })
}

/**
 * 活动列表
 *
 */
export function fetchActivityList(data) {
  return new Promise((resolve, reject) => {
    const isLogin = store.state.app.token
    request.get!('&r=api/activity/list', data, { noAuth: isLogin ? false : true })
      .then((r) => {
        if (r.code === 0) {
          const list = r.data.list.map((o) => {
            o.datetime = o.datetime.slice(0, 10)
            return o
          })
          resolve({ list, pagination: r.data.pagination })
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log(err))
  })
}

/**
 * 活动详情
 *
 */
export function fetchActivityDetail(data) {
  return request.get!('&r=api/activity/detail', data, { noAuth: true })
}

/**
 * 我的活动预约
 *
 */
export function fetchActivityBookingList(data) {
  return request.get!('&r=api/activity-booking/list', data, { noAuth: false })
}

/**
 * 获取我已经预约的活动数
 *
 */
export function fetchMyActivityBookCount() {
  return request.get!('&r=api/activity-booking/my-book-count', {}, { noAuth: false })
}

/**
 * 新增活动预约
 *
 */
export function fetchActivityBookingAdd(data) {
  return request.post!('&r=api/activity-booking/add', data, { noAuth: false }, true)
}
