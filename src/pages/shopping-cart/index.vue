<template>
  <view class="shopping-car-wrap">
    <view class="toggle-edit" @click="toggleEdit">
      <text v-if="isEdit">完成</text>
      <text v-else>编辑</text>
    </view>
    <view v-if="isInit" class="list-wrap">
      <scroll-view scroll-y="true" scroll-with-animation="true" :style="'height:' + height + 'px;'">
        <view v-if="cartList.length === 0" class="empty">购物车为空</view>

        <view v-for="(parentItem, index) in cartList" :key="parentItem.shopId" class="cart-wrap">
          <!--店铺名称 start-->
          <view class="shop-bar">
            <block v-if="isEdit">
              <view
                class="check"
                :class="parentItem.deleteSelected ? 'selected' : ''"
                @click="selectGroupDelete(index)"
              >
                <text v-if="parentItem.deleteSelected" class="iconfont icon-radio-checked"></text>
                <text v-else class="iconfont icon-radio-uncheck"></text>
              </view>
            </block>
            <block v-else>
              <view class="check" :class="parentItem.selected ? 'selected' : ''" @click="selectGroup(index)">
                <text v-if="parentItem.selected" class="iconfont icon-radio-checked"></text>
                <text v-else class="iconfont icon-radio-uncheck"></text>
              </view>
            </block>
            <view class="shop-name">
              <text>{{ parentItem.shopName }} </text>
            </view>
          </view>
          <!--店铺名称 end-->
          <!--商品 start-->
          <view class="goods-wrap">
            <block v-for="childItem in parentItem.children" :key="childItem.id">
              <view class="item-wrapper">
                <moveBox
                  :index="childItem.id"
                  :move-name="moveName"
                  @changeMoveName="changeMoveName"
                  @action="deleteByMove"
                >
                  <view class="goods-item">
                    <!--check-box start-->
                    <block v-if="isEdit">
                      <view class="check" @click="selectGoodsDelete(childItem.id, index)">
                        <text v-if="childItem.deleteSelected" class="iconfont icon-radio-checked"></text>
                        <text v-else class="iconfont icon-radio-uncheck"></text>
                      </view>
                    </block>
                    <block v-else>
                      <view class="check" @click="selectGoods(childItem.id, index)">
                        <text v-if="childItem.selected" class="iconfont icon-radio-checked"></text>
                        <text v-else class="iconfont icon-radio-uncheck"></text>
                      </view>
                    </block>
                    <!--check-box end-->
                    <!--商品 start-->
                    <view class="goods-wrap">
                      <view class="pic-wrap">
                        <image class="image" mode="widthFix" lazy-load :src="childItem.thumb" />
                      </view>
                      <view class="goods-info-wrap">
                        <view class="goods-name">{{ childItem.productName }}</view>
                        <view class="sku-name">
                          <text class="txt">{{ childItem.skuName }}</text>
                        </view>
                        <view class="actual-stocks">库存：{{ childItem.stock }} </view>
                        <view class="goods-price-wrap">
                          <view class="goods-price"> ￥{{ childItem.marketPrice }}</view>
                          <view class="editor-number">
                            <view
                              class="action reduce"
                              :class="childItem.cartNum === 1 ? 'disable-reduce-button' : ''"
                              @click="reduce(childItem)"
                            >
                              <text class="iconfont icon-minus-bold"></text>
                            </view>
                            <input
                              v-model="childItem.cartNum"
                              class="number-input"
                              type="number"
                              @input="setCount(childItem)"
                            />
                            <view class="action add" @click="add(childItem)">
                              <text class="iconfont icon-add-bold"></text>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                    <!--商品 end-->
                  </view>
                </moveBox>
              </view>
            </block>
          </view>
          <!--商品 end-->
        </view>
      </scroll-view>
    </view>
    <view class="totalBar">
      <view class="sum"
        >合计：
        <text v-if="!isEdit" class="price">￥{{ selectedPriceTotal }}</text>
        <text v-else class="remove" :class="selectDeleteLength > 0 ? 'valid' : ''">{{ selectDeleteLength || 0 }}</text>
      </view>
      <view v-if="!isEdit" class="pay" :class="selectedPriceTotal === 0 ? 'remove' : ''" @click="toCreateOrder">
        去结算
      </view>
      <view v-else class="pay remove" :class="selectDeleteLength > 0 ? 'valid' : ''" @click="deleteAll">删除所选 </view>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import { store } from '@/store'
import { CartActionTypes } from '@/store/modules/cart/action-types'
import { fetchCartList, fetchUpdateCart, fetchDeleteCart } from '@/api/cart'
import moveBox from '@/components/move-box/index.vue'
import { Tips, Debounce } from '@/utils/util'

export default defineComponent({
  name: 'ShoppingCartPage',
  components: {
    moveBox,
  },
  setup() {
    const state = reactive({
      isEdit: false,
      height: 0,
      isInit: true,
      cartList: [] as any,
      moveName: null,
      selectedPriceTotal: 0, // 选中的商品总价
      selectedGoodsTotal: 0, // 选中的商品总数
      selectedGoodsItems: [] as any, // 选中的商品
      selectDeleteLength: 0,
      isDeleteSelectAll: false,
      isSelectAll: false,
    })
    /**
     * 滑动回调
     */
    const changeMoveName = (name) => {
      state.moveName = name
    }

    /**
     * 是否编辑购物车
     */
    const toggleEdit = () => {
      state.isEdit = !state.isEdit
      setCheckState()
    }

    /**
     * 切换编辑删除的时候清除所有checkbox的选中状态
     */
    const setCheckState = () => {
      let _this = this
      state.isSelectAll = false
      state.cartList.map((item, i) => {
        if (item.children) {
          item.selectedGoodsCount = 0
          item.deleteGoodsCount = 0
          item.selected = false
          item.deleteSelected = false
          item.children.map((litem) => {
            litem.selected = false
            litem.deleteSelected = false
          })
        }
      })
      setSelectNumber(state.cartList)
    }

    /**
     * 设置选中状态
     */
    const setSelectNumber = (cartList) => {
      if (!cartList) return
      let number = 0
      let deleteNumber = 0
      let cartItemLength = 0
      let total = 0
      let selectedGoods: any[] = []
      cartList.map((item) => {
        let isSelectedNum = 0
        if (item.children) {
          item.children.map((childItem) => {
            cartItemLength++
            if (childItem.selected) {
              number++
              total = total + childItem.marketPrice * childItem.cartNum
              isSelectedNum++
              selectedGoods.push(childItem)
            }
            if (childItem.deleteSelected) {
              deleteNumber++
            }
          })
        }
        item.selected = isSelectedNum === item.children.length //设置分部是否全部选中
      })
      state.selectedGoodsTotal = number
      state.selectedGoodsItems = selectedGoods
      state.selectDeleteLength = deleteNumber
      state.selectedPriceTotal = total
      if (deleteNumber === cartItemLength && deleteNumber !== 0) {
        state.isDeleteSelectAll = true
      } else {
        state.isDeleteSelectAll = false
      }
      if (number === cartItemLength) {
        state.isSelectAll = true
      } else {
        state.isSelectAll = false
      }
    }

    /**
     * 选择和删除的时候公用的方法 更新group 的checkbox 状态
     */
    const updateGroupSelected = (index, method) => {
      if (method == 'add') {
        if (state.cartList[index].selectedGoodsCount === state.cartList[index].children.length) {
          state.cartList[index].selected = true
        } else {
          state.cartList[index].selected = false
        }
      } else {
        if (state.cartList[index].deleteGoodsCount === state.cartList[index].children.length) {
          state.cartList[index].deleteSelected = true
        } else {
          state.cartList[index].deleteSelected = false
        }
      }
    }

    /**
     * 选中店铺状态删除
     */
    const selectGroupDelete = (key) => {
      let parentDeleteSelected = true
      if (state.cartList[key].deleteSelected) {
        parentDeleteSelected = false
        state.cartList[key].deleteSelected = false
        state.cartList[key].deleteGoodsCount = 0
      } else {
        parentDeleteSelected = true
        state.cartList[key].deleteSelected = true
        state.cartList[key].deleteGoodsCount = state.cartList[key].children.length
      }
      state.cartList[key].children = state.cartList[key].children.map(function (i) {
        if (parentDeleteSelected) {
          i.deleteSelected = true
        } else {
          i.deleteSelected = false
        }
        return i
      }, parentDeleteSelected)
      setSelectNumber(state.cartList)
    }

    /**
     * 选中店铺状态添加
     */
    const selectGroup = (key) => {
      let currentParentSelected = false
      if (state.cartList[key].selected) {
        state.cartList[key].selected = false
        currentParentSelected = false
        state.cartList[key].selectedGoodsCount = 0
      } else {
        state.cartList[key].selected = true
        currentParentSelected = true
        state.cartList[key].selectedGoodsCount = state.cartList[key].children.length
      }
      //不同分部时全选修改
      state.cartList = state.cartList.map((v, index) => {
        v.children = v.children.map((i) => {
          if (index === key) {
            i.selected = currentParentSelected
          }
          return i
        })
        return v
      })
      setSelectNumber(state.cartList)
    }

    /**
     * 选中商品状态添加
     */
    const selectGoods = (cartid, parentIndex) => {
      //不同分部单选
      state.cartList = state.cartList.map((v, index) => {
        v.children = v.children.map((i) => {
          if (i.id === cartid) {
            if (i.selected) {
              i.selected = false
              if (state.cartList[parentIndex].selectedGoodsCount > 0) {
                state.cartList[parentIndex].selectedGoodsCount--
              }
            } else {
              i.selected = true
              state.cartList[parentIndex].selectedGoodsCount++
            }
          }
          return i
        })
        return v
      })

      updateGroupSelected(parentIndex, 'add')
      setSelectNumber(state.cartList)
    }

    /**
     * 选中商品状态删除
     */
    const selectGoodsDelete = (cartid, parentIndex) => {
      state.cartList[parentIndex].children = state.cartList[parentIndex].children.map((i) => {
        if (i.id === cartid) {
          if (i.deleteSelected) {
            i.deleteSelected = false
            if (state.cartList[parentIndex].deleteGoodsCount) {
              state.cartList[parentIndex].deleteGoodsCount--
            }
          } else {
            i.deleteSelected = true
            state.cartList[parentIndex].deleteGoodsCount++
          }
        }
        return i
      }, cartid)

      updateGroupSelected(parentIndex, 'delete')
      setSelectNumber(state.cartList)
    }

    /**
     * 底部删除全部
     */
    const deleteAll = () => {
      let params: any[] = []
      state.cartList.forEach((item) => {
        if (item.children) {
          item.deleteSelected = state.isDeleteSelectAll
          item.children.forEach((o) => {
            if (o.deleteSelected) {
              params.push(o)
            }
          })
        }
      })
      if (params.length == 0) {
        Tips({
          title: '请选择删除的商品',
        })
        return
      }
      deleteCart(params)
    }

    /**
     * 创建订单请求参数 [人人商城特有]
     */
    const createOrderParam = (data) => {
      let cartsItemGroupData: any[] = []
      data.forEach((v) => {
        const shopId = v.shopId

        const groupData = {
          mch_id: shopId,
        }

        let goodsItem = {
          id: v.goods_id,
          attr: [] as any[],
          send_type: v.send_type,
          cover: v.attrs && v.attrs.pic_url ? v.attrs.pic_url : v.goods.cover_pic,
          price: v.attrs.price,
          num: v.cartNum,
          sign: v.sign,
          cart_id: v.id,
          goods_attr_id: v.attr_id,
        }
        for (let n in v.attrs.attr) {
          const attr = {
            attr_id: v.attrs.attr[n].attr_id,
            attr_group_id: v.attrs.attr[n].attr_group_id,
          }
          goodsItem.attr.push(attr)
        }

        if (cartsItemGroupData.length > 0) {
          if (cartsItemGroupData.some((val) => val.mch_id === shopId)) {
            cartsItemGroupData.forEach((o, j) => {
              if (o.mch_id === shopId) {
                cartsItemGroupData[j].goods_list.push({
                  ...goodsItem,
                })
              }
            })
          } else {
            cartsItemGroupData.push({
              ...groupData,
              goods_list: [
                {
                  ...goodsItem,
                },
              ],
            })
          }
        } else {
          cartsItemGroupData.push({
            ...groupData,
            goods_list: [
              {
                ...goodsItem,
              },
            ],
          })
        }
      })
      return cartsItemGroupData
    }

    /**
     * 底部创建订单
     */
    const toCreateOrder = () => {
      if (state.selectedGoodsTotal === 0) {
        Tips({
          title: '请选择商品~',
        })
        return
      }
      console.log('state.selectedGoodsItems', state.selectedGoodsItems)
      store.dispatch(CartActionTypes.ACTION_SELECTED_CART_GOODS, state.selectedGoodsItems)
      store.dispatch(CartActionTypes.ACTION_PREVIEW_ORDER_PARAM, createOrderParam(state.selectedGoodsItems))
      console.log('createOrderParam', createOrderParam(state.selectedGoodsItems))

      Tips('/pages/order/create')
    }

    /**
     * 点击增加商品数量
     */
    const add = (item) => {
      item.cartNum = parseInt(item.cartNum) + 1
      const params = {
        id: item.id,
        cartNum: item.cartNum,
        skuId: item.skuId,
        productId: item.productId,
      }
      updateCart(params)
    }

    /**
     * 点击减少商品数量
     */
    const reduce = (item) => {
      // 先判断当前的商品数量 是否已经是1
      if (Number(item.cartNum) === 1) {
        return
      }
      item.cartNum = parseInt(item.cartNum) - 1
      const params = {
        id: item.id,
        cartNum: item.cartNum,
        skuId: item.skuId,
        productId: item.productId,
      }
      updateCart(params)
    }

    /**
     * 购物车商品手动设置数量
     */
    const setCount = (item) => {
      console.log('setCount', item)
      const debounceFn = Debounce(() => {
        if (!item.cartNum) {
          return
        }
        const count = Number(item.cartNum)
        if (count <= 0) {
          return
        }
        const params = {
          id: item.id,
          cartNum: count,
          skuId: item.skuId,
          productId: item.productId,
        }
        updateCart(params)
      }, 100)

      debounceFn()
    }

    /**
     * 滑动删除商品
     */
    const deleteByMove = (cartid) => {
      let params: any[] = []
      state.cartList.forEach((item) => {
        if (item.children) {
          item.children.forEach((o) => {
            if (o.id === cartid) {
              params.push(o)
            }
          })
        }
      })
      deleteCart(params)
    }

    /**
     * 更新购物车
     */
    const updateCart = (params) => {
      fetchUpdateCart(params)
        .then((r) => {
          setSelectNumber(state.cartList)
        })
        .catch((err) => console.log(err))
    }

    /**
     * 删除购物车
     */
    const deleteCart = (params) => {
      uni.showModal({
        title: '温馨提示',
        content: '亲，您确定要删除吗',
        success(res) {
          if (res.confirm) {
            fetchDeleteCart(params)
              .then(() => {
                getCartList()
              })
              .catch((err) => console.log(err))
          }
        },
      })
    }

    /**
     * 获取购物车数据
     */
    const getCartList = () => {
      fetchCartList()
        .then((r) => {
          initCart(r)
        })
        .catch((err) => console.log(err))
    }

    /**
     * 购物车数据结构
     */
    const normalizeCart = (data) => {
      let cartsItemGroupData: any[] = []
      data.forEach((v) => {
        const shopId = v.shopId

        const groupData = {
          shopId,
          shopName: v.shopName,
          selectedGoodsCount: 0, // 选中商品数量
          deleteGoodsCount: 0, // 选中要删除的商品数量
          selected: false, // 店铺商品全选状态
          deleteSelected: false, // 店铺全选删除状态
        }

        if (cartsItemGroupData.length > 0) {
          if (cartsItemGroupData.some((val) => val.shopId === shopId)) {
            cartsItemGroupData.forEach((o, j) => {
              if (o.shopId === shopId) {
                cartsItemGroupData[j].children.push({
                  ...v,
                })
              }
            })
          } else {
            cartsItemGroupData.push({
              ...groupData,
              children: [
                {
                  ...v,
                },
              ],
            })
          }
        } else {
          cartsItemGroupData.push({
            ...groupData,
            children: [
              {
                ...v,
              },
            ],
          })
        }
      })
      return cartsItemGroupData
    }

    /**
     * 购物车数据初始化
     */
    const initCart = (cartList) => {
      const cartsItemGroupData = normalizeCart(cartList)
      console.log('cartsItemGroupData', cartsItemGroupData)
      state.cartList = cartsItemGroupData
    }

    onShow(() => {
      getCartList()
    })

    onLoad(() => {
      uni.getSystemInfo({
        success: function (res) {
          state.height = res.windowHeight - 44 - 49 - 10
          console.log('res', res)
          //res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
        },
      })
    })
    return {
      ...toRefs(state),
      toggleEdit,
      selectGroupDelete,
      deleteByMove,
      selectGoodsDelete,
      selectGroup,
      changeMoveName,
      selectGoods,
      reduce,
      setCount,
      add,
      toCreateOrder,
      deleteAll,
    }
  },
})
</script>

<style lang="scss">
@import '@/static/css/variable.scss';
.shopping-car-wrap {
  .toggle-edit {
    padding: 0 26rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-family: PingFangSC-Light;
    font-size: 13px;
    color: #e60012;
    text-align: right;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  }

  .list-wrap {
    background-color: #f4f4f4;
    padding-top: 20rpx;

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .cart-wrap {
      position: relative;
      margin-left: 20rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      margin-bottom: 20rpx;
      background-color: #fff;

      .shop-bar {
        display: flex;
        padding: 26rpx 26rpx 26rpx 30rpx;
        align-items: center;

        // border-bottom: 1rpx solid #e8e8e8;

        .check {
          display: flex;
          justify-content: center;
          align-items: center;

          .iconfont {
            font-size: 36rpx;
            color: $top-background-color;
          }
        }

        .shop-name {
          padding-left: 20rpx;
          font-family: PingFangSC-Light;
          font-size: 26rpx;
          color: #000000;
          line-height: 26rpx;
        }
      }

      .goods-wrap {
        .item-wrapper {
          position: relative;
          overflow: hidden;
          padding: 8rpx 0;

          .goods-item {
            display: flex;
            flex-direction: row;
            padding: 20rpx 26rpx 20rpx 30rpx;

            .check {
              display: flex;
              justify-content: center;
              align-items: center;

              .iconfont {
                font-size: 36rpx;
                color: $top-background-color;
              }
            }

            .goods-wrap {
              flex: 1;
              display: flex;
              align-items: center;
              margin-left: 16rpx;

              .pic-wrap {
                flex: 0 0 160rpx;
                width: 160rpx;
                height: 160rpx;
                position: relative;
                background: #fff;
                overflow: hidden;

                .image {
                  width: 100%;
                  height: 100%;
                }
              }

              .goods-info-wrap {
                flex: 1;
                margin-left: 20rpx;

                .goods-name {
                  font-family: PingFangSC-Regular;
                  font-size: 28rpx;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  word-break: break-all;
                }

                .sku-name {
                  .txt {
                    background-color: #ccc;
                    border-radius: 10rpx;
                    font-size: 24rpx;
                    padding-left: 8rpx;
                    padding-right: 8rpx;
                  }
                }

                .actual-stocks {
                  font-size: 24rpx;
                  color: #666;
                }

                .goods-price-wrap {
                  display: flex;
                  flex-direction: row;
                  align-items: center;

                  .goods-price {
                    font-family: HelveticaNeue;
                    font-size: 32rpx;
                    color: #e60012;
                    flex: 1;
                    justify-content: flex-start;
                    text-align: left;
                  }

                  .editor-number {
                    margin-right: auto;
                    flex: 1;
                    justify-content: flex-end;
                    text-align: right;
                    display: flex;
                    flex-direction: row;
                    width: 190rpx;
                    height: 56rpx;
                    flex: 0 0 190rpx !important;

                    .action {
                      flex: 0 0 56rpx;
                      text-align: center;
                      font-size: 24rpx;
                      height: 56rpx;
                      line-height: 56rpx;
                      color: #999;
                    }

                    .number-input {
                      display: inline-block;
                      flex: 1;
                      height: 56rpx;
                      line-height: 56rpx;
                      text-align: center;
                      font-family: PingFangSC-Regular;
                      font-size: 28rpx;
                      color: #333;
                      background-color: #f7f7f7;
                      border-radius: 10rpx;
                    }
                  }
                }
              }
            }

            .delivery-mode {
              position: absolute;
              top: 0;
              right: 0;
              color: #fff;
              background-color: #ef505d;
              border-radius: 10rpx;
              padding-left: 10rpx;
              padding-right: 10rpx;
              font-size: 24rpx;
            }
          }
        }
      }
    }
  }

  .totalBar {
    z-index: 990;
    position: fixed;
    right: 0;
    width: 100%;
    height: 98rpx;
    background: #fff;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid rgba(218, 218, 218, 0.3);
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    /* #ifndef H5 */
    bottom: 0;
    bottom: calc(0rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
    bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
    /* #endif */

    .sum {
      flex: 1;
      font-family: PingFangSC-Regular;
      font-size: 28rpx;
      color: #666;
      padding: 0 20rpx 0 30rpx;

      .price {
        font-family: HelveticaNeue;
        font-size: 32rpx;
        color: #e60012;
      }
    }

    .pay {
      color: #fff;
      width: 114px;
      height: 41px;
      line-height: 41px;
      text-align: center;
      border-radius: 22px;
      font-size: 15px;

      background-image: linear-gradient(135deg, $top-background-color 0%, $theme-font-color 100%);

      &.remove {
        background-color: #d1d1d1;
      }
    }
  }
}
</style>
