const date = new Date() //得到当前日期原始模式
const currDay = date.getDate() // 得到当前日期
const currMonth = date.getMonth() + 1 //得到当前日期月份（注意： getMonth()方法一月为 0, 二月为 1, 以此类推。）
const currYear = date.getFullYear()

export const getDateObj = () => {
  return {
    currDay: currDay < 10 ? '0' + currDay : currDay,
    currMonth: currMonth < 10 ? '0' + currMonth : currMonth,
    currYear,
  }
}

/**
 * opt  object | string
 * to_url object | string
 * 例:
 * this.Tips('/pages/test/test'); 跳转不提示
 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
 * tab=1 一定时间后跳转至 table上
 * tab=2 一定时间后跳转至非 table上
 * tab=3 一定时间后返回上页面
 * tab=4 关闭所有页面跳转至非table上
 * tab=5 关闭当前页面跳转至table上
 */
export const Tips = function (opt, to_url?) {
  if (typeof opt == 'string') {
    to_url = opt
    opt = {}
  }
  const title = opt.title || '',
    icon = opt.icon || 'none',
    endtime = opt.endtime || 2000,
    success = opt.success
  if (title)
    uni.showToast({
      title: title,
      icon: icon,
      duration: endtime,
      success,
    })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      const tab = to_url.tab || 1,
        url = to_url.url || ''
      switch (tab) {
        case 1:
          // 一定时间后跳转至 table
          setTimeout(function () {
            uni.switchTab({
              url: url,
            })
          }, endtime)
          break
        case 2:
          // 跳转至非table页面
          setTimeout(function () {
            uni.navigateTo({
              url: url,
            })
          }, endtime)
          break
        case 3:
          // 返回上页面
          setTimeout(function () {
            // #ifndef H5
            uni.navigateBack({
              delta: parseInt(url),
            })
            // #endif
            // #ifdef H5
            history.back()
            // #endif
          }, endtime)
          break
        case 4:
          // 关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            uni.reLaunch({
              url: url,
            })
          }, endtime)
          break
        case 5:
          // 关闭当前页面跳转至非table页面
          setTimeout(function () {
            uni.redirectTo({
              url: url,
            })
          }, endtime)
          break
      }
    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url()
      }, endtime)
    } else {
      // 没有提示时跳转不延迟
      setTimeout(
        function () {
          uni.navigateTo({
            url: to_url,
          })
        },
        title ? endtime : 0
      )
    }
  }
}

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
  const delay = t || 500
  let timer
  return function (...args) {
    // const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 根据最小堆获取最小值
 */
export const minHeap = (arr, property) => {
  const data: any[] = []
  for (const o of arr) {
    data.push(o)
    let index = data.length - 1
    while (index > 0) {
      const parentIndex = (index - 1) >>> 1
      const parent = data[parentIndex]
      if (o[property] < parent[property]) {
        ;[data[index], data[parentIndex]] = [data[parentIndex], data[index]]
        index = parentIndex
      } else {
        break
      }
    }
  }
  return data.length === 0 ? null : data[0]
}

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
export const urlEncode = (param, key?, encode?) => {
  if (param == null) return ''
  let paramStr = ''
  const t = typeof param
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + (encode == null || encode ? encodeURIComponent(param) : param)
  } else {
    for (const i in param) {
      const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}

export const uniCopy = function ({ data, success }) {
  // #ifndef H5
  uni.setClipboardData({
    data: data,
    success() {
      success && success()
    },
  })
  // #endif
  // #ifdef H5
  if (!document.queryCommandSupported('copy')) {
    //为了兼容有些浏览器 queryCommandSupported 的判断
    // 不支持
  }
  const textarea = document.createElement('textarea') as any
  textarea.value = data
  textarea.readOnly = 'readOnly'
  document.body.appendChild(textarea)
  textarea.select() // 选择对象
  textarea.setSelectionRange(0, data.length) //核心
  const result = document.execCommand('copy') // 执行浏览器复制命令
  if (result) {
    success && success()
  }
  textarea.remove()
  // #endif
}

export const subscribe = (templateId) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP_WEIXIN
    if (wx.requestSubscribeMessage) {
      wx.requestSubscribeMessage({
        tmplIds: templateId,
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        },
      })
    } else {
      uni.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false,
        success(res) {
          reject({})
        },
      })
    }
    // #endif
    // #ifndef MP-WEIXIN
    resolve({})
    // #endif
  })
}

/**
 * 判断是否为空
 */
export const isEmpty = (value) => {
  switch (typeof value) {
    case 'undefined':
      return true
    case 'string':
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
      break
    case 'boolean':
      if (!value) return true
      break
    case 'number':
      if (0 === value || isNaN(value)) return true
      break
    case 'object':
      if (null === value || value.length === 0) return true
      for (const i in value) {
        return false
      }
      return true
  }
  return false
}
