import { fetchMallConfig } from '@/api/mallConfig'
import Cache from '@/utils/cache'

let isFirstAppRun = true
let isGettingFromService = false
let mallConfig = null
const cacheKey = '_APP_CONFIG'
let resolveList: any[] = []
let rejectList: any[] = []

const getConfigFormServer = (resolve?, reject?) => {
  if (resolve) {
    resolveList.push(resolve)
  }
  if (reject) {
    rejectList.push(reject)
  }
  if (isGettingFromService) {
    return
  }
  isGettingFromService = true
  fetchMallConfig({})
    .then((response) => {
      isGettingFromService = false
      if (response.code === 0) {
        mallConfig = response.data
        Cache.set(cacheKey, mallConfig)
        for (const i in resolveList) {
          resolveList[i](mallConfig)
        }
        resolveList = []
      } else {
        for (const i in rejectList) {
          rejectList[i](response.msg)
        }
        rejectList = []
      }
    })
    .catch((error) => {
      isGettingFromService = false
      for (const i in rejectList) {
        rejectList[i](error.msg)
      }
      rejectList = []
    })
}

export default {
  getConfig() {
    return new Promise((resolve, reject) => {
      if (mallConfig) {
        return resolve(mallConfig)
      }
      mallConfig = Cache.get(cacheKey)
      if (mallConfig) {
        if (isFirstAppRun) {
          isFirstAppRun = false
          getConfigFormServer()
        }
        return resolve(JSON.parse(mallConfig))
      } else {
        getConfigFormServer(resolve, reject)
      }
    })
  },
  resetConfig() {
    mallConfig = null
    Cache.clear(cacheKey)
    isGettingFromService = false
  },
}
