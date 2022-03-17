import request from '@/utils/request'

export function fetchUploadFile(data) {
  return request.post!('&r=api/attachment/upload&name=base64', data, { noAuth: false }, true)
}
