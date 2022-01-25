<template>
  <view class="tabs">
    <scroll-view class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
      <view
        v-for="(tab, index) in tabBars"
        :key="tab.status"
        class="uni-tab-item"
        :data-current="index"
        @click="ontabtap"
      >
        <text class="uni-tab-item-title" :class="tabIndex == index ? 'uni-tab-item-title-active' : ''">{{
          tab.title
        }}</text>
      </view>
    </scroll-view>
    <view class="line-h"></view>
    <swiper :current="tabIndex" class="swiper-box" style="flex: 1" :duration="300" @change="ontabchange">
      <swiper-item v-for="(tab, index1) in newsList" :key="index1" class="swiper-item">
        <scroll-view
          class="scroll-v list"
          enable-back-to-top="true"
          scroll-y
          refresher-enabled
          :refresher-triggered="refeshloading"
          @refresherrefresh="refresh"
          @scrolltolower="loadMore(tab)"
        >
          <view v-for="(item, index2) in tab.data" :key="index2" class="list-item">
            <view class="item-number">
              <text>订单编号：{{ item.code }}</text>
              <text
                :class="{ done: item.orderStat == 30, toSend: item.orderStat == 21, toAudit: item.orderStat == 10 }"
                >{{ retrunStatusText(item.status) }}</text
              >
            </view>
            <view class="list-item-content" @click="toDetail(item.id)">
              <view v-for="(i, n) in item.items" :key="n" class="">
                <view class="flex">
                  <view class="product-img">
                    <image :src="i.pic"></image>
                  </view>
                  <view class="list-item-content-right flex-sub">
                    <view class="product-name">
                      {{ i.prodName }}
                    </view>
                    <view v-if="i.skuName" class="product-tag">
                      {{ i.skuName }}
                    </view>
                    <view class="product-num">
                      <text v-if="i.price" class="font-color">￥{{ i.price }}</text>
                      <text>x{{ i.prodCount }}</text>
                    </view>
                    <view class="product-price">
                      <text class="l">总价：¥{{ item.payMoney }}，优惠：¥{{ item.payMoney - item.actualMoney }} </text>
                      <text class="r">实付款：¥{{ item.actualMoney }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="option flex justify-end">
              <template v-if="item.status == 1">
                <view class="btn grey" @click="cancelOrder(item.id)">取消订单</view>
                <view class="btn red" @click="payOrder(item)">去支付</view>
              </template>
              <template v-if="item.status == 2 && item.subStatus !== 7 && item.subStatus !== 8 && item.subStatus !== 9">
                <view class="btn grey" @click="refund(item.id)">售后/退款</view>
              </template>
              <template v-if="item.status == 6">
                <view class="btn grey" @click="delOrder(item.id)">删除订单</view>
              </template>
              <template v-if="item.status == 3">
                <view class="btn red" @click="sureReceipt(item.id)">确认收货</view>
              </template>
              <template v-if="item.status == 5">
                <view class="btn grey" @click="delOrder(item.id)">删除订单</view>
              </template>
              <template v-if="item.status == 11">
                <view class="btn red" @click="toPickCodeDetail(item.id)">取货码</view>
                <view class="btn grey" @click="refund(item.id)">售后/退款</view>
              </template>
              <template v-if="item.status == 13">
                <view class="btn red" @click="toShare(item)">去分享</view>
              </template>
            </view>

            <!-- {{item.creationDate}} -->
            <!-- {{item.finallyTime}} -->

            <!-- <media-item :options="item" @close="close(index1,index2)" @click="goDetail(item)"></media-item> -->
          </view>
          <view v-if="tab.isLoading || tab.data.length <= tab.total" class="loading-more">
            <text :key="key" class="loading-more-text">{{ tab.loadingText }}</text>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
// 缓存每页最多
const MAX_CACHE_DATA = 100
// 缓存页签数量
const MAX_CACHE_PAGE = 3

// import * as api from '@/api/user.js'
// import * as util from '@/utils/constant.js'
// import { Debounce } from '@/utils/validate.js'

export default defineComponent({
  name: 'OrderList',
  setup() {
    const state = reactive({
      tabBars: [
        {
          title: '全部',
          status: '',
        },
        {
          title: '待付款',
          status: 1,
        },
        {
          title: '待分享',
          status: 2,
        },
        {
          title: '待发货',
          status: 3,
        },
        {
          title: '待收货',
          status: 4,
        },
        {
          title: '待提货',
          status: 5,
        },
        {
          title: '已完成',
          status: 6,
        },
      ],
      tabIndex: 0,
      newsList: [] as any[],
      scrollInto: '',
      // 刷新状态
      refeshloading: false,
      key: 0,
    })

    onLoad((options) => {
      if (options.status) state.tabIndex = Number(options.status)
      state.tabBars.forEach((tabBar) => {
        state.newsList.push({
          data: [],
          isLoading: false,
          pageNum: 0,
          total: 0,
          allData: false,
          refreshText: '',
          loadingText: '加载更多...',
        })
      })
      getList(state.tabIndex)
    })

    return {
      ...toRefs(state),
    }
  },

  computed: {
    orderStatus: (item) => {
      return {
        done: item.orderStat == 30,
        toSend: item.orderStat == 21,
        toAudit: item.orderStat == 10,
      }
    },
  },
  methods: {
    retrunStatusText(n) {
      return util.orderStatusEnum.descOfValue(n)
    },
    getList: Debounce(function (index, next, refresh) {
      let activeTab = this.newsList[index]
      if (refresh) {
        activeTab.data = []
        activeTab.pageNum = 0
        activeTab.total = 0
        activeTab.allData = false
        activeTab.loadingText = '加载更多...'
      }
      if (!activeTab.allData) {
        const params = {
          subStatus: '',
          pageNum: next ? activeTab.pageNum : 0,
          pageSize: 10,
        }
        if (this.tabIndex) params.status = this.tabBars[this.tabIndex].status
        api
          .getOrderList(params)
          .then((res) => {
            activeTab.isLoading = false
            if (res.status === 'OK') {
              activeTab.data = activeTab.data.concat(res.data.list)
              activeTab.total = res.data.totalElements
              activeTab.pageNum++
              this.refeshloading = false
              if (activeTab.total <= activeTab.data.length || res.data.totalElements === 0) {
                activeTab.allData = true
                activeTab.loadingText = '没有更多了'
                this.key++
              }
            } else {
              this.refeshloading = false
            }
            uni.stopPullDownRefresh()
          })
          .catch(() => {
            this.refeshloading = false
            activeTab.isLoading = false
            uni.stopPullDownRefresh()
          })
      }
    }, 100),
    ontabtap(e) {
      let index = e.target.dataset.current || e.currentTarget.dataset.current
      this.switchTab(index)
    },
    ontabchange(e) {
      let index = e.target.current || e.detail.current
      this.switchTab(index)
    },
    loadMore(e) {
      setTimeout(() => {
        this.getList(this.tabIndex, true)
      }, 500)
    },
    switchTab: Debounce(function (index) {
      if (this.tabIndex === index) {
        return
      }
      if (this.newsList[index].data.length === 0) {
        this.getList(index)
      }
      this.tabIndex = index
      this.scrollInto = 'tab' + this.tabBars[index].status
    }, 5),
    // 取货码
    toPickCodeDetail(id) {
      uni.navigateTo({
        url: './toPickCodeDetail?id=' + id,
      })
    },
    // 详情页
    toDetail(id) {
      uni.navigateTo({
        url: './detail?id=' + id,
      })
    },
    // 去分享
    toShare(item) {
      console.log('item', item)
      const groupBuyingDetailId = item.items[0].refProductId
      uni.navigateTo({
        url: `/pages/goods/groupBuying/statusDetail?groupBuyingDetailId=${groupBuyingDetailId}&type=${util.goodsTypes.GROUP_BUYING}&gId=${item.groupMemberId}`,
      })
    },
    // 售后/退款
    refund(id) {
      const _this = this
      uni.showModal({
        title: '提示',
        content: '是否真的要进行退款',
        success: function (res) {
          if (res.confirm) {
            api.refund(id).then((res) => {
              if (res.status === 'OK') {
                _this.getList(_this.tabIndex, '', true)
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        },
      })
    },
    // 取消订单
    cancelOrder(id) {
      const _this = this
      uni.showModal({
        title: '提示',
        content: '是否真的要取消订单',
        success: function (res) {
          if (res.confirm) {
            api
              .cancelOrder(id)
              .then((res) => {
                if (res.status === 'OK') {
                  _this.getList(_this.tabIndex, '', true)
                  _this.$util.Tips({
                    title: '取消订单成功',
                  })
                } else {
                  _this.$util.Tips({
                    title: res.message,
                  })
                }
              })
              .catch((e) => {
                _this.$util.Tips({
                  title: e || 取消订单异常,
                })
              })
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        },
      })
    },
    // 删除订单
    delOrder(id) {
      const _this = this
      uni.showModal({
        title: '提示',
        content: '是否确认删除',
        success: function (res) {
          if (res.confirm) {
            api.delOrder(id).then((res) => {
              if (res.status === 'OK') {
                _this.getList(_this.tabIndex, '', true)
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        },
      })
    },
    // 去支付
    payOrder(item) {
      console.log(item)
      const currPayOrder = {
        orderId: item.id,
        orderNo: item.code,
        totalPrice: item.actualMoney,
      }
      this.generateWechatOrder(currPayOrder)
    },
    // 确认收货
    sureReceipt(id) {
      const _this = this
      uni.showModal({
        title: '提示',
        content: '是否真的要进行确认收货',
        success: function (res) {
          if (res.confirm) {
            api.sureReceipt(id).then((res) => {
              if (res.status === 'OK') {
                _this.getList(_this.tabIndex, '', true)
                this.$util.Tips({
                  title: '收货成功',
                })
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        },
      })
    },
    // 下拉刷新
    refresh() {
      this.refeshloading = true
      this.getList(this.tabIndex, '', true)
    },
  },
})
</script>
<style lang="scss" scoped>
// @import url('@/uni.scss');
.tabs {
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  /* #ifndef APP-PLUS */
  // height: calc(100vh - 44px);
  height: calc(100vh);
  /* #endif */
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}

.scroll-h {
  width: 750rpx;
  /* #ifdef H5 */
  width: 100%;
  /* #endif */
  height: 80rpx;
  flex-direction: row;
  /* #ifndef APP-PLUS */
  white-space: nowrap;
  /* #endif */
  /* flex-wrap: nowrap; */
  /* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
}

.line-h {
  height: 1rpx;
  background-color: #cccccc;
}

.uni-tab-item {
  /* #ifndef APP-PLUS */
  display: inline-block;
  /* #endif */
  flex-wrap: nowrap;
  padding-left: 24rpx;
  padding-right: 24rpx;
}

.uni-tab-item-title {
  color: #555;
  font-size: 30rpx;
  height: 80rpx;
  line-height: 80rpx;
  flex-wrap: nowrap;
  /* #ifndef APP-PLUS */
  white-space: nowrap;
  /* #endif */
}

.uni-tab-item-title-active {
  color: #007aff;
}

.swiper-box {
  flex: 1;
  height: 100%;
  /* #ifdef H5 */
  // height: calc(100% - 80rpx);
  /* #endif */
  padding: 0 10rpx;
  background-color: #f1f1f1;
}

.swiper-item {
  flex: 1;
  flex-direction: row;
}

.scroll-v {
  flex: 1;
  /* #ifndef MP-ALIPAY */
  flex-direction: column;
  /* #endif */
  width: 750rpx;
  width: 100%;
}

.update-tips {
  position: absolute;
  left: 0;
  top: 41px;
  right: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #fddd9b;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.update-tips-text {
  font-size: 14px;
  color: #ffffff;
}

.refresh {
  width: 750rpx;
  width: 100%;
  height: 64px;
  justify-content: center;
}

.refresh-view {
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.refresh-icon {
  width: 30px;
  height: 30px;
  transition-duration: 0.5s;
  transition-property: transform;
  transform: rotate(0deg);
  transform-origin: 15px 15px;
}

.refresh-icon-active {
  transform: rotate(180deg);
}

.option {
  margin: 20rpx 0;
}

.loading-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  color: #999999;
}

.loading-text {
  margin-left: 2px;
  font-size: 16px;
  color: #999999;
}

.loading-more {
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 40px;
  text-align: center;
}

.loading-more-text {
  font-size: 28rpx;
  color: #999;
}

.list {
  height: calc(100% - 80rpx);
  background-color: #eee;
  // padding: 0 20rpx;
  // margin: 0 20rpx;
}

.list-item {
  margin-top: 10rpx;
  padding: 10rpx 20rpx;
  background-color: #fff;
  border-radius: 20rpx;

  .item-number {
    display: flex;
    justify-content: space-between;

    text:nth-child(1) {
      color: #000;
    }

    text:nth-child(2) {
      flex: 0 0 auto;
      color: #333;

      .done {
        color: #666666;
      }

      .toSend {
        color: #cf9155;
      }

      .toAudit {
        color: #333;
      }
    }
  }
}

.list-item:first-child {
  margin-top: 20rpx;
}

.list-item-content {
  padding: 10rpx 0;

  .product-img {
    min-width: 120rpx;
    width: 120rpx;
    height: 120rpx;
  }

  .product-name {
    // height: 50rpx;
    // line-height: 50rpx;
    color: #000;
    text-overflow: ellipsis;
    lines: 1;
  }

  .product-num {
    display: flex;
    justify-content: space-between;
  }
}

.list-item-content-right {
  padding-left: 20rpx;
  flex: 1;
  .product-tag {
    display: inline-block;
    border-radius: 20rpx;
    padding: 0 10rpx;
    height: 38rpx;
    line-height: 38rpx;
    font-size: 22rpx;
    color: #999;
    background: #f2f2f2;
  }

  .product-price {
    text-align: right;
    // padding-right: 30rpx;
    padding-top: 20rpx;
    font-size: 26rpx;

    .l {
      color: #656363;
      padding-right: 10rpx;
    }

    .r {
      color: #000;
    }
  }
}

.option {
  .btn {
    width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 15px;
    align-items: center;
    text-align: center;
    margin-left: 30rpx;
  }

  .grey {
    border: 2rpx solid rgba(155, 155, 155, 1);
    color: rgba(155, 155, 155, 1);
  }

  .red {
    border: 2rpx solid rgba(230, 0, 18, 1);
    color: rgba(230, 0, 18, 1);
  }
}
.justify-end {
  justify-content: flex-end;
}
</style>
