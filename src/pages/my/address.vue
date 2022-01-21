<template>
  <view>
    <view class="address-management" :class="addressList.length < 1 ? 'fff' : ''">
      <view v-for="item in addressList" :key="item.id" class="item borRadius14">
        <view class="address">
          <view class="consignee"
            >收货人：{{ item.name }}<text class="phone">{{ item.mobile }}</text></view
          >
          <view>收货地址：{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</view>
        </view>
        <view class="operation acea-row row-between-wrapper">
          <!-- #ifdef MP -->
          <view class="radio" :class="item.is_default === '1' ? 'selected' : ''" @click="changeDefault(item)">
            <text v-if="item.is_default === '1'" class="iconfont icon-radio-checked"></text>
            <text v-else class="iconfont icon-radio-uncheck"></text>
            <text>设为默认</text>
          </view>
          <!-- #endif -->
          <view class="acea-row row-middle">
            <view class="btn" @click="editAddress(item)"><text class="iconfont icon-edit"></text>编辑</view>
            <view class="btn" @click="delAddress(item.id)"><text class="iconfont icon-delete"></text>删除</view>
          </view>
        </view>
      </view>

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
import { fetchAddressList, fetchChangeDefault, fetchDelAddress } from '@/api/address'
import { Tips } from '@/utils/util'

export default defineComponent({
  name: 'AddressManage',
  setup() {
    const state = reactive({
      addressList: [] as any[],
      loadTitle: '加载更多',
      loading: false,
      apiLoading: false,
    })

    /**
     * 获取地址列表
     */
    const getAddressList = () => {
      fetchAddressList()
        .then((res) => {
          if (res.code === 0) {
            state.addressList = [] // 小程序BUG？
            setTimeout(() => (state.addressList = res.data.list))
          }
          state.loadTitle = '到底了'
          state.loading = false
        })
        .catch(() => {
          state.loading = false
        })
    }

    /**
     * 更改默认
     * @param item
     */
    const changeDefault = (item) => {
      console.log('item', item)
      const data = {
        id: item.id,
        type: item.type,
        is_default: item.is_default === '1' ? 0 : 1,
      }
      fetchChangeDefault(data)
        .then((r) => {
          if (r.code === 0) {
            Tips({
              title: '设置成功',
            })
            getAddressList()
          } else {
            Tips({
              title: '设置失败',
            })
          }
        })
        .catch((err) => console.log(err))
    }

    /**
     * 编辑列表
     * @param item
     */
    const editAddress = (item) => {
      uni.navigateTo({
        url: `/pages/my/addressEdit?id=${item.id}&is_refund_address=${item.is_refund_address}&type=${item.type}`,
      })
    }

    /**
     * 删除地址
     * @param id
     */
    const delAddress = (id) => {
      uni.showModal({
        content: '确定删除收货地址',
        success: function (res) {
          if (res.confirm) {
            fetchDelAddress({ id }).then((info) => {
              if (info.code === 0) {
                getAddressList()
              } else {
                uni.showToast({ title: info.msg, icon: 'none' })
              }
            })
          }
        },
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

    onShow(() => {
      getAddressList()
    })

    return {
      ...toRefs(state),
      addAddress,
      editAddress,
      getWxAddress,
      delAddress,
      changeDefault,
    }
  },
})
</script>

<style scoped lang="scss">
@import '@/static/css/variable.scss';

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
  color: $theme-font-color;
}

.address-management .item .address .consignee .phone {
  margin-left: 25rpx;
}

.address-management .item .operation {
  height: 83rpx;
  font-size: 28rpx;
  color: $theme-font-color;
}

.address-management .item .operation .radio text {
  margin-left: 13rpx;
}

.address-management .item .operation .iconfont {
  color: $theme-font-color;
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
  bottom: 30rpx;
  height: 106rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.footer .addressBnt {
  width: 100%;
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

.btn {
  padding-right: 20rpx;
}
</style>
