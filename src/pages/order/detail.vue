<template>
  <view>
    <view v-if="is_show && orderDetail" class="order-detail-box">
      <view>{{ orderDetail.status_text }}</view>
      <view>
        <template
          v-if="orderDetail.is_send == 1 && orderDetail.detailExpress.length == 1 && orderDetail.send_type != 2"
        >
          <view class="express-box">
            <template v-if="orderDetail.detailExpress[0].send_type == 1"> app-order-express </template>
            <template v-else> 物流信息: 其它方式({{ orderDetail.detailExpress[0].express_content }}) </template>
          </view>
        </template>
        <template
          v-else-if="
            orderDetail.detailExpress.length > 1 || (orderDetail.is_send == 0 && orderDetail.detailExpress.length >= 1)
          "
        >
          <view class="e-box dir-left-nowrap cross-center">
            <view class="dir-top-nowrap box-grow-1 text"> 该订单已拆成多个包裹发货，点击查看详情 </view>
            <image class="box-grow-0 img" src="/static/image/icon/arrow-right.png"></image>
          </view>
        </template>
        <view v-if="orderDetail.sign !== 'vip_card'" class="order-label">配送信息</view>
        <view v-if="orderDetail.sign !== 'vip_card'" class="order-list dir-top-nowrap">
          <view v-if="orderDetail.send_type != 3" class="dir-left-nowrap">
            <view class="box-grow-0">联系人：</view>
            <view class="box-grow-1">{{ orderDetail.name }}</view>
            <view class="box-grow-0">{{ orderDetail.mobile }}</view>
          </view>
          <view
            v-if="
              orderDetail.goods_type === 'ecard' ||
              orderDetail.goods_type === 'scan_code_pay' ||
              (orderDetail.is_send && orderDetail.is_show_send_type == 1)
            "
          >
            <block v-if="orderDetail.send_type == 0">发货方式：快递发货</block>
            <block v-if="orderDetail.send_type == 1">发货方式：上门自提</block>
            <block v-if="orderDetail.send_type == 2">发货方式：同城配送</block>
            <block v-if="orderDetail.send_type == 3">发货方式：自动发货</block>
            <!--                        <block v-if="orderDetail.goods_type === 'ecard'">发货方式：自动发货</block>-->
          </view>

          <!-- 快递 -->
          <view v-if="orderDetail.send_type != 1 && orderDetail.address" class="dir-left-nowrap">
            <view class="box-grow-0">收货地址：</view>
            <view class="box-grow-1 text">{{ orderDetail.address }}</view>
          </view>

          <!-- 门店 -->
          <block v-if="orderDetail.send_type == 1 && orderDetail.goods_type === 'goods'">
            <view class="dir-left-nowrap">
              <view class="box-grow-0">门店名称：</view>
              <view class="box-grow-1 text">{{ orderDetail.store.name }}</view>
            </view>
            <view class="dir-left-nowrap">
              <view class="box-grow-0">联系方式：</view>
              <view class="box-grow-1">{{ orderDetail.store.mobile }}</view>
            </view>
            <view class="dir-left-nowrap">
              <view class="box-grow-0">门店地址：</view>
              <view class="box-grow-1 text">{{ orderDetail.store.address }}</view>
            </view>
            <view class="order-list-btn" @click="navigation(orderDetail.store)">导航 </view>
          </block>

          <!-- 同城配送 -->
          <block v-if="orderDetail.delivery_config">
            <view class="dir-left-nowrap">
              <view class="box-grow-0">发货地址：</view>
              <view class="box-grow-1">{{ orderDetail.delivery_config.address.address }}</view>
            </view>
            <view v-if="orderDetail.delivery_config.contact_way" class="dir-left-nowrap">
              <view class="box-grow-0">联系方式：</view>
              <view class="box-grow-1">{{ orderDetail.delivery_config.contact_way }}</view>
            </view>
            <view v-if="orderDetail.delivery_config.explain" class="dir-left-nowrap">
              <view class="box-grow-0">配送说明：</view>
              <view class="box-grow-1">{{ orderDetail.delivery_config.explain }}</view>
            </view>
          </block>
        </view>

        <!-- 电子卡密 -->
        <template v-if="orderDetail.type_data && orderDetail.type_data.ecard && orderDetail.type_data.ecard.length > 0">
          <view style="margin: 24rpx 0">
            <view class="preferential-box dir-left-nowrap main-between">
              <view> 卡密信息 </view>
              <view @click="go_eCard">
                <text>使用说明</text>
                <image src="/static/image/icon/arrow-right.png" class="instructions"></image>
              </view>
            </view>
            <view class="ecard dir-top-wrap" :style="{ paddingBottom: ecard.length >= 1 ? '20rpx' : '0' }">
              <view v-for="(item, key) in ecard" :key="key" class="item dir-top-nowrap">
                <view style="margin-bottom: 10rpx">【{{ key + 1 }}】</view>
                <view class="dir-left-nowrap cross-center">
                  <view class="box-grow-1">
                    <view v-for="(n, d) in item" :key="d" class="text">{{ n.key }}：{{ n.value }} </view>
                  </view>
                  <view class="box-grow-0 detail-btn" size="mini" @click="copyTextEcard(item)">复制全部 </view>
                </view>
              </view>
              <view
                v-if="
                  ecard.length === 1 &&
                  orderDetail.type_data &&
                  orderDetail.type_data.ecard &&
                  orderDetail.type_data.ecard.length > 1
                "
                class="expand dir-left-nowrap main-center cross-center"
                @click="ecard = orderDetail.type_data.ecard"
              >
                <text>点击展开</text>
                <image src="/static/image/icon/icon-down.png"></image>
              </view>
            </view>
          </view>
        </template>

        <template
          v-if="
            orderDetail.send_type == 2 &&
            (orderDetail.detailExpress.length == 1 || orderDetail.city_name) &&
            orderDetail.is_send == 1
          "
        >
          <view
            v-if="orderDetail.send_type == 2"
            class="order-info-box dir-top-nowrap delivery"
            style="margin-top: -20rpx; border-top: 1rpx solid #e2e2e2"
          >
            <view class="dir-left-nowrap cross-center city-service">
              <image class="head" src="/static/image/icon/deliveryman.png"></image>
              <template v-if="orderDetail.detailExpress[0].city_name && orderDetail.detailExpress[0].city_mobile">
                <view class="info-box dir-top-nowrap box-grow-1">
                  <view class="info-label">配送员</view>
                  <view class="info">
                    {{ orderDetail.city_name ? orderDetail.city_name : orderDetail.detailExpress[0].city_name }}
                    {{ orderDetail.city_mobile ? orderDetail.city_mobile : orderDetail.detailExpress[0].city_mobile }}
                  </view>
                </view>
                <view class="icon-box">
                  <view>
                    <image class="icon" src="/static/image/icon/store-tel.png"></image>
                  </view>
                </view>
                <!-- 第三方配送才有地图信息 -->
                <view v-if="orderDetail.detailExpress[0].send_type == 1" class="icon-box">
                  <view>
                    <image class="icon" src="/static/image/icon/shipping-address.png"></image>
                  </view>
                </view>
              </template>
              <template v-else>
                <view class="await-man">等待分配骑手</view>
              </template>
            </view>
            <block v-if="orderDetail.detailExpress[0].status != 101">
              <view class="dir-left-wrap">
                <view
                  v-for="erItem in orderDetail.detailExpress[0].expressRelation"
                  :key="erItem.id"
                  class="goods-image"
                >
                  >
                  <image
                    width="120rpx"
                    height="120rpx"
                    :img-src="erItem.orderDetail.goods_info.goods_attr.cover_pic"
                  ></image>
                </view>
              </view>
              <view class="goods-num">共{{ orderDetail.detailExpress[0].goods_num }}件商品</view>
            </block>
          </view>
        </template>

        <!--------------订单信息---------------->
        <view class="order-label">订单信息</view>
        <view class="order-list dir-top-nowrap">
          <view class="dir-left-nowrap cross-center">
            <view class="box-grow-0">订单编号：</view>
            <view class="box-grow-1">{{ orderDetail.order_no }}</view>
            <view
              style="position: absolute; right: 24rpx"
              class="box-grow-0 detail-btn"
              @click="copyText(orderDetail.order_no)"
              >复制
            </view>
          </view>
          <view>下单时间：{{ orderDetail.created_at }}</view>
          <view v-if="orderDetail.pay_type == 1">支付方式：线上支付</view>
          <view v-if="orderDetail.pay_type == 2">支付方式：货到付款</view>
          <view v-if="orderDetail.pay_type == 3">支付方式：余额支付</view>
          <view v-if="orderDetail.pay_type == 4">支付方式：现金</view>
          <view v-if="orderDetail.pay_type == 5">支付方式：pos机</view>
          <view v-if="orderDetail.sign == 'exchange'">兑换码：{{ orderDetail.exchange_code.code }}</view>
        </view>

        <template v-if="orderDetail.sign === 'advance'">
          <view class="preferential-box dir-top-nowrap">
            <view class="dir-left-nowrap item" style="margin-bottom: 28rpx">
              <text class="box-grow-1" style="font-size: 28rpx">
                商品总价：￥{{ orderDetail.total_goods_original_price }}，定金￥{{
                  orderDetail.advance_order.deposit
                }}抵扣￥{{ orderDetail.advance_order.swell_deposit }}
              </text>
            </view>
            <view class="item-box">
              <view class="dir-left-nowrap item">
                <text class="box-grow-1" style="color: #ff4544; font-size: 24rpx">阶段一</text>
              </view>
              <view class="dir-left-nowrap item" style="margin-top: 20rpx">
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 定金 </text>
                <text class="box-grow-0">￥{{ orderDetail.advance_order.deposit }}</text>
              </view>
            </view>
            <view class="item-box" style="margin-top: 24rpx">
              <view class="dir-left-nowrap item">
                <text class="box-grow-1" style="color: #ff4544; font-size: 24rpx">阶段二</text>
              </view>
              <view class="dir-left-nowrap item" style="margin-top: 20rpx">
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 尾款 </text>
                <text class="box-grow-0">￥{{ orderDetail.final_price }}</text>
              </view>
              <view class="dir-left-nowrap item" style="margin-top: 20rpx">
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 运费 </text>
                <text class="box-grow-0">￥{{ orderDetail.express_price }}</text>
              </view>
              <view v-if="orderDetail.member_discount_price > 0" class="dir-left-nowrap item" style="margin-top: 20rpx">
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 会员折扣 </text>
                <text class="box-grow-0">-￥{{ orderDetail.member_discount_price }}</text>
              </view>
              <view
                v-if="orderDetail.integral_deduction_price > 0"
                class="dir-left-nowrap item"
                style="margin-top: 20rpx"
              >
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 积分抵扣 </text>
                <text class="box-grow-0">-￥{{ orderDetail.integral_deduction_price }}</text>
              </view>
              <view v-if="orderDetail.coupon_discount_price > 0" class="dir-left-nowrap item" style="margin-top: 20rpx">
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 优惠券抵扣 </text>
                <text class="box-grow-0">-￥{{ orderDetail.coupon_discount_price }}</text>
              </view>
              <view
                v-if="orderDetail.advance_order.preferential_price > 0"
                class="dir-left-nowrap item"
                style="margin-top: 20rpx"
              >
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx"> 活动优惠 </text>
                <text class="box-grow-0">-￥{{ orderDetail.advance_order.preferential_price }}</text>
              </view>
              <view
                v-if="orderDetail.plugin_data.discount_list.vip_discount"
                class="dir-left-nowrap item"
                style="margin-top: 20rpx"
              >
                <text class="box-grow-1" style="color: #666666; font-size: 28rpx">
                  {{ orderDetail.plugin_data.discount_list.vip_discount.label }}
                </text>
                <text class="box-grow-0">-￥{{ orderDetail.plugin_data.discount_list.vip_discount.value }}</text>
              </view>
            </view>
            <view class="dir-left-nowrap item main-right" style="margin: 28rpx 0">
              合计：
              <span>
                <text v-if="orderDetail.plugin_data.exchange_count" class="price"
                  >{{ orderDetail.plugin_data.exchange_count }}{{ orderDetail.plugin_data.price_name }}+</text
                >
                <text class="box-grow-0" style="font-size: 28rpx">￥{{ orderDetail.total_pay_price }}</text>
              </span>
            </view>
          </view>
        </template>

        <!------------商品信息------------------>
        <view class="order-label">商品信息</view>
        <view v-if="orderDetail.sign !== 'advance'" class="preferential-box dir-top-wrap">
          <view v-if="orderDetail.plugin_data.exchange_count == null" class="dir-left-nowrap item">
            <view class="box-grow-1">商品总价</view>
            <view class="box-grow-0">￥{{ orderDetail.total_goods_original_price }}</view>
          </view>
          <view v-if="orderDetail.plugin_data.exchange_count" class="dir-left-nowrap item">
            <view class="box-grow-1">兑换{{ orderDetail.plugin_data.price_name }}</view>
            <view class="box-grow-0">{{ orderDetail.plugin_data.exchange_count }}</view>
          </view>
          <view v-if="orderDetail.plugin_data.exchange_count >= 0" class="dir-left-nowrap item">
            <view class="box-grow-1">兑换金额</view>
            <view class="box-grow-0">￥{{ orderDetail.total_goods_original_price }}</view>
          </view>
          <view
            v-if="orderDetail.sign !== 'advance' && orderDetail.goods_type === 'goods'"
            class="dir-left-nowrap item"
          >
            <view class="box-grow-1">运费</view>
            <view class="box-grow-0">￥{{ orderDetail.express_price }}</view>
          </view>
          <view v-if="orderDetail.member_deduction_price_count > 0 && sign !== 'advance'" class="dir-left-nowrap item">
            <view class="box-grow-1">会员折扣</view>
            <view class="box-grow-0">-￥{{ orderDetail.member_deduction_price_count }}</view>
          </view>
          <view v-if="orderDetail.integral_deduction_price > 0" class="dir-left-nowrap item">
            <view class="box-grow-1">积分抵扣</view>
            <view class="box-grow-0">-￥{{ orderDetail.integral_deduction_price }}</view>
          </view>
          <view v-if="orderDetail.coupon_discount_price > 0" class="dir-left-nowrap item">
            <view class="box-grow-1">优惠券抵扣</view>
            <view class="box-grow-0">-￥{{ orderDetail.coupon_discount_price }}</view>
          </view>
          <!-- 插件额外优惠 -->
          <view v-if="orderDetail.plugin_data && orderDetail.plugin_data.discount_list && sign !== 'advance'">
            <view v-for="item in orderDetail.plugin_data.discount_list" :key="item.id" class="dir-left-nowrap item">
              <view class="box-grow-1">{{ item.label }}</view>
              <view v-if="item.value > 0" class="box-grow-0">-￥{{ item.value }}</view>
              <view v-if="item.value < 0" class="box-grow-0">+￥{{ -item.value }}</view>
            </view>
          </view>
          <view v-if="orderDetail.full_reduce_price > 0 && sign !== 'advance'" class="dir-left-nowrap item">
            <view class="box-grow-1">满减优惠</view>
            <view class="box-grow-0">-￥{{ orderDetail.full_reduce_price }}</view>
          </view>
          <view v-if="orderDetail.back_price > 0" class="dir-left-nowrap item">
            <view class="box-grow-1">订单改价</view>
            <view v-if="orderDetail.back_price > 0" class="box-grow-0">-￥{{ orderDetail.back_price }}</view>
            <view v-if="orderDetail.back_price < 0" class="box-grow-0">+￥{{ -orderDetail.back_price }}</view>
          </view>
          <view v-if="orderDetail.remark && orderDetail.goods_type === 'goods'" class="dir-top-nowrap item">
            <view class="box-grow-1">买家留言:</view>
            <view style="word-break: break-all" class="box-grow-0 t-extra-small-color">{{ orderDetail.remark }} </view>
          </view>
        </view>
        <view v-if="orderDetail.sign !== 'advance'" class="order-price-box cross-center dir-right-nowrap">
          <view>
            合计:
            <span>
              <text v-if="orderDetail.plugin_data.exchange_count" class="price"
                >{{ orderDetail.plugin_data.exchange_count }}{{ orderDetail.plugin_data.price_name }}+</text
              >
              <text class="price">￥{{ orderDetail.total_pay_price }}</text>
            </span>
          </view>
        </view>

        <!--------------商品信息 end 商品列表---------------->
        <view
          v-if="orderDetail.platform"
          class="order-label"
          style="font-weight: normal; border-top: 1rpx solid #e2e2e2; padding: 30rpx 24rpx"
        >
          {{ orderDetail.platform }}
        </view>
        <view v-if="sign == 'composition'" class="goods-box composition">
          <view v-for="(list, idx) in orderDetail.composition_list" :key="idx" class="composition-item">
            <view class="main-between composition-title">
              <view v-if="list.type == 1" class="composition-type">固定套餐</view>
              <view v-else class="composition-type">搭配套餐</view>
              <view>套餐总价 ￥{{ list.total_price }}</view>
            </view>
            <view v-for="(item, index) in list.goods_list" :key="index" class="goods-list">
              <app-order-goods-info
                v-if="list.show || index == 0"
                :plugin="list.type == 2 ? sign : ''"
                :type="2"
                style="width: 100%"
                :goods="item"
                :plugin-data="orderDetail.plugin_data"
                :plugin-index="index"
              ></app-order-goods-info>
              <block v-if="orderDetail.is_send == 1 && (list.show || index == 0)">
                <view class="dir-left-nowrap sale-box">
                  <view class="box-grow-1"></view>
                  <view class="box-grow-0 dir-top-nowrap">
                    <!-- 无售后记录 且 未超过售后时间 才可申请售后 -->
                    <block v-if="orderDetail.detail[index].is_show_apply_refund && orderDetail.goods_type !== 'ecard'">
                      <app-jump-button
                        :url="`/pages/order/refund/select-refund-type?id=${orderDetail.detail[index].id}&sign=${orderDetail.sign}`"
                      >
                        <view size="mini" class="sale-server detail-btn">申请售后</view>
                      </app-jump-button>
                    </block>
                    <block v-else-if="orderDetail.detail[index].refund">
                      <text class="refund-status">
                        已申请售后({{ orderDetail.detail[index].refund.status_text }})
                      </text>
                    </block>
                  </view>
                </view>
              </block>
            </view>
            <view class="composition-open main-center">
              <view class="composition-btn" @click="toggle(idx)">
                <text>{{ list.show ? '点击收起套餐详情' : '点击展开套餐详情' }}</text>
                <image v-if="!list.show" src="/static/image/icon/icon-down.png"></image>
                <image v-else src="/static/image/icon/icon-up.png"></image>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="goods-box">
          <view v-for="(item, index) in orderDetail.detail" :key="index">
            <app-jump-button :url="item.goods_info.page_url">
              <app-order-goods-info
                style="width: 100%"
                :goods="item.goods_info"
                :type="2"
                :plugin-data="orderDetail.plugin_data"
                :plugin-index="index"
              ></app-order-goods-info>
            </app-jump-button>
            <block v-if="orderDetail.is_send == 1">
              <view class="dir-left-nowrap sale-box">
                <view class="box-grow-1"></view>
                <view class="box-grow-0 dir-top-nowrap">
                  <!-- 无售后记录 且 未超过售后时间 才可申请售后 -->
                  <block v-if="item.is_show_apply_refund && orderDetail.goods_type !== 'ecard'">
                    <app-jump-button
                      :url="`/pages/order/refund/select-refund-type?id=${item.id}&sign=${orderDetail.sign}`"
                    >
                      <view size="mini" class="sale-server detail-btn">申请售后</view>
                    </app-jump-button>
                  </block>
                  <block v-else-if="item.refund">
                    <text class="refund-status">已申请售后({{ item.refund.status_text }})</text>
                  </block>
                </view>
              </view>
            </block>
          </view>
        </view>

        <!--其他信息-->
        <block
          v-if="
            (orderDetail.sign === 'booking' || orderDetail.sign === 'vip_card') &&
            orderDetail.order_form &&
            orderDetail.order_form.length
          "
        >
          <view class="order-label">其他信息</view>
          <view class="order-form order-list">
            <view v-for="(formItem, k) in orderDetail.order_form" :key="k" class="order-form-box">
              <view v-if="formItem.key === 'img_upload'" class="dir-top-nowrap">
                <view class="box-grow-0">{{ formItem.label }}：</view>
                <view class="dir-left-wrap">
                  <block v-if="Array.isArray(formItem.value)">
                    <image
                      v-for="(img, l) in formItem.value"
                      v-if="img"
                      :key="l"
                      :src="img"
                      style="margin-right: 16rpx; margin-bottom: 16rpx"
                      @click="look(img)"
                    ></image>
                  </block>
                  <image v-else-if="formItem.value" :src="formItem.value" @click="look(formItem.value)"></image>
                </view>
              </view>
              <view v-else class="dir-left-nowrap">
                <view class="box-grow-0">{{ formItem.label ? formItem.label : formItem.key_name }}：</view>
                <view class="box-grow-1 text">{{ formItem.value ? formItem.value : '' }}</view>
              </view>
            </view>
          </view>
        </block>
        <block v-else-if="orderDetail.sign !== 'teller' && formList && formList.length">
          <view class="order-label">其他信息</view>
          <view v-for="(formAll, i) in formList" :key="i" class="order-form order-list">
            <order-goods-info
              v-for="(goods, j) in formAll"
              v-if="isShowFormGoods"
              :key="j"
              style="width: 100%"
              :goods="goods.goods_info"
              :plugin-data="orderDetail.plugin_data"
              :plugin-index="i"
            ></order-goods-info>
            <view v-for="(formItem, k) in formAll[0]['form_data']" :key="k" class="order-form-box">
              <view v-if="formItem.key === 'img_upload'" class="dir-top-nowrap">
                <view class="box-grow-0">{{ formItem.label }}：</view>
                <view class="dir-left-wrap">
                  <block v-if="Array.isArray(formItem.value)">
                    <image
                      v-for="(img, l) in formItem.value"
                      v-if="img"
                      :key="l"
                      :src="img"
                      style="margin-right: 16rpx; margin-bottom: 16rpx"
                      @click="look(img)"
                    ></image>
                  </block>
                  <image v-else-if="formItem.value" :src="formItem.value" @click="look(formItem.value)"></image>
                </view>
              </view>
              <view v-else class="dir-left-nowrap">
                <view class="box-grow-0">{{ formItem.label }}：</view>
                <view class="box-grow-1 text">{{ formItem.value ? formItem.value : '' }}</view>
              </view>
            </view>
          </view>
        </block>
        <block
          v-if="
            (orderDetail.is_pay == 1 || orderDetail.pay_type == 2) &&
            orderDetail.is_send == 0 &&
            orderDetail.status == 1 &&
            orderDetail.detailExpressRelation.length == 0 &&
            orderDetail.cancel_status != 1
          "
        >
          <view v-if="orderDetail.sign != 'gift'" class="action-box dir-left-nowrap main-right">
            <view class="box-grow-0 btn" @click="cancel(orderDetail)">申请退款</view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import { fetchOrderDetail } from '@/api/order'
import GoodsInfo from './component/GoodsInfo.vue'
export default defineComponent({
  name: 'OrderDetail',
  components: {
    OrderGoodsInfo: GoodsInfo,
  },
  setup() {
    const state = reactive({
      order_id: null as any,
      orderDetail: {
        detailExpressRelation: [],
        detailExpress: [],
        detail: {} as any,
      } as any,
      is_show: false,
      advance_order: {
        goods_num: 0,
      },
      detail: [] as any[],
      sign: '' as any,
      ecard: [] as any[],
      isShowFormGoods: false,
    })

    const formList = computed(() => {
      const self = state
      let orderDetail = self.orderDetail.detail
      let newArr = {}
      let form_ids = []

      if (orderDetail && orderDetail.length) {
        console.log('orderDetail', orderDetail)
        for (let goods of orderDetail) {
          if (goods.form_id !== '0') {
            continue
          }
          console.log('xxxx')
          if (form_ids.indexOf(goods.form_id) === -1) {
            form_ids.push(goods.form_id)
            newArr[goods.form_id] = [goods]
          } else {
            newArr[goods.form_id].push(goods)
          }
        }
      }
      console.log('newArr', newArr)
      self.isShowFormGoods = form_ids.length > 0
      return Object.values(newArr)
    })
    console.log('formList', formList.value)
    const getOrderDetail = () => {
      fetchOrderDetail({
        id: state.order_id,
      })
        .then((response) => {
          state.is_show = true
          if (response.code === 0) {
            state.orderDetail = response.data.detail
            state.ecard = [state.orderDetail.type_data.ecard[0]]
            if (state.sign == 'composition') {
              for (let i in state.orderDetail.composition_list) {
                state.orderDetail.composition_list[i].show = false
              }
            }
          } else {
            uni.showModal({
              title: '',
              content: response.msg,
              showCancel: false,
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    onShow(() => {
      getOrderDetail()
    })

    onLoad((options) => {
      console.log('options', options)
      state.order_id = options.id
      state.sign = options.sign
    })

    return {
      ...toRefs(state),
      formList,
    }
  },
})
</script>
<style lang="scss" scoped>
.order-detail-box {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  position: relative;
  width: 100%;
  height: 100%;
}

.order-label {
  padding: #{32rpx} #{24rpx};
  font-size: #{30rpx};
  color: #353535;
  font-weight: bold;
  background: #ffffff;
  border-bottom: #{1rpx} solid #e2e2e2;
}

.goods-image {
  margin-right: #{20rpx};
  margin-bottom: #{20rpx};
}

.goods-num {
  font-size: #{24rpx};
  color: #999999;
  margin: #{20rpx} 0;
}

.order-form {
  background: #ffffff;

  .order-form-box {
    padding: #{5rpx} 0;

    span {
    }

    image {
      height: #{174rpx};
      width: #{174rpx};
      display: block;
      margin-top: #{15rpx};
    }
  }
}

.order-list {
  background: #ffffff;
  padding: #{32rpx} #{24rpx};
  margin-bottom: #{20rpx};

  > view {
    margin-bottom: #{10rpx};
  }

  .text {
    word-wrap: break-word;
  }

  > view:last-child {
    margin-bottom: 0;
  }

  .order-list-btn {
    border: 1#{rpx} solid #bbbbbb;
    border-radius: 30#{rpx};
    padding: 10#{rpx} 30#{rpx};
    display: inline-block;
    margin-left: calc(100vw - #{170rpx});
  }
}

.order-form:last-child {
  border-bottom: none;
}

.express-box {
  background: #fff;
  padding: 32#{rpx} 24#{rpx};
  margin-bottom: 20#{rpx};
}

.address-box {
  background: #fff;
  padding: 32#{rpx} 24#{rpx};
  margin-bottom: 20#{rpx};

  .address {
    word-wrap: break-word;
  }
}

.address-box .text {
  margin-top: 10#{rpx};
}

.delivery {
  .deliveryman {
    width: #{72rpx};
    height: #{72rpx};
    display: block;
    margin-right: #{24rpx};
  }

  .delivery-tips {
    font-size: $uni-font-size-sm;
    color: $uni-text-color;
    margin-bottom: #{16rpx};
  }

  .mr-16 {
    margin-right: #{16rpx};
  }

  .delivery-mobile {
    width: #{96rpx};
    border-left: #{1rpx} solid #e2e2e2;

    .mobile {
      width: #{40rpx};
      height: #{40rpx};
      display: block;
      margin-right: #{16rpx};
    }
  }

  .content {
    width: #{500rpx};
  }
}

.order-info-box {
  background: #fff;
  padding: 32#{rpx} 24#{rpx};
  margin-bottom: 20#{rpx};
}

.store-info-box {
  background: #fff;
  padding: 32#{rpx} 24#{rpx};
  margin-bottom: 20#{rpx};
}

.preferential-box {
  background: #fff;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid #e2e2e2;
}

.preferential-box .item {
  margin: 5#{rpx} 0;
}

.order-price-box {
  height: 100rpx;
  background: #fff;
  padding: 32rpx 24rpx;
}

.goods-box {
  background: #fff;
  padding: 32#{rpx} 24#{rpx};
  margin-bottom: 20#{rpx};

  &.composition {
    padding: 0;
    padding-bottom: #{8rpx};
    margin-bottom: 0;
    background-color: #f7f7f7;
  }

  .composition-item {
    margin-bottom: #{20rpx};
    background-color: #fff;

    .composition-open {
      text-align: center;
      background-color: #fff;
      height: #{84rpx};

      .composition-btn {
        display: inline-block;
        border: #{2rpx} solid #bbbbbb;
        font-size: #{24rpx};
        color: #999999;
        padding: 0 #{24rpx};
        margin: #{12rpx} 0 #{16rpx};
        height: #{56rpx};
        line-height: #{54rpx};
        border-radius: #{28rpx};

        image {
          width: #{22rpx};
          height: #{12rpx};
          margin-left: #{16rpx};
        }
      }
    }

    .goods-list {
      padding: 0 #{24rpx};
    }

    .composition-title {
      height: #{80rpx};
      line-height: #{80rpx};
      padding: 0 #{24rpx};
      font-size: #{28rpx};
      color: #353535;
      margin-bottom: #{24rpx};
      border-bottom: #{2rpx} solid #e2e2e2;

      .composition-type {
        color: #f39800;
      }
    }
  }
}

.goods-box .sale-server {
  margin-top: 20#{rpx};
}

.goods-box .sale-box {
  padding-bottom: 15#{rpx};
}

.goods-box .refund-status {
  margin-top: 15#{rpx};
  color: $uni-text-color;
}

.action-box {
  background: #fff;
  padding: 32#{rpx} 24#{rpx};

  .cancel-text {
    font-size: $uni-text-color;
  }

  .btn {
    border: 1#{rpx} solid #bbbbbb;
    border-radius: 30#{rpx};
    padding: 10#{rpx} 30#{rpx};
  }
}

.detail-btn {
  border: 1#{rpx} solid #bbbbbb;
  border-radius: 30#{rpx};
  padding: 10#{rpx} 30#{rpx};
}

.e-box {
  width: 100%;
  height: #{100rpx};
  padding: 0 #{24rpx};
  background: #ffffff;
  margin-bottom: #{20rpx};

  .img {
    width: 12#{rpx};
    height: 24#{rpx};
  }

  .express-name {
    margin-bottom: 15#{rpx};
  }

  .text {
    color: #353535;
    font-size: #{28rpx};
  }
}

.advance {
  width: #{702rpx};
  border-radius: #{16rpx};
  background-color: #f7f7f7;
  padding: #{32rpx 24rpx};

  .title {
    font-size: #{24rpx};
    color: #ff4544;
    margin-bottom: #{15rpx};
  }
}

.item-box {
  border: #{1rpx} solid #c2c2c2;
  padding: #{24rpx};
  border-radius: #{16rpx};
  width: #{702rpx};
}

.ecard {
  background-color: #ffffff;

  .item {
    padding: #{32upx 24upx 0 24upx};

    .text {
      font-size: #{23upx};
      line-height: 1.5;
      padding-left: #{15upx};
      word-break: break-all;
    }
  }

  .expand {
    height: #{70upx};
    margin-top: #{20upx};
    border-top: #{1upx} solid #e2e2e2;

    > image {
      width: #{20upx};
      height: #{12upx};
    }

    > text {
      font-size: #{23upx};
      color: #919191;
    }
  }
}

.instructions {
  width: #{12upx};
  height: #{22upx};
  margin-left: #{18upx};
}

.ecard-info {
  height: #{90upx};
  line-height: #{90upx};
  background-color: #ffffff;
  padding: #{0 22upx};
  margin-bottom: #{13upx};
}

.city-service {
  width: 100%;
  margin-bottom: 10#{rpx};

  .await-man {
    margin-left: #{12rpx};
    font-size: #{28rpx};
    color: #666666;
  }

  .info-box {
    margin-left: #{12rpx};

    .info-label {
      margin-bottom: #{10rpx};
      color: #999999;
      font-size: #{28rpx};
    }
  }

  .head {
    width: #{75rpx};
    height: #{75rpx};
  }

  .icon-box {
    padding: 0 #{30rpx};
    border-left: #{1rpx} solid #f7f7f7;

    .icon {
      width: #{45rpx};
      height: #{45rpx};
    }
  }
}
</style>
