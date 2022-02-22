<!-- 全局支付组件 -->
<template>
  <view class="app-payment main-center cross-center" :class="showPayment ? 'show' : ''">
    <view v-if="payData" class="modal">
      <view class="title">
        <view>支付方式</view>
        <view class="cancel" @click="cancel">
          <image src="/static/image/icon/close.png"></image>
        </view>
      </view>
      <view class="pay-amount">支付金额 {{ payData.amount }} 元</view>
      <view class="pay-type-list">
        <view
          v-for="(item, index) in payData.list"
          :key="index"
          class="pay-type-item cross-center"
          @click="checkPayType(index)"
        >
          <view class="box-grow-0">
            <image class="pay-type-icon" :src="item.icon"></image>
          </view>
          <view class="box-grow-1">
            <view class="pay-type-name">{{ item.name }}</view>
            <view v-if="item.desc" class="pay-type-desc">{{ item.desc }}</view>
          </view>
          <view class="box-grow-0">
            <view
              v-if="item.key === 'balance' && item.desc === '账户余额不足'"
              style="height: 26rpx; width: 113rpx"
              @click.prevent.stop="navPay"
            >
              <image style="height: 100%; width: 100%" load-lazy="true" src="/static/image/pay-td.png"></image>
            </view>
            <app-radio v-else-if="item.checked" v-model="item.checked" :theme="getTheme" type="round"></app-radio>
          </view>
          <view v-if="printPassword && item.key === 'balance'" class="into-modal main-center cross-center">
            <view v-if="item.is_pay_password == 0 && !setPassword" class="password-tip">
              <view class="password-content dir-top-nowrap main-center cross-center">
                <view>您的账户尚未设置余额支付密码</view>
                <view>是否立即设置？</view>
              </view>
              <view class="password-btn main-center cross-center">
                <view @click="payByBalance">暂不设置</view>
                <view class="line"></view>
                <view
                  :style="{ color: getTheme.color }"
                  @click="
                    setPassword = !setPassword
                    password = ''
                  "
                  >确认</view
                >
              </view>
            </view>
            <view v-else-if="printPassword" class="password-view">
              <image
                class="password-close"
                src="/static/image/icon/icon-close.png"
                @click="
                  printPassword = false
                  setPassword = false
                  verifyPassword = false
                "
              ></image>
              <view class="password-title">请{{ verifyPassword ? '确认' : '输入' }}余额支付密码</view>
              <!-- #ifdef MP-ALIPAY -->
              <input
                v-model="password"
                type="number"
                :class="!haveFocus ? 'input' : ''"
                @focus="haveFocus = true"
                @input="passwordInput"
                @blur="
                  haveFocus = false
                  getFocus = false
                "
              />
              <!-- #endif -->
              <!-- #ifdef MP-WEIXIN -->
              <input
                v-model="password"
                type="number"
                style="top: 0; right: 400%"
                :focus="getFocus"
                @input="passwordInput"
                @blur="getFocus = false"
              />
              <!-- #endif -->
              <!-- #ifndef MP-ALIPAY || MP-WEIXIN -->
              <input
                v-show="getFocus"
                v-model="password"
                type="number"
                style="top: 0; right: 400%"
                :focus="getFocus"
                @input="passwordInput"
                @blur="getFocus = false"
              />
              <!-- #endif -->
              <view class="passoword-input main-center cross-center" @click="getInputFocus">
                <view class="password-item main-center cross-center">
                  <view v-if="password.length > 0" class="password-placeholder"></view>
                </view>
                <view class="password-item main-center cross-center">
                  <view v-if="password.length > 1" class="password-placeholder"></view>
                </view>
                <view class="password-item main-center cross-center">
                  <view v-if="password.length > 2" class="password-placeholder"></view>
                </view>
                <view class="password-item main-center cross-center">
                  <view v-if="password.length > 3" class="password-placeholder"></view>
                </view>
                <view class="password-item main-center cross-center">
                  <view v-if="password.length > 4" class="password-placeholder"></view>
                </view>
                <view class="password-item main-center cross-center">
                  <view v-if="password.length > 5" class="password-placeholder"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="footer">
        <!--  #ifdef MP -->
        <app-button type="important" :theme="getTheme" round @click="confirm">提交订单</app-button>
        <!--  #endif-->
        <!--  #ifdef H5 -->
        <app-button type="important" :theme="getTheme" round @click.stop="confirm">提交订单</app-button>
        <!--  #endif-->
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onUnload, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs, nextTick } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { store } from '@/store'
import AppRadio from '@/components/app-radio/app-radio.vue'

export default defineComponent({
  name: 'AppPayment',
  components: { AppRadio },
  setup() {
    const state = reactive({
      is_need_pay_password: 0,
      haveFocus: false,
      getFocus: false,
      printPassword: false,
      setPassword: false,
      verifyPassword: false,
      password: '',
      verify_pay_password: '',
      pay_password: '',
      payPassword: '',
    })

    const showPayment = computed(() => store.state.payment.showPayment)
    const payData = computed(() => store.state.payment.payData)
    const getInputFocus = () => {
      nextTick(() => {
        state.getFocus = true
      })
    }

    const passwordInput = () => {
      if (state.password.length == 6) {
        setTimeout(() => {
          if (state.setPassword) {
            setPayPassword()
          } else {
            uni.showLoading({
              mask: true,
            })
            uni.hideKeyboard()
            verifyPayPassword()
          }
        })
      }
    }

    const setPayPassword = () => {
      if (state.password.length < 6) {
        return false
      }
      if (!state.verifyPassword) {
        state.pay_password = state.password.toString().substring(0, 6)
        state.verifyPassword = true
        state.password = ''
      } else {
        state.verify_pay_password = state.password.toString().substring(0, 6)
        if (state.pay_password === state.verify_pay_password) {
          uni.showLoading({
            mask: true,
          })
          let data = {
            pay_password: state.pay_password,
            verify_pay_password: state.verify_pay_password,
          }
          this.$request({
            url: this.$api.member.set_password,
            method: 'post',
            data: data,
          }).then((response) => {
            uni.hideLoading()
            if (response.code === 0) {
              state.payPassword = state.pay_password
              state.printPassword = false
              state.setPassword = false
              state.verifyPassword = false
              state.password = ''
              state.pay_password = ''
              state.verify_pay_password = ''
              store.commit('payment/showPayment', false)
              payByBalance()
            } else {
              state.password = ''
              state.pay_password = ''
              state.verify_pay_password = ''
              uni.showToast({
                icon: 'none',
                title: response.msg,
              })
            }
          })
        } else {
          state.verifyPassword = false
          state.password = ''
          state.pay_password = ''
          state.verify_pay_password = ''
          uni.showToast({
            icon: 'none',
            title: '两次输入的密码不一致',
          })
        }
      }
    }

    const navPay = () => {
      store.commit('payment/showPayment', false)
      store.state.payment.reject({
        errMsg: '5b03b6e009796c698d132908cb635fca',
      })
      uni.navigateTo({
        url: '/pages/balance/recharge',
      })
    }

    const pay = (id) => {
      return new Promise((resolve, reject) => {
        store.commit('payment/setAll', {
          showPayment: false,
          payData: null,
          payType: null,
          id: id,
          resolve: resolve,
          reject: reject,
        })
        console.log('debug payment, setAll ok, id:', store.state.payment.id)
        console.log('debug payment, setAll ok, resolve:', store.state.payment.resolve)
        console.log('debug payment, setAll ok, reject:', store.state.payment.reject)
        uni.showLoading({
          mask: true,
          title: '请求支付...',
        })
        this.$request({
          url: this.$api.payment.get_payments,
          data: {
            id: id,
          },
        })
          .then((response) => {
            uni.hideLoading()
            console.log('debug 1--->', response)
            if (response.code === 0) {
              console.log('debug payment, set resolve 2,', store.state.payment.resolve)
              return showPaymentModal(response.data)
            } else {
              response.errMsg = response.msg || ''
              return store.state.payment.reject(response.msg)
            }
          })
          .catch((e) => {
            uni.hideLoading()
            e.errMsg = e.msg || ''
            return store.state.payment.reject(e)
          })
      })
    }

    const showPaymentModal = (data) => {
      console.log('debug 2--->', data)
      for (let i in data.list) {
        if (typeof data.list[i].checked === 'undefined') {
          data.list[i].checked = false
        }
      }
      store.commit('payment/payData', data)
      if (data.amount === 0 || data.amount === 0.0 || data.amount === '0' || data.amount === '0.00') {
        store.commit('payment/payType', 'balance')
        for (let i in store.state.payment.payData.list) {
          if (store.state.payment.payData.list[i].key === 'balance') {
            store.state.payment.payData.list[i].checked = true
          } else {
            store.state.payment.payData.list[i].checked = false
          }
        }
        confirm()
        return
      }
      store.commit('payment/showPayment', true)
    }

    const confirm = () => {
      console.log('payment confirm 1:')
      console.log('debug payment, confirm 1,', store.state.payment.resolve)
      for (let i in store.state.payment.payData.list) {
        if (store.state.payment.payData.list[i].checked) {
          store.commit('payment/payType', store.state.payment.payData.list[i].key)
        }
      }
      if (!store.state.payment.payType) {
        uni.showModal({
          title: '提示',
          content: '请选择支付方式',
          showCancel: false,
        })
        return
      }
      store.commit('payment/showPayment', false)
      console.log('payment confirm 2:', store.state.payment.payType)
      console.log('debug payment, confirm 2,', store.state.payment.resolve)
      return this.getPayData()
    }

    const cancel = () => {
      store.commit('payment/showPayment', false)
      return store.state.payment.reject({
        errMsg: '支付取消',
      })
    }

    const checkPayType = (index) => {
      if (store.state.payment.payData.list[index].disabled || store.state.payment.payData.list[index].checked) {
        return false
      }
      const payData = store.state.payment.payData
      for (let i in payData.list) {
        if (i == index) {
          payData.list[i].checked = true
        } else {
          payData.list[i].checked = false
        }
      }
      store.commit('payment/payData', payData)
    }

    const getPayData = () => {
      console.log('debug payment, getPayData 1,', store.state.payment.resolve)
      uni.showLoading({
        mask: true,
        title: '请求支付...',
      })
      let _this = this
      let data = {
        id: store.state.payment.id,
        pay_type: store.state.payment.payType,
      } as any
      // #ifdef H5
      this.$storage.setStorageSync('WEB_URL', window.location.href + '&pay_id_weChart=' + data.id + '&isWechat=true')
      if (window.location.hash.indexOf('/pages/balance/recharge') > -1) {
        data.url = window.location.href.split('#')[0] + '#/pages/balance/recharge?isPay=ture'
      } else {
        if (window.location.hash.indexOf('?') > -1) {
          data.url = window.location.href + '&isPay=ture'
        } else {
          data.url = window.location.href + '?isPay=ture'
        }
      }
      data.url += `&isWechat=true&payType=${store.state.payment.payType}`
      if (!this.$jwx.isWechat()) {
        data.url += '&pay_id_weChart=' + data.id
      }
      // #endif
      this.$request({
        url: this.$api.payment.pay_data,
        data: data,
      })
        .then((response) => {
          uni.hideLoading()
          if (response.code === 0) {
            switch (store.state.payment.payType) {
              case 'balance':
                callBranch(response.data)
                break
              case 'huodao':
                callHuodao(response.data)
                break
              // #ifdef H5
              case 'wechat_h5':
                console.log('debug payment, wechat_h5')
                this.$jwx.chooseWXPay({
                  timestamp: response.data.timeStamp,
                  nonceStr: response.data.nonceStr,
                  packAge: response.data.package,
                  signType: response.data.signType,
                  paySign: response.data.paySign,
                  webUrl: response.data.mweb_url,
                  success() {
                    store.state.payment.resolve({
                      errMsg: '支付成功',
                    })
                  },
                  fail(res) {
                    store.state.payment.reject({
                      errMsg: res.msg,
                    })
                  },
                })
                uni.showModal({
                  content: '确定已完成支付？',
                  confirmText: '确定',
                  cancelText: '返回支付',
                  success(res) {
                    if (res.confirm) {
                      weChartPay(store.state.payment.id)
                    } else if (res.cancel) {
                      store.state.payment.reject({
                        errMsg: '支付取消',
                      })
                    }
                  },
                })
                break
              case 'alipay_h5':
                if (this.$jwx.isWechat()) {
                  _AP.pay(response.data.url)
                } else {
                  window.location.href = response.data.url
                  uni.showModal({
                    content: '确定已完成支付？',
                    confirmText: '确定',
                    cancelText: '返回支付',
                    success(res) {
                      if (res.confirm) {
                        weChartPay(store.state.payment.id)
                        // _this.$store.state.payment.resolve({
                        //     errMsg: '支付成功',
                        // });
                      } else if (res.cancel) {
                        store.state.payment.reject({
                          errMsg: '支付取消',
                        })
                      }
                    },
                    fail() {},
                  })
                }
                console.log('debug payment, alipay_h5')
                break
              // #endif
              default:
                // #ifdef MP
                console.log('debug payment, getPayData 2,', store.state.payment.resolve)
                callPlatformPayment(response.data)
                // #endif
                break
            }
          } else {
            return store.state.payment.reject(response.msg)
          }
        })
        .catch((e) => {
          uni.hideLoading()
          e.errMsg = e.msg || ''
          return store.state.payment.reject(e)
        })
    }

    const callBranch = (data) => {
      let that = this
      if (
        data.order_amount === 0 ||
        data.order_amount === 0.0 ||
        data.order_amount === '0' ||
        data.order_amount === '0.00'
      ) {
        payByBalance()
      } else {
        uni.showModal({
          title: '余额支付确认',
          content: `账户余额：${data.balance_amount}，支付金额：${data.order_amount}`,
          success: (e) => {
            if (e.confirm) {
              for (let item of payData.value.list) {
                if (item.key == 'balance') {
                  if (item.is_open_pay_password == 1) {
                    state.payPassword = ''
                    state.is_need_pay_password = item.is_pay_password
                    state.password = ''
                    store.commit('payment/showPayment', true)
                    state.printPassword = true
                    setTimeout(() => {
                      state.getFocus = true
                    }, 800)
                  } else {
                    payByBalance()
                  }
                  break
                }
              }
            } else {
              return store.state.payment.reject({
                errMsg: '支付取消.',
              })
            }
          },
        })
      }
    }

    const verifyPayPassword = () => {
      if (state.password.length < 6) {
        return false
      }
      state.payPassword = state.password.toString().substring(0, 6)
      this.$request({
        url: this.$api.member.verify_password,
        data: {
          pay_password: state.payPassword,
        },
        method: 'post',
      })
        .then((response) => {
          state.password = ''
          uni.hideLoading()
          if (response.code === 0) {
            store.commit('payment/showPayment', false)
            payByBalance()
          } else {
            state.password = ''
            state.payPassword = ''
            uni.showModal({
              title: '提示',
              content: response.msg,
              showCancel: false,
            })
          }
        })
        .catch((e) => {
          uni.hideLoading()
          e.errMsg = e.msg || ''
          return store.state.payment.reject(e)
        })
    }

    const payByBalance = () => {
      uni.showLoading({
        mask: true,
        title: '支付中...',
      })
      let para = {
        id: store.state.payment.id,
        pay_password: state.payPassword ? state.payPassword : '',
        is_need_pay_password: state.is_need_pay_password,
      }
      this.$request({
        url: this.$api.payment.pay_buy_balance,
        data: para,
      })
        .then((response) => {
          uni.hideLoading()
          if (response.code === 0) {
            store.commit('payment/showPayment', false)
            return store.state.payment.resolve({
              errMsg: '支付成功',
            })
          } else {
            return store.state.payment.reject({
              errMsg: response.msg,
            })
          }
        })
        .catch((e) => {
          e.errMsg = e.msg || ''
          return store.state.payment.reject(e)
        })
    }

    const callHuodao = () => {
      uni.showLoading({
        mask: true,
        title: '提交中...',
      })
      this.$request({
        url: this.$api.payment.pay_buy_huodao,
        data: {
          id: store.state.payment.id,
        },
      })
        .then((response) => {
          uni.hideLoading()
          if (response.code === 0) {
            return store.state.payment.resolve({
              errMsg: '支付成功',
            })
          } else {
            return store.state.payment.reject({
              errMsg: response.msg,
            })
          }
        })
        .catch((e) => {
          uni.hideLoading()
          e.errMsg = e.msg || ''
          return store.state.payment.reject(e)
        })
    }

    // #ifdef MP
    const callPlatformPayment = (data) => {
      console.log('debug payment, callPlatformPayment 1,', store.state.payment.resolve)
      let paymentProvider = null as any
      // #ifdef MP-WEIXIN
      paymentProvider = ['wxpay']
      // #endif
      // #ifdef MP-ALIPAY
      paymentProvider = ['alipay']
      // #endif
      // #ifdef MP-BAIDU
      paymentProvider = ['baidu']
      // #endif
      // #ifdef MP-TOUTIAO
      paymentProvider = ['toutiao']
      // #endif
      uni.requestPayment({
        provider: paymentProvider,
        success: (e) => {
          console.log('debug payment, callPlatformPayment 3,', store.state.payment.resolve)
          console.log('success:', e)
          // #ifndef MP-ALIPAY
          return store.state.payment.resolve(e)
          // #endif
          // #ifdef MP-ALIPAY
          // eslint-disable-next-line no-unreachable
          if (e.resultCode === 9000 || e.resultCode === '9000') {
            return store.state.payment.resolve(e)
          } else {
            return store.state.payment.reject({
              errMsg: e.memo,
            })
          }
          // #endif
        },
        fail: (e) => {
          const cancelMsgList = ['requestPayment:fail cancel']
          if (e.errMsg && cancelMsgList.indexOf(e.errMsg) >= 0) {
            e.errMsg = '取消支付'
          }
          console.log('debug payment, callPlatformPayment 4,', store.state.payment.resolve)
          console.log('fail:', e)
          return store.state.payment.reject(e)
        },
        ...data,
      })
    }
    // #endif

    // #ifdef H5
    const alipayH5Pay = () => {}
    const weChartPay = (id) => {
      this.$request({
        url: this.$api.registered.pay,
        method: 'get',
        data: {
          payment_order_union_id: id,
        },
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.status === 1) {
            store.state.payment.resolve({
              errMsg: '支付成功',
            })
            uni.redirectTo({
              url: `/pages/order-submit/pay-result?payment_order_union_id=${id}`,
            })
          } else {
            uni.redirectTo({
              url: '/pages/order/index/index',
            })
          }
        }
      })
    }
    // #endif

    return {
      ...toRefs(state),
      showPayment,
      payData,
      getInputFocus,
      cancel,
      confirm,
      checkPayType,
    }
  },
})
</script>

<style scoped lang="scss">
$bigPadding: #{50rpx};
$smallPadding: #{25rpx};
$middlePadding: #{30rpx};
$smallFont: #{24rpx};
$lineWidth: #{1rpx};
$modalWidth: #{600rpx};
$iconWidth: #{60rpx};

.app-payment {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  opacity: 0;
  transition: 150ms;

  .modal {
    background: #fff;
    width: $modalWidth;
    border-radius: #{15rpx};

    .title {
      text-align: center;
      padding: $middlePadding;
      border-bottom: $lineWidth solid #e2e2e2;
      position: relative;
    }

    .cancel {
      position: absolute;
      right: 0;
      top: 0;
      padding: $middlePadding;

      image {
        width: #{36rpx};
        height: #{36rpx};
      }
    }

    .pay-amount {
      text-align: center;
      padding: $bigPadding;
      font-weight: bolder;
    }

    .pay-type-list {
      padding: 0 $bigPadding;
    }

    .pay-type-item {
      border-bottom: $lineWidth solid #e2e2e2;
      padding: $smallPadding 0;

      .pay-type-icon {
        width: $iconWidth;
        height: $iconWidth;
        margin-right: $smallPadding;
      }

      .pay-type-desc {
        color: #909090;
        font-size: $smallFont;
      }
    }

    .pay-type-item:last-child {
      border-bottom: none;
    }

    .footer {
      padding: $bigPadding;
    }
  }
}

.app-payment.show {
  visibility: visible;
  opacity: 1;
}
.into-modal {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 2100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: 150ms;
  .password-tip {
    width: #{630rpx};
    height: #{340rpx};
    position: relative;
    border-radius: #{16rpx};
    background-color: #fff;
    .password-content {
      height: #{240rpx};
      width: 100%;
      color: #353535;
    }
    .password-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      color: #666666;
      height: #{88rpx};
      border-top: #{2rpx} solid #e2e2e2;
      > view {
        width: 50%;
        text-align: center;
        height: #{88rpx};
        line-height: #{88rpx};
      }
      .line {
        width: #{2rpx};
        height: #{32rpx};
        background-color: #e2e2e2;
      }
    }
  }
  .password-view {
    position: relative;
    width: #{560rpx};
    height: #{300rpx};
    border-radius: #{16rpx};
    background-color: #fff;
    margin-top: #{-200rpx};
    .password-close {
      position: absolute;
      top: #{29rpx};
      right: #{28rpx};
      width: #{30rpx};
      height: #{30rpx};
      z-index: 2101;
    }
    .password-title {
      height: #{140rpx};
      line-height: #{140rpx};
      text-align: center;
      margin-bottom: #{128rpx};
    }
    .password-button {
      padding: 0 #{60rpx};
      position: relative;
      z-index: 2101;
    }
    input {
      position: absolute;
      top: -300%;
      width: #{475rpx};
      height: #{78rpx};
      margin: 0 auto;
      z-index: 9999;
    }
    .input {
      top: #{144rpx};
      height: #{70rpx};
      left: #{42.5rpx};
      color: #fff;
      font-size: #{1rpx};
      background-color: transparent;
      opacity: 0;
    }
    .passoword-input {
      position: absolute;
      background-color: #fff;
      top: #{140rpx};
      left: 0;
      width: 100%;
      z-index: 2101;
      .password-item {
        border: #{2rpx} solid #e2e2e2;
        margin-left: #{-2rpx};
        height: #{78rpx};
        width: #{78rpx};
        .password-placeholder {
          width: #{24rpx};
          height: #{24rpx};
          border-radius: 50%;
          background-color: #353535;
        }
      }
    }
  }
}
</style>
