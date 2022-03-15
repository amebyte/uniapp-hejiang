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
            o.datetime = o.date_start_time.slice(0, 10)
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
  return new Promise((resolve, reject) => {
    request.get!('&r=api/activity-booking/list', data, { noAuth: false })
      .then((r) => {
        if (r.code === 0) {
          const list = r.data.list.map((o) => {
            const nowTime = new Date().getTime()
            const date_start_time = new Date(o.activity.date_start_time).getTime()
            const date_end_time = new Date(o.activity.date_end_time).getTime()
            // 进行中
            if (date_start_time <= nowTime && date_end_time > nowTime) {
              o.activity['status_text'] = '进行中'
              // 未开始
            } else if (date_start_time > nowTime) {
              o.activity['status_text'] = '未开始'
              // 已过期
            } else if (date_end_time < nowTime) {
              o.activity['status_text'] = '已过期'
            }
            o.activity['datetime'] = o.activity.date_start_time.slice(0, 10)
            return o
          })
          resolve({ code: r.code, list, pagination: r.data.pagination })
        } else {
          reject(r)
        }
      })
      .catch((err) => console.log(err))
  })
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
