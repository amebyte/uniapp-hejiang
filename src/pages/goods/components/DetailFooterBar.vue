<template>
  <view class="footer-bar">
    <view class="item shop" @click="gotoHandler">
      <text class="iconfont icon-home"></text>
      <text class="txt">首页</text>
    </view>
    <view class="item" @click="toggleFavourite">
      <text v-if="!isFavoriteLocal" class="iconfont icon-favorite"></text>
      <text v-else class="iconfont icon-favorite-filling"></text>
      <text class="txt">收藏</text>
    </view>
    <view class="item shopping-cart" @click="gotoHandler(`/pages/shopping-cart/index`)">
      <text class="iconfont icon-shopping-cart"></text>
      <text v-if="cartCount > 0" class="good-number">{{ cartCount > 99 ? '99+' : cartCount }}</text>
      <text class="txt">购物车</text>
    </view>
    <view class="item btn">
      <text class="txt add-cart" @click="joinCart">加入购物车</text>
      <text class="txt buy-now" @click="buyNowAction">立即抢购</text>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, watchEffect } from 'vue'
import { useStore, mapGetters } from 'vuex'
import { CartActionTypes } from '@/store/modules/cart/action-types'
import { fetchAddCart } from '@/api/cart'
import { toLogin } from '@/libs/login'
import { Tips } from '@/utils/util'
import { fetchGoodsFavoriteAdd, fetchGoodsFavoriteRemove } from '@/api/goods'

export default defineComponent({
  name: 'DetailFooterBar',
  props: {
    createCartParam: {
      type: Function,
      default: () => {},
    },
    cartNum: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
    },
    goodsId: {
      type: Number,
      default: 0,
    },
  },
  emits: ['setIsOpenAttrWindow', 'setIsBuyNow'],
  setup(props, { emit }) {
    const store = useStore()
    const isLogin = computed(mapGetters(['isLogin']).isLogin.bind({ $store: store }))

    let cartCount = ref(0)
    let isFavoriteLocal = ref(props.isFavorite)

    watchEffect(() => {
      cartCount.value = props.cartNum
    })

    watchEffect(() => {
      isFavoriteLocal.value = props.isFavorite
    })

    /**
     * 打开属性窗口
     *
     */
    const openAttrWindow = () => {
      if (isLogin.value) {
        emit('setIsOpenAttrWindow', true)
      } else {
        toLogin()
      }
    }
    /**
     * 跳转
     */
    const gotoHandler = (url) => {
      Tips(url)
    }
    /**
     * toggle收藏
     */
    const toggleFavourite = () => {
      if (isFavoriteLocal.value) {
        fetchGoodsFavoriteRemove({ goods_id: props.goodsId })
          .then((r) => {
            if (r.code === 0) {
              isFavoriteLocal.value = false
            }
          })
          .catch((err) => console.log('fetchGoodsFavoriteRemove:', err))
      } else {
        fetchGoodsFavoriteAdd({ goods_id: props.goodsId })
          .then((r) => {
            if (r.code === 0) {
              isFavoriteLocal.value = true
            }
          })
          .catch((err) => console.log('fetchGoodsFavoriteAdd:', err))
      }
    }
    /**
     * 打开属性加入购物车
     *
     */
    const joinCart = () => {
      openAttrWindow()
    }
    /**
     * 立即购买 || 立即抢购
     *
     */
    const buyNowAction = () => {
      emit('setIsBuyNow', true)
      openAttrWindow()
    }
    /*
     * 加入购物车
     */
    const addCart = () => {
      const goodsItem = props.createCartParam()
      fetchAddCart({
        id: goodsItem.productId,
        cartNum: goodsItem.selectedSku.cartNum,
        skuId: goodsItem.selectedSku.skuId,
      })
        .then((r) => {
          cartCount.value = r.cartcount
        })
        .catch((err) => console.log(err))
    }
    /**
     * 立即购买
     */
    const buyNow = () => {
      console.log('buyNow', props.createCartParam())
      const goodsItem = props.createCartParam()
      const mch_list = [
        {
          mch_id: 0,
          goods_list: [
            {
              id: goodsItem.productId,
              attr: goodsItem.selectedSku.attr.attr_list,
              num: goodsItem.selectedSku.cartNum,
              cat_id: 0,
              goods_attr_id: goodsItem.selectedSku.skuId,
            },
          ],
        },
      ]
      store.dispatch(CartActionTypes.ACTION_PREVIEW_ORDER_PARAM, mch_list)
      Tips('/pages/order/create')
    }
    return {
      cartCount,
      isFavoriteLocal,
      gotoHandler,
      toggleFavourite,
      joinCart,
      buyNowAction,
      addCart,
      buyNow,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/static/css/variable.scss';
.footer-bar {
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-top: 2rpx solid #effafa;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    flex: 1;

    .iconfont {
      font-size: 36rpx;
      color: $theme-font-color;
    }

    .txt {
      font-size: 20rpx;
      color: $theme-font-color;
    }

    &.shopping-cart {
      position: relative;

      .good-number {
        width: 28rpx;
        height: 28rpx;
        background-color: #ea3401;
        position: absolute;
        top: 10rpx;
        right: 0rpx;
        border-radius: 100%;
        color: #fff;
        font-size: 18rpx;
        text-align: center;
        line-height: 28rpx;
      }
    }

    &.btn {
      flex: 6;
      display: flex;
      flex-direction: row;
      .txt {
        width: 200rpx;
        height: 66rpx;
        line-height: 66rpx;
        text-align: center;
        font-size: 28rpx;
        color: #fff;
        &.add-cart {
          border-bottom-left-radius: 40rpx;
          border-top-left-radius: 40rpx;
          background-color: #1aa86c;
        }

        &.buy-now {
          border-top-right-radius: 40rpx;
          border-bottom-right-radius: 40rpx;
          background-color: #009688;
        }
      }
    }
  }
}
</style>
