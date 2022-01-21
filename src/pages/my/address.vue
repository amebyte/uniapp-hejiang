<template>
  <view>
    <view class="address-management" :class="addressList.length < 1 ? 'fff' : ''">
      <radio-group v-if="addressList.length" class="radio-group" @change="radioChange">
        <view v-for="(item, index) in addressList" :key="index" class="item borRadius14">
          <view class="address">
            <view class="consignee"
              >收货人：{{ item.name }}<text class="phone">{{ item.phoneNumber }}</text></view
            >
            <view>收货地址：{{ item.province }}{{ item.city }}{{ item.region }}{{ item.street }}</view>
          </view>
          <view class="operation acea-row row-between-wrapper">
            <!-- #ifndef MP -->
            <radio class="radio" :value="index.toString()" :checked="item.default" style="transform: scale(0.8)">
              <text>设为默认</text>
            </radio>
            <!-- #endif -->
            <!-- #ifdef MP -->
            <view>
              <radio class="radio" :value="index" :checked="item.default" style="transform: scale(0.8)"> </radio>
              <text>设为默认</text>
            </view>
            <!-- #endif -->
            <view class="acea-row row-middle">
              <view @click="editAddress(item)"><text class="iconfont icon-bianji"></text>编辑</view>
              <view @click="delAddress(item.id)"><text class="iconfont icon-shanchu"></text>删除</view>
            </view>
          </view>
        </view>
      </radio-group>
      <view v-if="addressList.length" class="loadingicon acea-row row-center-wrapper">
        <text class="loading iconfont icon-jiazai" :hidden="loading == false"></text>{{ loadTitle }}
      </view>
      <view v-if="addressList.length < 1" class="noCommodity">
        <view class="no-data">
          <!-- <text class="iconfont icon-arrow-right"></text> -->
          无地址信息
          <!-- <image src='../../../static/images/noAddress.png'></image> -->
        </view>
      </view>
      <view style="height: 120rpx"></view>
    </view>
    <view class="footer acea-row row-between-wrapper">
      <!-- #ifdef MP-->
      <view class="addressBnt bg-color" @click="addAddress"
        ><text class="iconfont icon-add-bold"></text>添加新地址
      </view>
      <view v-if="false" class="addressBnt wxbnt" @click="getWxAddress"
        ><text class="iconfont icon-wechat"></text>导入微信地址
      </view>
      <!-- #endif -->
      <!-- #ifdef H5-->
      <view class="addressBnt bg-color" @click="addAddress"
        ><text class="iconfont icon-add-bold"></text>添加新地址</view
      >
      <view v-if="false" class="addressBnt wxbnt" @click="getWxAddress">
        <text class="iconfont icon-wechat"></text>导入微信地址
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import { fetchUserAddress } from '@/api/address'
import { Tips } from '@/utils/util'

export default defineComponent({
  name: 'AddressManage',
  setup() {
    const state = reactive({
      addressList: [],
      loadTitle: '加载更多',
      loading: false,
      apiLoading: false,
    })

    /**
     * 获取地址列表
     */
    const getAddressList = () => {
      fetchUserAddress()
        .then((res) => {
          console.log('res', res)
          if (res.code === 0) state.addressList = res.data.list
          state.loadTitle = '到底了'
          state.loading = false
        })
        .catch(() => {
          state.loading = false
        })
    }

    /**
     * 编辑列表
     * @param item
     */
    const editAddress = (item) => {
      uni.navigateTo({
        url: './add',
        success: function (res) {
          res.eventChannel.emit('dataFromOpenerPage', item)
        },
      })
    }

    /**
     * 删除地址
     * @param id
     */
    const delAddress = (id) => {
      api.delAddress(id).then((r) => {
        if (r.code === 0) Tips({ title: '删除成功', icon: 'success' })
        getAddressList()
      })
    }

    /**
     * 跳转添加
     */
    const addAddress = () => {
      uni.navigateTo({
        url: '/pages/my/addressEdit',
      })
    }

    /**
     * 获取微信地址
     */
    const getWxAddress = () => {
      // #ifdef MP-WEIXIN
      uni.authorize({
        scope: 'scope.address',
        success: function (res) {
          uni.chooseAddress({
            success: function (res) {
              console.log(res)
              const item = {
                province: res.provinceName,
                city: res.cityName,
                region: res.countyName,
                detailAddress: res.detailInfo,
                default: false,
                name: res.userName,
                phoneNumber: res.telNumber,
                id: '',
              }
              editAddress(item)
            },
            fail: function (res) {
              if (res.errMsg == 'chooseAddress:cancel')
                return Tips({
                  title: '取消选择',
                })
            },
          })
        },
        fail: function (res) {
          uni.showModal({
            title: '您已拒绝导入微信地址权限',
            content: '是否进入权限管理，调整授权？',
            success(res) {
              if (res.confirm) {
                uni.openSetting({
                  success: function (res) {},
                })
              } else if (res.cancel) {
                return Tips({
                  title: '已取消！',
                })
              }
            },
          })
        },
      })
      // #endif
      // #ifdef H5
      // return
      //   this.$wechat
      //     .openAddress()
      //     .then((res) => {
      //       const item = {
      //         province: res.provinceName,
      //         city: res.cityName,
      //         region: res.countyName,
      //         detailAddress: res.detailInfo,
      //         default: false,
      //         name: res.userName,
      //         phoneNumber: res.telNumber,
      //         id: '',
      //       }
      //       editAddress(item)
      //     })
      //     .catch((err) => {
      //       console.log('失败', err)
      //     })
      // #endif
    }
    // 设置默认
    const radioChange = (e) => {
      const item = state.addressList[e.detail.value]
      item.default = true
      if (!state.apiLoading) {
        state.apiLoading = true
        api.updateAddr(item).then((res) => {
          // if(res.status === 'OK') {}
          state.apiLoading = false
        })
      }
    }

    onShow(() => {
      getAddressList()
    })

    return {
      ...toRefs(state),
      radioChange,
      addAddress,
      getWxAddress,
      delAddress,
    }
  },
})
</script>

<style scoped lang="scss">
.radio-group {
  width: 100%;
}

.address-management {
  padding: 20rpx 30rpx;
}

.address-management.fff {
  background-color: #fff;
  height: 1300rpx;
}

.line {
  width: 100%;
  height: 3rpx;

  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.address-management .item {
  background-color: #fff;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.address-management .item .address {
  padding: 35rpx 0;
  border-bottom: 1rpx solid #eee;
  font-size: 28rpx;
  color: #282828;
}

.address-management .item .address .consignee {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.address-management .item .address .consignee .phone {
  margin-left: 25rpx;
}

.address-management .item .operation {
  height: 83rpx;
  font-size: 28rpx;
  color: #282828;
}

.address-management .item .operation .radio text {
  margin-left: 13rpx;
}

.address-management .item .operation .iconfont {
  color: #2c2c2c;
  font-size: 35rpx;
  vertical-align: -2rpx;
  margin-right: 10rpx;
}

.address-management .item .operation .iconfont.icon-shanchu {
  margin-left: 35rpx;
  font-size: 38rpx;
}

.footer {
  position: fixed;
  width: 100%;
  background-color: #fff;
  bottom: 0;
  height: 106rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.footer .addressBnt {
  width: 330rpx;
  height: 76rpx;
  border-radius: 50rpx;
  text-align: center;
  line-height: 76rpx;
  font-size: 30rpx;
  color: #fff;
}

.footer .addressBnt.on {
  width: 690rpx;
  margin: 0 auto;
}

.footer .addressBnt .iconfont {
  font-size: 35rpx;
  margin-right: 8rpx;
  vertical-align: -1rpx;
}

.footer .addressBnt.wxbnt {
  background-color: #009688;
}

.no-data {
  text-align: center;
}

.borRadius14 {
  border-radius: 14rpx !important;
}

radio-group {
  display: inline-block;
}

.bg-color {
  background-color: #1aa86c;
}
</style>
