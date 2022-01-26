<template>
  <view class="tabs">
    <scroll-view class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
      <view
        v-for="(tab, index) in tabBars"
        :key="tab.status"
        class="uni-tab-item"
        :data-current="index"
        @click="clickHandlerTab"
      >
        <text class="uni-tab-item-title" :class="tabIndex == index ? 'uni-tab-item-title-active' : ''">{{
          tab.name
        }}</text>
      </view>
    </scroll-view>
    <view class="line-h"></view>
    <swiper :current="tabIndex" class="swiper-box" style="flex: 1" :duration="300" @change="onTabChange">
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
              <text>订单编号：{{ item.order_no }}</text>
              <text :class="{ done: item.status === 1, toSend: item.status === 2, toAudit: item.status === 3 }">{{
                renderStatus(item.status)
              }}</text>
            </view>
            <view class="list-item-content" @click="toDetail(item.id)">
              <view v-for="(i, n) in item.detail" :key="n" class="">
                <view class="flex">
                  <view class="product-img">
                    <image :src="i.goods_info.pic_url"></image>
                  </view>
                  <view class="list-item-content-right flex-sub">
                    <view class="product-name">
                      {{ i.goods_info.name }}
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
import { fetchOrderList } from '@/api/order'
// import * as util from '@/utils/constant.js'
import { Debounce } from '@/utils/util'

export default defineComponent({
  name: 'OrderList',
  setup() {
    const state = reactive({
      tabBars: [
        { name: '全部', status: 0 },
        { name: '待付款', status: 1 },
        { name: '待发货', status: 2 },
        { name: '待收货', status: 3 },
        { name: '已完成', status: 4 },
      ],
      tabIndex: 0,

      page: 1,
      currentIndex: 0,
      orders: [],
      search: {
        keyword: '',
        dateArr: [],
      },
      pagination: null,
      qr_code_url: '',
      is_qrcode: false,
      is_show: false,
      is_load_show: false,
      bgColor: '#f7f7f7',
      isRequest: true, //防止数据重复加载
      template_message: [],
      recommend_list: [],

      newsList: [] as any[],
      scrollInto: '',
      // 刷新状态
      refeshloading: false,
      key: 0,
    })

    const getList = Debounce(function (index, next, refresh) {
      let activeTab = state.newsList[index]
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
          status: 0,
        }
        if (state.tabIndex) params.status = state.tabBars[state.tabIndex].status
        fetchOrderList(params)
          .then((res) => {
            activeTab.isLoading = false
            if (res.code === 0) {
              activeTab.data = activeTab.data.concat(res.data.list)
              activeTab.total = res.data.totalElements
              activeTab.pageNum++
              state.refeshloading = false
              if (activeTab.total <= activeTab.data.length || res.data.totalElements === 0) {
                activeTab.allData = true
                activeTab.loadingText = '没有更多了'
                state.key++
              }
            } else {
              state.refeshloading = false
            }
            uni.stopPullDownRefresh()
          })
          .catch(() => {
            state.refeshloading = false
            activeTab.isLoading = false
            uni.stopPullDownRefresh()
          })
      }
    }, 100)

    const onTabChange = (e) => {
      let index = e.target.current || e.detail.current
      switchTab(index)
    }

    const loadMore = (e) => {
      setTimeout(() => {
        getList(state.tabIndex, true)
      }, 500)
    }

    const clickHandlerTab = (e) => {
      let index = e.target.dataset.current || e.currentTarget.dataset.current
      switchTab(index)
    }

    const switchTab = Debounce(function (index) {
      if (state.tabIndex === index) {
        return
      }
      if (state.newsList[index].data.length === 0) {
        getList(index)
      }
      state.tabIndex = index
      state.scrollInto = 'tab' + state.tabBars[index].status
    }, 5)

    const renderStatus = (status) => {
        
    }

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
      clickHandlerTab,
      onTabChange,
      renderStatus,
    }
  },
})
</script>
<style lang="scss" scoped>
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
    image {
      width: 100%;
      height: 100%;
    }
  }

  .product-name {
    color: #353535;
    font-size: 26rpx;
    word-break: break-all;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
