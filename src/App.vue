<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { store } from '@/store'
import { MallConfigActionTypes } from '@/store/modules/mallConfig/action-types'
import { checkLogin } from '@/libs/login'
import Wechat from '@/libs/wechat'
import Cache from '@/utils/cache'
import { parseQuery } from '@/utils'
import { getLocation, getLocationCity } from './utils/location.js'
onLaunch((option) => {
  const isLogin = store.state.app.token
  store.dispatch(MallConfigActionTypes.ACTION_MALL_GET_CONFIG)
  console.log('App Launch isLogin', isLogin)
  // #ifdef H5
  let snsapiBase = 'snsapi_base'
  let urlData = location.pathname + location.search
  if (!isLogin && Wechat.isWeixin()) {
    console.log('onLaunch-option', parseQuery())
    const { code, state, back_url } = parseQuery() as any
    if (code && location.pathname.indexOf('/pages/my/login') === -1) {
      console.log('存储静默授权code', code)
      // 存储静默授权code
      uni.setStorageSync('snsapiCode', code)
      Wechat.auth(code)
        .then((res) => {
          Cache.set('isFetchLogined', 'isFetchLogined')
          console.log('back_url', back_url)
          location.replace(decodeURIComponent(decodeURIComponent(back_url)))
        })
        .catch((error) => {
          console.error('静默登录出错：', error)
        })
    } else {
      if (!Cache.has('isFetchLogined')) {
        if (location.pathname.indexOf('/pages/my/login') === -1) {
          Wechat.oAuth(snsapiBase, urlData)
        }
      }
    }
  }
  // #endif

  getLocation().then((res) => {
    getLocationCity(res.latitude, res.longitude).then((res) => {
      console.log('city', res)
      uni.setStorageSync('city', res.address_component.city)
    })
  })
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'static/icon/iconfont.css';
@import 'static/css/u-index.scss';
@import 'static/css/flex.scss';
@import 'static/css/base.css';
@import 'static/css/mixn.scss';
@import 'static/css/common.scss';

/* 条件编译，仅在H5平台生效 */
// #ifdef H5
body::-webkit-scrollbar,
html::-webkit-scrollbar {
  display: none;
}

// #endif
view {
  box-sizing: border-box;
}

.bg-color-red {
  background-color: #e93323 !important;
}

.syspadding {
  padding-top: var(--status-bar-height);
}

.flex {
  display: flex;
}

.uni-scroll-view::-webkit-scrollbar {
  /* 隐藏滚动条，但依旧具备可以滚动的功能 */
  display: none;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
