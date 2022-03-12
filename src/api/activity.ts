import request from '@/utils/request'

/**
 * 活动列表
 *
 */
export function fetchActivityList(data) {
  return new Promise((resolve, reject) => {
    request.get!('&r=api/activity/list', data, { noAuth: true })
      .then((r) => {
        if (r.code === 0) {
          const data = r.data.list.map((o) => {
            o.datetime = o.datetime.slice(0, 10)
            return o
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
 * 新增活动预约
 *
 */
export function fetchActivityBookingAdd(data) {
  return request.post!('&r=api/activity-booking/add', data, { noAuth: false }, true)
}
