<template>
  <view class="pay-result-wraper">
    <view class="pay-result mb-24" :class="{ 'over-page': community }">
      <image class="top-pic mb-24" :src="appImg.mall.order_pay_success"></image>
      <view class="mb-24" style="font-weight: bold">订单提交成功</view>
      <view class="pay-price mb-24">￥{{ result.total_pay_price }}</view>
      <view class="dir-left-nowrap main-center">
        <view v-if="!community" class="btn-wrap">
          <view class="return-btn" style="color: #999999; border-color: #e2e2e2" @click="reLaunch('/pages/index/index')"
            >返回首页
          </view>
        </view>
        <view class="btn-wrap">
          <view class="return-btn" :style="{ color: getTheme.color }" @click="redirectTo(orderPageUrl)">
            {{ community ? '查看详情' : '查看订单' }}
          </view>
        </view>
      </view>

      <view v-if="showGift" class="gift">
        <image class="background" :src="appImg.mall.order_pay_result_coupon"></image>
        <view class="title">恭喜你获得</view>
        <scroll-view scroll-y class="gift-scroll">
          <template v-if="result.send_data && result.send_data.send_integral_num > 0">
            <view class="item dir-left-nowrap cross-center">
              <view class="box-grow-0">
                <image class="integral-img" src="/static/image/integral.png"></image>
              </view>
              <view class="box-grow-1">
                <view class="send-data-name mb-12">{{ result.send_data.send_integral_num }}积分</view>
                <view class="send-data-desc">即时到账</view>
              </view>
              <view class="box-grow-0">
                <app-form-id>
                  <view
                    class="return-btn small"
                    :style="{ 'background-color': getTheme.background, 'border-color': getTheme.border }"
                    @click="redirectTo('/pages/index/index')"
                  >
                    立即使用
                  </view>
                </app-form-id>
              </view>
            </view>
          </template>
          <template v-if="result.send_data && result.send_data.send_balance > 0">
            <view class="item dir-left-nowrap cross-center">
              <view class="box-grow-0">
                <image class="hongbao-img" src="/static/image/hongbao.png"></image>
              </view>
              <view class="box-grow-1">
                <view class="send-data-name mb-12">{{ result.send_data.send_balance }}元余额红包</view>
                <view class="send-data-desc">即时到账</view>
              </view>
              <view class="box-grow-0">
                <app-form-id>
                  <view
                    class="return-btn small"
                    :style="{ 'background-color': getTheme.background, 'border-color': getTheme.border }"
                    @click="redirectTo('/pages/index/index')"
                  >
                    立即使用
                  </view>
                </app-form-id>
              </view>
            </view>
          </template>
          <template v-if="result.user_coupon_list && result.user_coupon_list.length">
            <view
              v-for="(item, index) in result.user_coupon_list"
              :key="index"
              class="item dir-left-nowrap cross-center"
            >
              <view class="box-grow-0 dir-left-nowrap cross-bottom main-center">
                <template v-if="item.type == 1">
                  <view class="coupon-discount">{{ item.discount }}</view>
                  <view class="coupon-discount-unit">折</view>
                </template>
                <template v-if="item.type == 2">
                  <view class="coupon-price-unit">￥</view>
                  <view class="coupon-price">{{ item.sub_price }}</view>
                </template>
              </view>
              <view class="box-grow-1">
                <view class="coupon-name mb-12">{{ item.name }}</view>
                <view class="coupon-desc">
                  <block v-if="item.min_price > 0">满{{ item.min_price }}元可用</block>
                  <block v-else>满任意金额可用</block>
                </view>
                <view v-if="item.discount_limit" class="coupon-desc">优惠上限:￥{{ item.discount_limit }}</view>
              </view>
              <view class="box-grow-0">
                <app-form-id>
                  <view
                    class="return-btn small"
                    :style="{ 'background-color': getTheme.background, 'border-color': getTheme.border }"
                    @click="
                      redirectTo(
                        item.appoint_type == 4 ? '/plugins/scan_code/index/index' : '/pages/coupon/index/index'
                      )
                    "
                  >
                    立即使用
                  </view>
                </app-form-id>
              </view>
            </view>
          </template>
          <template v-if="result.card_list && result.card_list.length">
            <view v-for="(item, index) in result.card_list" :key="index" class="item dir-left-nowrap cross-center">
              <view class="box-grow-0">
                <image class="card-img" :src="item.pic_url"></image>
              </view>
              <view class="box-grow-1">
                <view class="card-name">{{ item.name }}</view>
              </view>
              <view class="box-grow-0">
                <app-form-id>
                  <view
                    class="return-btn small"
                    :style="{ 'background-color': getTheme.background, 'border-color': getTheme.border }"
                    @click="redirectTo('/pages/card/index/index')"
                  >
                    立即使用
                  </view>
                </app-form-id>
              </view>
            </view>
          </template>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { store } from '@/store'
export default defineComponent({
  name: 'PayResult',
  setup() {
    const appImg = store.state.mallConfig.__wxapp_img
    const getTheme = store.state.mallConfig.theme_color
    const state = reactive({
      payment_order_union_id: null,
      result: null as any,
      redirectUrl: null,
      recommendGoodsList: null,
      shareCheck: false,
      orderPageUrl: false,
      community: false,
    })
    const redirectTo = (url) => {
      uni.redirectTo({
        url: url,
      })
    }
    const reLaunch = (url) => {
      uni.reLaunch({
        url: url,
      })
    }
    return {
      ...toRefs(state),
      appImg,
      getTheme,
      redirectTo,
      reLaunch,
    }
  },
})
</script>
<style lang="scss">
.pay-result-wraper {
}
</style>
