import request from '@/utils/request'

export function fetchUploadFile(data) {
  return request.get!('&r=api/activity/detail', data, { noAuth: true })
}
