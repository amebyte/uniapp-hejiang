<template>
  <view class="create-order-wrapper">
    <view class="top-bg"></view>
    <scroll-view scroll-y="true" scroll-with-animation="true" :style="'height:' + height + 'px;'" @scroll="scroll">
      <view class="container">
        <!--地址 start-->
        <view class="address-wrap">
          <view class="striped"></view>
          <!--邮寄到家 start-->
          <view v-if="previewData.address" class="address-info">
            <i class="iconfont icon-address"></i>
            <view class="content">
              <view class="top">
                <view class="name">{{ previewData.address.name }}</view>
                <view class="phone">{{ previewData.address.mobile }}</view>
              </view>
              <view class="detail-address">
                {{ previewData.address.province }}{{ previewData.address.city }}{{ previewData.address.district
                }}{{ previewData.address.detail }}
              </view>
              <navigator url="/pages/my/address">
                <view class="more"><i class="iconfont icon-arrow-right"></i></view>
              </navigator>
            </view>
          </view>
          <view v-else class="empty-address" @click="toAddress">
            <view class="top">添加地址</view>
            <text class="txt-tips">（请用户尽量填写详细的收货地址）</text>
            <view class="edit-more"><i class="iconfont icon-arrow-right"></i></view>
          </view>
          <!--邮寄到家 end-->
        </view>
        <!--地址 end-->

        <!-- 循环商户列表start -->
        <template v-for="(mch, mchIndex) in previewData.mch_list" :key="mchIndex">
          <!--购物车商品 start-->
          <view class="cart-goods-wrap">
            <view class="shop-name">{{ mch.mch.name || '' }}</view>
            <block v-for="(subGoodsItem, subGoodsIndex) in mch.goods_list" :key="subGoodsIndex">
              <view class="goods-item">
                <view class="photo">
                  <image
                    class="image"
                    :src="subGoodsItem.goods_attr.pic_url ? subGoodsItem.goods_attr.pic_url : subGoodsItem.cover_pic"
                  />
                </view>
                <view class="info">
                  <view class="name">
                    {{ subGoodsItem.name }}
                  </view>
                  <view class="attr">
                    <block v-for="(attrItem, attrIndex) in subGoodsItem.attr_list" :key="attrIndex">
                      <text style="padding-right: 10rpx">{{ attrItem.attr_group_name }}:{{ attrItem.attr_name }}</text>
                    </block>
                  </view>
                  <view class="price">
                    <view class="l"> ￥{{ subGoodsItem.unit_price }} x {{ subGoodsItem.num }}</view>
                    <view class="r"> ￥{{ subGoodsItem.total_original_price }}</view>
                  </view>
                </view>
              </view>
            </block>
          </view>
          <!--购物车商品 end-->

          <view class="label">
            <view class="title">
              <text class="txt">商品金额</text>
            </view>
            <view class="value">
              <text class="txt">¥：{{ mch.totalGoodsPrice }}</text>
            </view>
          </view>
          <view class="label">
            <view class="title">
              <text class="txt">会员优惠总价格</text>
            </view>
            <view class="value">
              <text class="txt highlight">¥：{{ mch.member_discount }}</text>
            </view>
          </view>
          <view class="label" style="display: none">
            <view class="title">
              <text class="txt">优惠劵</text>
              <view class="coupon-use-num">{{ ableUseCoupons.length }}张可用</view>
            </view>
            <view class="value" @click="openCouponsWindow">
              <text class="txt highlight">{{ choiceCoupon ? '-￥' + choiceCoupon.faceValue : '请选择优惠劵' }}</text>
              <text class="iconfont icon-arrow-right-bold"></text>
            </view>
          </view>
          <view class="label">
            <view class="title">
              <text class="txt">运费</text>
            </view>
            <view class="value">
              <text class="txt highlight">¥：{{ mch.express_price }}</text>
            </view>
          </view>
          <view class="label orderLabelMargin">
            <view class="remarks-title"> </view>
            <view class="value">
              共计{{ mch.goods_count }}件 小计：<text class="txt" style="color: #e60012">
                ￥{{ mch.total_price }}
              </text>
            </view>
          </view>
        </template>
        <!-- 循环商户列表 end -->
      </view>
    </scroll-view>
    <view class="footer-bar">
      <view class="total-info"
        >实付款：<text class="txt"> ￥{{ previewData.total_price }} </text></view
      >
      <view class="pay-btn" @click="createOrder">提交订单</view>
    </view>
    <!-- <drawerBottomSheet ref="drawerBottomSheet">
      <view slot="body">
        <view class="coupons-sheet-wrap">
          <view class="title">
            <view>可使用优惠券</view>
          </view>
          <scroll-view scroll-y style="height: 400rpx">
            <view class="content">
              <template v-if="couponsList.length">
                <couponListItem :coupons-list="couponsList" @useCoupon="useCoupon" />
              </template>
              <view v-else class="pictrue">
                <image src="../../../static/images/noCoupon.png"></image>
              </view>
            </view>
          </scroll-view>
          <view class="close" @tap="confirmCoupon">确定</view>
        </view>
      </view>
    </drawerBottomSheet> -->
    <AppPayment ref="appPaymentRef" />
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onUnload, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import { store } from '@/store'
import { Tips, subscribe } from '@/utils/util'
import Cache from '@/utils/cache'
import { fetchOrderPreview, fetchOrderSubmit, fetchOrderPayOrderId } from '@/api/order'
import { CartMutationTypes } from '@/store/modules/cart/mutation-types'
import AppPayment from '@/components/app-payment/app-payment.vue'

export default defineComponent({
  name: 'CreateOrder',
  components: {
    AppPayment,
    // drawerBottomSheet,
    // couponListItem,
  },
  setup() {
    const goodsItems = store.state.cart.selectedCart
    const state = reactive({
      height: 0,
      userAddress: null, // 用户地址
      isBuyNow: null,
      orderType: null, // 订单类型
      priceKey: null, // 价格字段
      totalPrice: 0, // 商品原始总价
      totalIntegral: 0, // 商品积分
      payTotalPrice: 0, // 实际付款总价
      goodsTotalNumber: 0, // 商品总数
      ableUseCoupons: [], // 可用的优惠劵
      couponsList: [], // 优惠劵,
      choiceCoupon: null as any, // 选择的优惠劵
      submiting: false,
      discount: '', // 优惠，满减优惠
      accumulatePoints: 0, // 我的积分

      previewData: {} as any,
      loadingPreviewData: true,
      plugin: null,
      submitLock: false,
      p_pay_id: '', //重新提交处理
      getPayDataTimer: null as any,
      showPayResult: true,
      payCancelUrl: '',
      orderPageUrl: '',
    })

    const appPaymentRef = ref(null)

    const scroll = () => {}
    /**
     * 打开优惠劵窗口
     */
    const openCouponsWindow = () => {
      //   this.$refs.drawerBottomSheet.show()
    }
    /**
     * 确定关闭优惠劵窗口
     */
    const confirmCoupon = () => {
      //   this.$refs.drawerBottomSheet.hide()
    }
    /**
     * 使用优惠劵回调
     * @param {Object} item
     */
    const useCoupon = (item) => {
      //   formatCoupons(item)
    }
    /**
     * 跳转到用户地址
     */
    const toAddress = () => {
      Tips('/pages/my/address')
    }

    const bookStorage = (type, store_id = '') => {
      let key = '_book_storage_order_preview'
      if (type === 'get') {
        return Cache.get(key)
      }
      if (type === 'save') {
        Cache.set(key, store_id ? store_id : 0)
      }
    }

    /**
     * 提交订单
     */
    const createOrder = () => {
      if (state.p_pay_id) {
        pay({
          id: state.p_pay_id,
        })
        return true
      } else {
        state.p_pay_id = ''
      }
      for (let i in store.state.cart.orderSubmitFromData.list) {
        const item = store.state.cart.orderSubmitFromData.list[i]
        if (!item.order_form_validate_result) continue
        if (item.order_form_validate_result.hasError) {
          uni.showModal({
            title: '提示',
            content: item.order_form_validate_result.errors[0].msg,
            showCancel: false,
          })
          return
        }
      }
      for (let i in store.state.cart.orderSubmitFromData.list) {
        for (let j in store.state.cart.orderSubmitFromData.list[i].goods_list) {
          const item = store.state.cart.orderSubmitFromData.list[i].goods_list[j]
          if (!item.goods_form_validate_result) continue
          if (item.goods_form_validate_result.hasError) {
            uni.showModal({
              title: '提示',
              content: item.goods_form_validate_result.errors[0].msg,
              showCancel: false,
            })
            return
          }
        }
        if (state.plugin === 'booking' && store.state.cart.orderSubmitFromData.list[i]) {
          bookStorage('save', store.state.cart.orderSubmitFromData.list[i].store_id)
        }
      }
      if (state.submitLock) return
      state.submitLock = true
      subscribe(state.previewData.template_message_list)
        .then((res) => {
          submit()
        })
        .catch(() => {
          submit()
        })
    }

    const submit = () => {
      uni.showLoading({
        mask: true,
        title: '提交中',
      })

      fetchOrderSubmit({ form_data: JSON.stringify(store.state.cart.orderSubmitFromData) })
        .then((response) => {
          if (response.code === 0) {
            getPayOrderId(response.data.queue_id, response.data.token)
          } else {
            state.submitLock = false
            uni.hideLoading()
            uni.showModal({
              title: '',
              content: response.msg,
              showCancel: false,
            })
          }
        })
        .catch((e) => {
          state.submitLock = false
          uni.hideLoading()
          uni.showModal({
            title: '提示',
            content: e.errMsg,
            showCancel: false,
          })
        })
    }

    const getPayOrderId = (queue_id, token) => {
      fetchOrderPayOrderId({
        queue_id: queue_id,
        token: token,
      })
        .then((response) => {
          if (response.code === 0) {
            if (response.data.retry && response.data.retry === 1) {
              state.getPayDataTimer = setTimeout(() => {
                getPayOrderId(queue_id, token)
              }, 1000)
            } else {
              uni.hideLoading()
              pay(response.data)
            }
          } else {
            state.submitLock = false
            uni.hideLoading()
            uni.showModal({
              title: '提示',
              content: response.msg,
              showCancel: false,
            })
          }
        })
        .catch((e) => {
          state.submitLock = false
          uni.hideLoading()
          uni.showModal({
            title: '提示',
            content: e.errMsg,
            showCancel: false,
          })
        })
    }

    const pay = (data) => {
      state.p_pay_id = data.id
      ;(appPaymentRef.value as any)
        .pay(data.id)
        .then((res) => {
          if (state.showPayResult) {
            uni.redirectTo({
              url: `/pages/order/payResult?payment_order_union_id=${data.id}&order_page_url=${encodeURIComponent(
                state.orderPageUrl
              )}`,
            })
          } else {
            let page_url = state.orderPageUrl
            if (page_url.indexOf('?') === -1) {
              page_url += '?'
            } else {
              page_url += '&'
            }

            delete data.id

            page_url += `pay_data=${JSON.stringify(data)}`

            uni.redirectTo({
              url: page_url,
            })
          }
        })
        .catch((e) => {
          if (state.payCancelUrl) {
            let page_url = state.payCancelUrl
            if (page_url.indexOf('?') === -1) {
              page_url += '?'
            } else {
              page_url += '&'
            }
            page_url += `pay_data=${JSON.stringify(data)}`
            uni.redirectTo({
              url: page_url,
            })
          } else {
            if (e.errMsg === '5b03b6e009796c698d132908cb635fca') {
              //重新发起支付
              state.submitLock = false
            } else {
              uni.showModal({
                title: '提交失败',
                content: e.errMsg,
                showCancel: false,
                success: () => {
                  uni.redirectTo({
                    url: state.orderPageUrl,
                  })
                },
              })
            }
          }
        })
    }

    const updateGoodsCount = () => {
      for (let i in state.previewData.mch_list) {
        let count = 0
        let totalGoodsPrice = 0
        for (let j in state.previewData.mch_list[i].goods_list) {
          count += parseInt(state.previewData.mch_list[i].goods_list[j].num)
          totalGoodsPrice += Number(state.previewData.mch_list[i].goods_list[j].total_price)
        }
        state.previewData.mch_list[i].goods_count = count
        state.previewData.mch_list[i].totalGoodsPrice = totalGoodsPrice.toFixed(2)
      }
    }

    const setFormData = (options) => {
      state.plugin = options.plugin || null
      state.orderPageUrl = options.orderPageUrl || '/pages/order/list'
      const list = store.state.cart.previewOrderParam
      // 商户列表先做下排序，主商城必须在最前
      for (let i in list) {
        if (parseInt(list[i].mch_id) === 0) {
          const _mchItem = list[i]
          list.splice(i, 1)
          list.unshift(_mchItem)
          break
        }
      }

      for (let i in list) {
        list[i].distance = 0
        list[i].remark = ''
        list[i].order_form = []
        list[i].use_integral = 0
        list[i].user_coupon_id = 0
        for (let j in list[i].goods_list) {
          list[i].goods_list[j].cart_id = list[i].goods_list[j].cart_id || 0
        }
        if (state.plugin === 'booking') {
          let store_id = bookStorage('get')
          list[i]['store_id'] = store_id ? store_id : ''
        }
      }
      store.commit(CartMutationTypes.SET_ORDER_SUBMIT_FROM_DATA, { list: list, address_id: 0, send_type: '' })
    }

    const getOrderPreview = () => {
      fetchOrderPreview({ form_data: JSON.stringify(store.state.cart.orderSubmitFromData) })
        .then((r) => {
          state.loadingPreviewData = false
          uni.hideLoading()
          if (r.code === 0) {
            if (r.data.allZiti && !r.data.address) {
              r.data.address = {
                name: '',
                mobile: '',
              }
            }
            for (let i in r.data.mch_list) {
              r.data.mch_list[i].showCouponPicker = false
              r.data.mch_list[i].noCoupons = false
              r.data.mch_list[i].showInsertRows = false
            }
            state.previewData = r.data
            // this.setDiyFormScrollStatus();
            // this.checkCouponError();
            // this.updateStoreDistance();
            updateGoodsCount()
          } else {
            uni.showModal({
              title: '提示',
              content: r.msg,
              showCancel: false,
              success: () => {
                uni.navigateBack({})
              },
            })
          }
        })
        .catch((err) => console.log(err))
    }

    onShow(() => {
      getOrderPreview()
    })

    onLoad((options) => {
      console.log('onLoad')
      setFormData(options)
      uni.getSystemInfo({
        success: function (res) {
          state.height = res.windowHeight
          //res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
        },
      })
    })

    onUnload(() => {
      if (state.getPayDataTimer) {
        clearTimeout(state.getPayDataTimer)
      }
    })

    return {
      ...toRefs(state),
      appPaymentRef,
      scroll,
      openCouponsWindow,
      confirmCoupon,
      useCoupon,
      toAddress,
      createOrder,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/static/css/variable.scss';
.create-order-wrapper {
  height: 100%;
  overflow-y: hidden;

  .top-bg {
    position: fixed;
    /* #ifndef H5 */
    top: 0;
    /* #endif */

    width: 100%;
    height: 600rpx;
    background: linear-gradient(180deg, #1aa86c 0%, rgba(230, 1, 19, 0) 100%);
  }

  .container {
    padding: 0 20rpx;
    padding-top: 20rpx;
    padding-bottom: 100rpx;

    .address-wrap {
      border-top: 1rpx solid #d1d1d1;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;

      .striped {
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 5px;
      }

      .address-info {
        display: flex;
        padding: 32rpx 0;
        position: relative;
        padding-left: 20rpx;

        .icon-address {
          color: $top-background-color;
        }

        .content {
          padding-right: 20rpx;

          .top {
            display: flex;

            .name {
              width: 352rpx;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              word-break: break-all;
              font-size: 28rpx;
              color: #010101;
              line-height: 28rpx;
            }

            .phone {
              width: 172rpx;
              text-align: right;
              font-size: 28rpx;
              color: #010101;
              line-height: 28rpx;
            }
          }

          .detail-address {
            width: 524rpx;
            margin-top: 22rpx;
            font-size: 28rpx;
            color: #999999;
            line-height: 28rpx;
          }

          .more {
            position: absolute;
            right: 22rpx;
            top: 45%;
            margin-top: -37rpx;
            height: 75rpx;
            line-height: 75rpx;
            width: 37rpx;
            text-align: right;
          }
        }
      }

      .empty-address {
        padding: 42rpx 30rpx;
        position: relative;

        .top {
          margin-bottom: 15rpx;
        }

        .txt-tips {
          color: #ea3401;
        }

        .edit-more {
          position: absolute;
          right: 22rpx;
          top: 50%;
          margin-top: -37rpx;
          height: 75rpx;
          line-height: 75rpx;
          width: 37rpx;
          text-align: right;
        }
      }
    }

    .cart-goods-wrap {
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 10px;

      .shop-name {
        padding-left: 20rpx;
        padding-top: 25rpx;
        padding-bottom: 25rpx;
        margin-top: 20rpx;
      }

      .goods-item {
        background-color: #fff;
        display: flex;
        flex-direction: row;
        height: 220rpx;

        .photo {
          width: 180rpx;
          height: 180rpx;
          margin: 20rpx 20rpx 20rpx 30rpx;

          .image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 10rpx;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-right: 20rpx;
          .name {
            font-size: 28rpx;
            line-height: 30rpx;
            color: #010101;
            margin-bottom: 20rpx;
            width: 100%;
            margin-top: 34rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            height: 60rpx;
          }

          .attr {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 12rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }

          .price {
            display: flex;
            flex-direction: row;

            .l {
              flex: 1;
              display: flex;
              align-items: flex-end;
              color: #666;
              font-size: 24rpx;
            }

            .r {
              display: flex;
              flex-direction: row;
              flex: 1;
              justify-content: flex-end;
              align-items: flex-end;
              margin-right: 28rpx;
              font-family: HelveticaNeue;
              font-size: 28rpx;
              color: #ea3401;
              font-weight: 600;
            }
          }
        }
      }
    }

    .label {
      display: flex;
      flex-direction: row;
      height: 100rpx;
      align-items: center;
      padding: 0 30rpx 0 30rpx;
      background: #fff;

      .title {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .txt {
          font-size: 28rpx;
          color: #010101;
        }

        .coupon-use-num {
          border: 2rpx solid #2e94f5;
          border-radius: 500rpx;
          // background-color: #FFECEC;
          color: #2e94f5;
          padding-left: 20rpx;
          padding-right: 20rpx;
          margin-left: 20rpx;
        }
      }

      .value {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;

        .txt {
          font-size: 28rpx;
          color: #666;
          margin-right: 10rpx;
          &.highlight {
            color: #ea1717;
          }
        }
      }

      &.border-bottom {
        border-bottom: 2rpx solid #eee;
      }
    }
  }

  .footer-bar {
    z-index: 1;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 98rpx;
    background: #fff;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    border-top: 1rpx solid #e4e4e4;
    padding: 0 20rpx;

    .total-info {
      padding-left: 30rpx;
      flex: 1;
      color: #666;
      font-size: 30rpx;
      line-height: 100rpx;
      text-align: left;

      .txt {
        font-size: 32rpx;
        color: #ea3401;
        font-weight: 600;
      }
    }

    .pay-btn {
      color: #fff;
      width: 114px;
      height: 41px;
      line-height: 41px;
      text-align: center;
      border-radius: 22px;
      font-size: 15px;

      background-image: linear-gradient(135deg, $top-background-color 0%, $theme-font-color 100%);

      &.disabled {
        background-image: none;
        background-color: #f1f1f1;
        color: #989898;
      }
    }
  }

  .coupons-sheet-wrap {
    background-color: #f7f7f7;

    .title {
      height: 91rpx;
      font-size: 32rpx;
      color: #373737;
      width: 100%;
      line-height: 91rpx;
      text-align: center;
      position: relative;
      background: #fff;
    }

    .content {
      .pictrue {
        width: 414rpx;
        height: 336rpx;
        margin: 0 auto;
      }
    }

    .close {
      height: 98rpx;
      font-size: 32rpx;
      color: #fff;
      line-height: 98rpx;
      text-align: center;
      background-image: linear-gradient(135deg, #59b3ff 0%, #1c87f0 100%);
    }
  }
}
</style>
