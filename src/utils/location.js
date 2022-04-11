// 和定位相关的方法
import TencentMap from '../plugin/qqmap-wx-jssdk.min.js'

// 腾讯地图的密钥
const key = 'XX4BZ-VIVLW-OYXRL-RWJTO-4UMDH-KUFSW'

// 获取用户是否开启定位权限
export function getLoactionAuth() {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userLocation']) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail() {
        resolve(false)
      },
    })
  })
}

// 获取经纬度
export function getLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: function (res) {
        uni.setStorageSync('user_latitude', res.latitude)
        uni.setStorageSync('user_longitude', res.longitude)
        resolve(res)
      },
      fail: function (err) {
        console.log('定位失败：', err)
        // uni.showToast({
        //     title: '访问位置被拒绝'
        // })
        reject('定位失败，请开启设备的位置信息')
      },
    })
  })
}

// 通过经纬度获取地址信息
export function getLocationCity(latitude, longitude) {
  // #ifdef H5
  // 存在跨域需要在manifest中代理一下
  let baseUrl = `/TencentGet/?coord_type=5&get_poi=0&output=json&location=${latitude},${longitude}&key=${key}`

  return new Promise((resolve, reject) => {
    uni
      .request({
        url: baseUrl,
        method: 'GET',
      })
      .then((res) => {
        console.log('getLocationCity:', res)
        uni.setStorageSync('city_address', res.data.result)
        uni.setStorageSync('city', res.data.result.address_component.city)
        resolve(res.data.result)
      })
      .catch((err) => {
        console.log('getLocationCityErr:', err)
      })
  })
  // #endif
  // 除H5之外
  // #ifndef H5
  return new Promise((resolve, reject) => {
    var that = this
    var map = new TencentMap({
      key: key,
    })
    map.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      success: function (res) {
        // console.log('腾讯获取城市名', res)
        uni.setStorageSync('city_address', res.result)
        uni.setStorageSync('city', res.result.address_component.city)
        resolve(res.result)
      },
      fail: function (err) {
        reject(err)
      },
    })
  })
  // #endif
}
