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
              <template v-if="item.status == 0">
                <text v-if="item.sign == 'pintuan'">{{ item.is_pay == 1 ? '拼团中' : '待付款' }}</text>
              </template>
              <template v-else>
                <view>{{ item.status_text }}</view>
              </template>
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
                    <view class="product-tag">
                      <text v-for="attr in i.goods_info.attr_list" :key="attr.id"
                        >{{ attr.attr_group_name }},{{ attr.attr_name }}</text
                      >
                    </view>
                    <view class="product-num">
                      <text class="font-color">￥{{ i.total_price }}</text>
                      <text>x{{ i.num }}</text>
                    </view>
                    <view class="product-price">
                      <text class="l"
                        >总价：¥{{ item.total_price }}，优惠：¥{{ item.total_price - item.total_price }}
                      </text>
                      <text class="r">实付款：¥{{ item.total_pay_price }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="option flex justify-end action-box-view">
              <!-- 售后订单 -->
              <template v-if="currentIndex == 5">
                <text :class="{ 'success-color': item.is_confirm == 1 ? true : false }">
                  {{ item.status_text }}
                </text>
              </template>
              <!-- 其它订单 -->
              <template v-else>
                <!-- 货到付款订单操作 start -->
                <template v-if="item.pay_type == 2">
                  <!-- 进行中的订单 不能进行订单操作 -->
                  <template v-if="item.status == 1">
                    <!-- 待收货-->
                    <template v-if="item.is_confirm == 0">
                      <view v-if="isShowExpressButton(item)" class="order-btn" @click="logistics(item)">物流 </view>
                      <view v-if="item.is_send == 1 && item.is_confirm == 0" class="order-btn" @click="confirm(item)"
                        >确认收货
                      </view>
                    </template>
                    <!-- 核销 -->
                    <!-- 到店自提订单 在核销前有收款操作 -->
                    <template v-if="item.send_type == 1 && item.is_confirm == 0 && item.cancel_status == 0">
                      <view class="order-btn" @click="getClerkCode(item)">核销码</view>
                    </template>
                    <template v-if="item.action_status.is_show_comment == 1">
                      <view class="order-btn" @click="appraise(item)">评价</view>
                    </template>
                  </template>
                </template>
                <!-- 货到付款订单操作 end -->
                <!-- 已支付订单操作 start -->
                <template v-else>
                  <!-- 待付款 -->
                  <template v-if="item.is_pay == 0">
                    <view class="order-btn red" @click="cancel(item)">取消</view>
                    <view class="order-btn grey" @click="orderPay(item)">付款</view>
                  </template>
                  <template v-if="item.status == 1">
                    <!-- 核销 -->
                    <!-- 到店自提订单 未支付不显示核销码 | 未支付 货到付款订单显示核销码 -->
                    <template
                      v-if="
                        item.send_type == 1 &&
                        item.is_confirm == 0 &&
                        ((item.is_pay == 0 && item.pay_type == 2) || (item.is_pay == 1 && item.pay_type != 2))
                      "
                    >
                      <view class="order-btn" @click="getClerkCode(item)">核销码</view>
                    </template>
                    <!-- 待收货-->
                    <template v-if="item.is_pay == 1 && item.is_confirm == 0 && item.sign != 'community'">
                      <view v-if="isShowExpressButton(item)" class="order-btn" @click="logistics(item)">物流 </view>
                      <view v-if="item.is_send == 1 && item.is_confirm == 0" class="order-btn" @click="confirm(item)"
                        >确认收货</view
                      >
                    </template>
                    <template v-if="item.action_status.is_show_comment == 1">
                      <view class="order-btn" @click="appraise(item)">评价</view>
                    </template>
                  </template>
                </template>
                <!-- 已支付订单操作 end -->
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
import { orderStatusEnum } from '@/utils/constant'
import { Debounce } from '@/utils/util'

export default defineComponent({
  name: 'OrderList',
  setup() {
    const state = reactive({
      tabBars: [
        { name: '全部', status: 0 },
        { name: '待付款', status: orderStatusEnum.PENDING_PAYMENT },
        { name: '待发货', status: orderStatusEnum.WAIT_SEND },
        { name: '待收货', status: orderStatusEnum.DISPATCHED },
        { name: '已完成', status: orderStatusEnum.COMPLETED },
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

    // 下拉刷新
    const refresh = () => {
      state.refeshloading = true
      getList(state.tabIndex, '', true)
    }

    const isShowExpressButton = (order) => {
      if (order.is_send) {
        if (order.detailExpress.length == 1 && order.detailExpress[0].send_type == 2 && order.send_type == 0) {
          return false
        }

        if (order.is_confirm == 0) {
          return true
        }
      }

      return false
    }

    // 物流信息
    const logistics = (orderDetail) => {
      if (orderDetail.is_send == 1 && orderDetail.detailExpress.length == 0) {
        // 兼容
        let [id, express, express_no, customer_name, cover_pic] = [
          orderDetail.id,
          orderDetail.express,
          orderDetail.express_no,
          orderDetail.customer_name,
          orderDetail.detail[0].goods_info.pic_url,
        ]
        uni.navigateTo({
          url: `/pages/order/express-detail/express-detail?id=${id}&express=${express}&express_no=${express_no}&customer_name=${customer_name}&cover_pic=${cover_pic}`,
        })
      } else if (orderDetail.is_send == 1 && orderDetail.detailExpress.length == 1 && orderDetail.send_type != 2) {
        let express = orderDetail.detailExpress[0].express
        let express_no = orderDetail.detailExpress[0].express_no
        let customer_name = orderDetail.detailExpress[0].customer_name
        let cover_pic = orderDetail.detailExpress[0].expressRelation[0].orderDetail.goods_info.goods_attr.cover_pic
        uni.navigateTo({
          url:
            `/pages/order/express-detail/express-detail?express=` +
            express +
            `&customer_name=` +
            customer_name +
            `&express_no=` +
            express_no +
            `&cover_pic=` +
            cover_pic,
        })
      } else if (orderDetail.detailExpress.length >= 1) {
        uni.navigateTo({
          url: '/pages/order/express-list/express-list?order_id=' + orderDetail.id,
        })
      }
    }

    const getClerkCode = (e) => {}

    // 订单评价
    const appraise = (e) => {
      uni.navigateTo({
        url: `/pages/order/appraise/appraise?id=${e.id}`,
      })
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
      isShowExpressButton,
      loadMore,
      refresh,
      logistics,
      getClerkCode,
      appraise,
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
    text {
      padding-right: 10rpx;
    }
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
  .order-btn {
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
