<template>
  <view v-show="is_show_off" class="u-list">
    <!--分类-->
    <template v-if="showCat && catList.length > 1">
      <scroll-view
        scroll-x
        :style="{ backgroundColor: catBgColor }"
        :class="[theme, 'u-scroll-view', 'dir-left-nowrap']"
      >
        <text
          v-for="(item, index) in catList"
          :key="index"
          :class="[
            catStyle === 2 && activeCurrent === index
              ? 'u-active-current-round'
              : catStyle === 1 && activeCurrent === index
              ? 'u-active-current'
              : 'u-default-text',
            catStyle === 2 ? 'u-current-round' : '',
            'u-nav-item',
          ]"
          :style="
            catStyle === 2 && activeCurrent === index
              ? `background-color: ${tagColor ? tagColor : theme.background};color: ${catSelectedColor};`
              : catStyle === 1 && activeCurrent === index
              ? `color: ${catSelectedColor ? catSelectedColor : theme.color};border-color: ${
                  tagColor ? tagColor : theme.border
                }`
              : catStyle === 1
              ? `color: ${catUnselectedColor}`
              : `color: ${catUnselectedColor}`
          "
          @click="changeNav(index)"
        >
          {{ item.menuName }}
        </text>
      </scroll-view>
    </template>
    <!--商品列表-->
    <view :class="goodsListClass">
      <!--列表模式-->
      <template v-if="listStyle === -1 || (!listStyle && listStyle !== 0)">
        <block v-for="(goods, index) in goodsList" :key="index">
          <view
            :class="[goodsStyleObject, 'main-between', 'u-list-mode', 'dir-left-nowrap']"
            :style="{ borderRadius: `${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx` }"
            hover-class="goods-hover-class"
            @click.stop="router(goods)"
          >
            <view class="box-grow-0 u-left">
              <!-- 售罄 -->
              <view v-if="isShowStock(goods)" class="u-out-dialog">
                <image class="u-dialog-img" :src="sellOutPic"></image>
              </view>
              <!-- 角标 -->
              <image v-if="showGoodsTag == 1" :class="[tagLeftTop, 'u-goods-tag']" :src="goodsTagPicUrl"></image>
              <!-- 商品封面图 -->
              <app-image
                :border-radius="`${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx`"
                width="220rpx"
                height="220rpx"
                :img-src="goods.cover_pic"
                :mode="mode"
              ></app-image>
            </view>
            <view class="box-grow-1 u-right dir-top-nowrap main-between">
              <view
                v-if="(isDIY && showGoodsName) || isShowGoodsName"
                :class="[
                  (goods.vip_card_appoint && goods.vip_card_appoint.discount) ||
                  ((goods.level_show === 1 || goods.level_show === 2) && goods.is_negotiable !== 1)
                    ? 't-omit'
                    : 't-omit-two',
                  'box-grow-0',
                  'u-goods-name',
                ]"
              >
                {{ goods.name }}
              </view>
              <view class="box-grow-1 dir-left-nowrap cross-bottom">
                <view class="box-grow-1">
                  <view v-if="isShowMemPrice(goods)" class="u-price-margin">
                    <app-member-price :price="goods.level_price" :theme="theme"> </app-member-price>
                  </view>
                  <view v-if="isShowVip(goods)" class="u-price-margin">
                    <app-sup-vip
                      :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                      :discount="goods.vip_card_appoint.discount"
                    ></app-sup-vip>
                  </view>
                  <view
                    v-if="showGoodsPrice || isShowOriginalPrice(goods)"
                    :class="goods.is_sales === 1 ? 'dir-left-nowrap main-left cross-center' : 'dir-top-nowrap'"
                  >
                    <text v-if="showGoodsPrice" class="u-goods-price" :style="{ color: theme.color }">{{
                      goods.price_content
                    }}</text>
                    <text
                      v-if="isShowOriginalPrice(goods)"
                      :class="[goods.is_sales === 1 ? 'u-original-margin' : '', 'u-original-price']"
                      >{{ goods.original_price }}</text
                    >
                  </view>
                  <view v-if="goods.is_sales === 1 && goods.is_negotiable !== 1" class="u-goods-sales">{{
                    goods.sales
                  }}</view>
                </view>
                <template
                  v-if="
                    (isShowCart && goods.goods_stock !== 0 && goods.is_negotiable !== 1) ||
                    (isDIY && isShowBuyBtn(goods))
                  "
                >
                  <view
                    v-if="buyBtn === 'text'"
                    :style="goods.buy_goods_auth ? btnStyle : disabledBtn"
                    :class="[buyBtnClass, 'u-text-btn']"
                    @click.stop="buyProduct(goods)"
                    >{{ buyBtnText }}</view
                  >
                  <view
                    v-else
                    :style="{ 'background-color': goods.buy_goods_auth ? theme.background : '#999999' }"
                    :class="['u-cart-btn-icon', 'box-grow-0', 'u-cart-btn-icon-' + buyBtn]"
                    @click.stop="buyProduct(goods)"
                  >
                  </view>
                </template>
              </view>
            </view>
          </view>
        </block>
      </template>
      <!--左右滑动-->
      <template v-else-if="listStyle === 0">
        <scroll-view scroll-x class="u-swipe-left-right box-grow-0">
          <view id="swipe-left-right" class="dir-left-nowrap">
            <block v-for="(goods, index) in goodsList" :key="index">
              <view
                :class="goodsStyleObject"
                hover-class="goods-hover-class"
                :style="{ borderRadius: `${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx` }"
                class="u-goods"
                @click.stop="router(goods)"
              >
                <view class="u-top">
                  <!-- 售罄 -->
                  <view v-if="isShowStock(goods)" class="u-out-dialog">
                    <image class="u-dialog-img" :src="sellOutPic"></image>
                  </view>
                  <!-- 角标 -->
                  <image v-if="showGoodsTag == 1" :class="[tagLeftTop, 'u-goods-tag']" :src="goodsTagPicUrl"></image>
                  <!-- 商品封面图 -->
                  <app-image
                    :border-radius="`${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx`"
                    width="200rpx"
                    height="200rpx"
                    :img-src="goods.cover_pic"
                    :mode="mode"
                  ></app-image>
                </view>
                <view class="u-content-height dir-top-nowrap main-between">
                  <view v-if="showGoodsName" :class="[textAlign, 'u-goods-name', 't-omit-two']">
                    {{ goods.name }}
                  </view>
                  <view class="u-bottom">
                    <view v-if="isShowMemPrice(goods)" :class="[pluginAlign, 'u-member-margin']">
                      <app-member-price :theme="theme" :price="goods.level_price"> </app-member-price>
                    </view>
                    <view v-if="isShowVip(goods)" :class="[pluginAlign, 'u-member-margin']">
                      <app-sup-vip
                        :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                        :discount="goods.vip_card_appoint.discount"
                      ></app-sup-vip>
                    </view>
                    <view v-if="showGoodsPrice || isShowOriginalPrice(goods)" :class="[textAlign, 'dir-top-nowrap']">
                      <text v-if="showGoodsPrice" class="u-goods-price" :style="{ color: theme.color }">{{
                        goods.price_content
                      }}</text>
                      <text v-if="isShowOriginalPrice(goods)" class="u-original-price">{{ goods.original_price }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </scroll-view>
      </template>
      <!--一行一个-->
      <template v-else-if="listStyle === 1">
        <block v-for="(goods, index) in goodsList" :key="index">
          <view
            hover-class="goods-hover-class"
            :class="goodsStyleObject"
            :style="{ borderRadius: `${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx` }"
            class="u-one-per-line"
            @click.stop="router(goods)"
          >
            <view class="u-top">
              <!-- 售罄 -->
              <view v-if="isShowStock(goods)" class="u-out-dialog">
                <image class="u-dialog-img" :src="sellOutPic"></image>
              </view>
              <!-- 角标 -->
              <image v-if="showGoodsTag == 1" :class="[tagLeftTop, 'u-goods-tag']" :src="goodsTagPicUrl"></image>
              <!-- 商品封面图 -->
              <app-image
                width="100%"
                :img-src="goods.cover_pic"
                :height="coverPicHeight"
                :mode="mode"
                :border-radius="`${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx`"
              ></app-image>
            </view>
            <view v-if="showGoodsName" :class="[textAlign, 'u-goods-name', 't-omit-two']">
              {{ goods.name }}
            </view>
            <view class="u-bottom dir-left-nowrap cross-center">
              <view :style="{ color: theme.color }" class="box-grow-1 u-price">
                <view :class="[textStyle === 2 ? 'main-center' : '', 'dir-left-nowrap', 'cross-center']">
                  <view v-if="showGoodsPrice" class="u-goods-price">
                    {{ goods.price_content }}
                  </view>
                  <view v-if="isShowMemPrice(goods)" class="u-member-margin">
                    <app-member-price :theme="theme" :price="goods.level_price"> </app-member-price>
                  </view>
                  <view v-if="isShowVip(goods)" class="u-member-margin">
                    <app-sup-vip
                      :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                      :discount="goods.vip_card_appoint.discount"
                    ></app-sup-vip>
                  </view>
                </view>
                <view v-if="isShowOriginalPrice(goods)" :class="[textAlign, 'u-original-price']">
                  ￥{{ goods.original_price }}
                </view>
              </view>
              <template v-if="isShowBuyBtn(goods) === 1 && textStyle !== 2">
                <view
                  v-if="buyBtn === 'text'"
                  :class="[buyBtnClass, 'u-text-btn', 'box-grow-0']"
                  :style="goods.buy_goods_auth ? btnStyle : disabledBtn"
                  @click.stop="buyProduct(goods)"
                  >{{ buyBtnText }}</view
                >
                <view
                  v-else
                  :style="{ 'background-color': goods.buy_goods_auth ? theme.background : '#999999' }"
                  :class="['u-cart-btn-icon', 'box-grow-0', 'u-cart-btn-icon-' + buyBtn]"
                  @click.stop="buyProduct(goods)"
                >
                </view>
              </template>
            </view>
          </view>
        </block>
      </template>
      <!--一行两个-->
      <template v-else-if="listStyle === 2">
        <block v-for="(goods, index) in goodsList" :key="index">
          <view
            hover-class="goods-hover-class"
            :class="[goodsStyleObject, 'u-one-line-two', 'dir-top-nowrap']"
            :style="[styleBox]"
            @click.stop="router(goods)"
          >
            <view class="u-top box-grow-0" :style="{ width: goodsStyle === 2 ? '344rpx' : '346rpx' }">
              <!-- 售罄 -->
              <view v-if="isShowStock(goods)" :class="goodsStyle !== 2 ? 'u-out-dialog' : 'u-border-out-dialog'">
                <image :class="goodsStyle !== 2 ? 'u-dialog-img' : 'u-border-dialog-img'" :src="sellOutPic"></image>
              </view>
              <!-- 角标 -->
              <image v-if="showGoodsTag == 1" :class="[tagLeftTop, 'u-goods-tag']" :src="goodsTagPicUrl"></image>
              <!-- 商品封面图 -->
              <app-image
                :border-radius="`${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx`"
                :width="goodsStyle === 2 ? '342rpx' : '346rpx'"
                height="346rpx"
                :img-src="goods.cover_pic"
                :mode="mode"
              ></app-image>
            </view>
            <view :class="['u-bottom', 'box-grow-1', 'dir-top-nowrap', showGoodsName ? 'main-between' : 'main-right']">
              <view
                v-if="(isDIY && showGoodsName) || isShowGoodsName"
                :class="[textAlign, 'u-goods-name', 't-omit-two']"
              >
                {{ goods.name }}
              </view>
              <view class="box-grow-0 u-price dir-left-nowrap cross-bottom main-between">
                <view class="box-grow-1">
                  <view v-if="goods.sign == 'pick' && activity" class="u-margin dir-left-nowrap cross-bottom">
                    <text :style="{ 'background-color': theme.background }" class="u-des-price">
                      {{ activity.rule_price }}元任选{{ activity.rule_num }}件
                    </text>
                  </view>
                  <view v-if="goods.sign === 'advance'" class="u-margin dir-left-nowrap cross-bottom">
                    <text :style="{ 'background-color': theme.background }" class="u-des-price">
                      定金￥{{ goods.deposit }}抵￥{{ goods.swell_deposit }}
                    </text>
                  </view>
                  <view v-if="goods.sign === 'flash_sale'" class="u-margin dir-left-nowrap cross-bottom">
                    <text
                      v-if="goods.discount_type === 1"
                      :style="{ 'background-color': theme.background }"
                      class="u-des-price"
                      >{{ goods.min_discount }}折
                    </text>
                    <text
                      v-if="goods.discount_type === 2"
                      :style="{ 'background-color': theme.background }"
                      class="u-des-price"
                      >减{{ goods.min_discount }}元
                    </text>
                  </view>
                  <view v-if="isShowMemPrice(goods)" :class="[pluginAlign, 'u-price-margin']">
                    <app-member-price :theme="theme" :price="goods.level_price"> </app-member-price>
                  </view>
                  <view v-if="isShowVip(goods)" :class="[pluginAlign, 'u-price-margin']">
                    <app-sup-vip
                      :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                      :discount="goods.vip_card_appoint.discount"
                    ></app-sup-vip>
                  </view>
                  <view
                    v-if="showGoodsPrice || isShowOriginalPrice(goods)"
                    :class="[
                      goods.is_sales === 1 ? 'dir-left-nowrap main-left cross-center' : 'dir-top-nowrap',
                      'u-price-margin',
                      goods.is_sales === 1 ? pluginAlign : null,
                    ]"
                  >
                    <text v-if="showGoodsPrice" :style="{ color: theme.color }" :class="['u-goods-price', textAlign]">
                      {{ goods.price_content }}
                    </text>
                    <text
                      v-if="isShowOriginalPrice(goods)"
                      :class="[
                        goods.is_sales === 1 ? 'u-original-margin' : '',
                        't-omit',
                        'u-original-price',
                        textAlign,
                      ]"
                    >
                      ￥{{ goods.original_price }}
                    </text>
                  </view>
                  <view
                    v-if="goods.is_sales === 1 && goods.is_negotiable !== 1"
                    :class="[textAlign, 'u-goods-sales', !showGoodsPrice ? 'u-price-margin' : '']"
                  >
                    {{ goods.sales }}</view
                  >
                </view>
                <template
                  v-if="
                    (isShowCart && goods.goods_stock !== 0 && goods.is_negotiable !== 1) ||
                    (isDIY && isShowBuyBtn(goods) === 1 && textStyle !== 2)
                  "
                >
                  <view
                    v-if="buyBtn === 'text'"
                    :class="[buyBtnClass, 'u-text-btn', 'box-grow-0']"
                    :style="goods.buy_goods_auth ? btnStyle : disabledBtn"
                    @click.stop="buyProduct(goods)"
                    >{{ buyBtnText }}</view
                  >
                  <view
                    v-else
                    :style="{ 'background-color': goods.buy_goods_auth ? theme.background : '#999999' }"
                    :class="['u-cart-btn-icon', 'box-grow-0', 'u-cart-btn-icon-' + buyBtn]"
                    @click.stop="buyProduct(goods)"
                  ></view>
                </template>
              </view>
            </view>
          </view>
        </block>
      </template>
      <!--一行三个-->
      <template v-else-if="listStyle === 3">
        <block v-for="(goods, index) in goodsList" :key="index">
          <view
            hover-class="goods-hover-class"
            :style="{ borderRadius: `${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx` }"
            :class="[goodsStyleObject, 'u-one-line-three', 'dir-top-nowrap', 'box-grow-0']"
            @click.stop="router(goods)"
          >
            <view class="u-top box-grow-0">
              <!-- 售罄 -->
              <view v-if="isShowStock(goods)" class="u-out-dialog">
                <image class="u-dialog-img" :src="sellOutPic"></image>
              </view>
              <!-- 角标 -->
              <image v-if="showGoodsTag == 1" :class="[tagLeftTop, 'u-goods-tag']" :src="goodsTagPicUrl"></image>
              <!-- 商品封面图 -->
              <app-image
                :border-radius="`${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx`"
                :width="goodsStyle === 2 ? '222rpx' : '224rpx'"
                height="224rpx"
                :img-src="goods.cover_pic"
                :mode="mode"
              ></app-image>
            </view>
            <view class="u-bottom box-grow-1 dir-top-nowrap main-between">
              <view
                v-if="(isDIY && showGoodsName) || isShowGoodsName"
                :class="[textAlign, 'box-grow-0', 'u-goods-name', 't-omit-two']"
              >
                {{ goods.name }}
              </view>
              <view class="box-grow-1 dir-top-nowrap main-right">
                <view v-if="isShowMemPrice(goods)" :class="[pluginAlign, 'u-price-margin']">
                  <app-member-price :theme="theme" :price="goods.level_price"> </app-member-price>
                </view>
                <view v-if="isShowVip(goods)" :class="[pluginAlign, 'u-price-margin']">
                  <app-sup-vip
                    :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                    :discount="goods.vip_card_appoint.discount"
                  ></app-sup-vip>
                </view>
                <view
                  class="box-grow-0 u-price-margin dir-left-nowrap cross-center"
                  :class="[
                    !showGoodsPrice && textStyle !== 2 ? 'main-right' : 'main-between',
                    textStyle === 2 ? 'main-center' : '',
                  ]"
                >
                  <view
                    v-if="showGoodsPrice || isShowOriginalPrice(goods)"
                    :style="{ color: theme.color }"
                    class="u-goods-price"
                  >
                    <view v-if="showGoodsPrice" :class="textAlign">{{ goods.price_content }} </view>
                    <view v-if="isShowOriginalPrice(goods)" :class="[textAlign, 'u-original-price']"
                      >￥{{ goods.original_price }}
                    </view>
                    <view
                      v-if="!isDIY && goods.is_sales === 1 && goods.is_negotiable !== 1"
                      :class="['u-goods-sales']"
                      >{{ goods.sales }}</view
                    >
                  </view>
                  <view
                    v-if="
                      (isShowCart && goods.goods_stock !== 0 && goods.is_negotiable !== 1) ||
                      (isDIY && isShowBuyBtn(goods) && textStyle !== 2)
                    "
                    :style="{ 'background-color': goods.buy_goods_auth ? theme.background : '#999999' }"
                    :class="['u-cart-btn-icon', 'box-grow-0', 'u-cart-btn-icon-' + buyBtn]"
                    @click.stop="buyProduct(goods)"
                  >
                  </view>
                  <view
                    v-if="isDIY && isShowBuyBtn(goods) === 0 && textStyle !== 2 && showBuyBtn"
                    class="u-cart-btn-icon"
                  ></view>
                </view>
              </view>
            </view>
          </view>
        </block>
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs, watch } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { store } from '@/store'
import { isEmpty } from '@/utils/util'

export default defineComponent({
  name: 'UGoodsList',
  components: {},
  props: {
    // 活动信息
    activity: {
      type: Object,
      default: () => {},
    },
    // 是否为DIY
    isDIY: {
      type: Boolean,
      default: false,
    },
    // 是否显示分类
    showCat: {
      type: Boolean,
      default: () => false,
    },
    // 分类列表
    catList: {
      type: Array,
      default: () => [],
    },
    // 分类样式
    catStyle: {
      type: Number,
      default: () => 1,
    },
    // 主题色
    theme: {
      type: Object,
      default: () => {},
    },
    // 商品列表
    list: {
      type: Array,
      default: () => [],
    },
    // 列表样式 -1 列表模式 0 左右滑动 1 一行一个 2 一行两个 3 一行三个
    listStyle: {
      type: [Number, Boolean],
      default: () => 2,
    },
    // 列表模式显示分割线 1 显示 0 不显示
    borderShow: {
      type: Number,
      default: () => 1,
    },
    // 商品样式 1 白底无边框 2 白底有边框 3 无底无边框
    goodsStyle: {
      type: Number,
      default: () => 1,
    },
    // 商品封面图是否填充 0 留白 1 填充
    fill: {
      type: Number,
      default: 1,
    },
    // 商品右上角角标 url
    goodsTagPicUrl: {
      type: String,
      default: () => '',
    },
    // 是否展示角标 0 不展示 1 展示
    showGoodsTag: {
      type: Number,
      default: () => 1,
    },
    // 是否展示商品名称 0 不展示 1 展示
    showGoodsName: {
      type: [Number, Boolean],
      default: 1,
    },
    // 是否展示商品价格 0 不展示 1 展示
    showGoodsPrice: {
      type: [Number, Boolean],
      default: 1,
    },
    // 显示购买按钮 0 不展示 1 展示
    showBuyBtn: {
      type: [Number, Boolean],
      default: 1,
    },
    // 购买按钮样式 cart 购物车 add 加号 text 文字
    buyBtn: {
      type: String,
      default: 'cart',
    },
    // 按钮样式
    buyBtnStyle: {
      type: Number,
      default: () => 0,
    },
    // 按钮文案
    buyBtnText: {
      type: String,
      default: () => '',
    },
    // text按钮颜色
    buttonColor: {
      type: String,
      default: () => '',
    },
    // 文本对齐方式 1 左对齐 2 居中
    textStyle: {
      type: Number,
      default: () => 1,
    },
    // 商品封面图宽高比例 1-1 3-2
    goodsCoverProportion: {
      type: String,
      default: () => '',
    },
    // 原价显示
    isUnderLinePrice: {
      type: Boolean,
      default: true,
    },
    // 是否显示规格
    isShowAttr: {
      type: Boolean,
      default: false,
    },
    isBuy: {
      type: Boolean,
      default: true,
    },
    // 预览接口
    previewUrl: {
      type: String,
      default: () => '',
    },
    // 支付接口
    submitUrl: {
      type: String,
      default: () => '',
    },
    // 载入间隔
    addTime: {
      type: Number,
      default: 0,
    },
    // 分页加载
    pagination: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    //标签颜色
    tagColor: {
      type: String,
      default: () => '',
    },
    //选中颜色
    catSelectedColor: {
      type: String,
      default: () => '',
    },
    //未选中颜色
    catUnselectedColor: {
      type: String,
      default: () => '',
    },
    //背景色
    catBgColor: {
      type: String,
      default: () => '',
    },
    // 圆角值
    borderRadius: {
      type: [Number, String],
      default: () => 0,
    },
    cBorderTop: {
      type: String,
      default: () => {
        return `30`
      },
    },
    cBorderBottom: {
      type: String,
      default: () => {
        return `30`
      },
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      // 当前选中分类
      activeCurrent: 0,
      // 是否展示
      is_show_off: true,
      // 规格商品
      attrGoods: {
        goods: {},
        attrShow: 0,
      },
      // 临时列表
      tempList: [],
      // 商品数组
      goodsList: [],
      disabledColor: '#999999',
      disable: 'disable',
    })
    // 全局设置
    const appSetting = store.state.mallConfig.mall.setting
    // 小程序图片
    const appImg = store.state.mallConfig.__wxapp_img.mall

    const calcStyle = computed(() => {
      let t = 16,
        o = props.cPaddingLr,
        i = props.goodsStyle,
        e = props.listStyle
      return (
        (t *= e - 1),
        {
          width: (750 - (void 0 !== o ? 2 * Number(o) : 0) - t - (2 === i ? 2 * e : 0)) / e + 'rpx',
        }
      )
    })

    const styleBox = computed(() => {
      props.bg
      var t = props.cBorderTop,
        o = props.cBorderBottom
      return {
        borderTopLeftRadius: ''.concat(t, 'rpx'),
        borderTopRightRadius: ''.concat(t, 'rpx'),
        borderBottomLeftRadius: ''.concat(o, 'rpx'),
        borderBottomRightRadius: ''.concat(o, 'rpx'),
        background: '#FFFFFF',
      }
    })
    // 全局显示购物车
    const isShowCart = computed(
      () => !props.isDIY && store.state.mallConfig.mall.setting.is_show_cart && props.showBuyBtn
    )
    // 全局显示商品名称
    const isShowGoodsName = computed(() => !props.isDIY && store.state.mallConfig.mall.setting.is_show_goods_name)
    const platform = computed(() => store.state.gConfig.systemInfo.platform)
    const getVideo = computed(() => store.state.mallConfig.mall.setting.is_goods_video)
    // 获取商品数组
    const copyList = computed(() => {
      if (!state.is_show_off) return []
      if (props.showCat) {
        return props.catList[state.activeCurrent].goodsList
      } else {
        return props.list
      }
    })
    // 商品样式
    const goodsStyleObject = computed(() => {
      let str = ''
      props.goodsStyle === 2 ? (str += 'u-is-border ') : ''
      props.goodsStyle !== 3 ? (str += 'u-white-back') : ''
      return str
    })
    // 商品封面图是否填充
    const mode = computed(() => {
      let str = ''
      props.fill === 1 ? (str = 'aspectFill') : (str = 'aspectFit')
      return str
    })
    // 售罄图片
    const sellOutPic = computed(() => {
      return appSetting.is_use_stock === '1' ? appImg.plugins_out : appSetting.sell_out_pic
    })
    // 角标弧度
    const tagLeftTop = computed(() => {
      return props.listStyle === -1 || props.listStyle === 0 || props.listStyle === 2 || props.listStyle === 3
        ? 'u-goods-tag-radius'
        : ''
    })
    // 文字按钮样式
    const buyBtnClass = computed(() => {
      let buyBtnClass = ``
      if (props.buyBtnStyle == 2 || props.buyBtnStyle == 4) {
        buyBtnClass += `u-text-btn-border `
      }
      if (props.buyBtnStyle == 4 || props.buyBtnStyle == 3) {
        buyBtnClass += `u-text-btn-radius`
      }
      return buyBtnClass
    })
    // 按钮样式
    const btnStyle = computed(() => {
      let btnStyle = ``
      if (props.buyBtnStyle == 1 || props.buyBtnStyle == 3) {
        btnStyle += `background-color: ${
          props.buttonColor ? props.buttonColor : props.theme.background
        };color: #ffffff;`
      } else {
        btnStyle += `border-color: ${props.buttonColor ? props.buttonColor : props.theme.background};color: ${
          props.buttonColor
        };`
      }
      return btnStyle
    })
    const disabledBtn = computed(() => {
      let btnStyle = ``
      if (props.buyBtnStyle == 1 || props.buyBtnStyle == 3) {
        btnStyle += `background-color: ${state.disabledColor};color: #ffffff;`
      } else {
        btnStyle += `border-color: ${state.disabledColor};color: ${state.disabledColor};`
      }
      return btnStyle
    })
    // 文本对齐方式
    const textAlign = computed(() => {
      return props.textStyle === 2 ? 'u-text-align' : null
    })
    // 插件对齐方式
    const pluginAlign = computed(() => {
      return props.textStyle === 2 ? 'dir-left-nowrap main-center' : null
    })
    // 一行一个图片高度
    const coverPicHeight = computed(() => {
      return props.goodsCoverProportion === '1-1' ? '702rpx' : '468rpx'
    })
    // 商品列表样式
    const goodsListClass = computed(() => {
      if (props.listStyle === 2) {
        return 'dir-left-wrap main-between u-goods-list'
      } else if (props.listStyle === 3) {
        return 'dir-left-wrap main-left u-one-line-three-list'
      } else if (props.listStyle === 0) {
        return 'u-swipe-left-right-list'
      } else if (props.borderShow === 1) {
        return 'u-goods-list u-bottom-border'
      } else {
        return 'u-goods-list'
      }
    })

    // 复制而不是引用对象和数组
    const cloneData = (data) => {
      return JSON.parse(JSON.stringify(data))
    }
    // 循环载入
    const splitData = () => {
      if (!state.tempList.length) return
      let item = state.tempList[0]
      state.goodsList.push(item)
      state.tempList.splice(0, 1)
      if (state.tempList.length) {
        setTimeout(() => {
          splitData()
        }, props.addTime)
      }
    }
    // 切换分类
    const changeNav = (index) => {
      state.goodsList = []
      state.activeCurrent = index
      state.tempList = cloneData(copyList.value)
      splitData()
    }
    // 是否展示售罄
    const isShowStock = (goods) => {
      return appSetting.is_show_stock === 1 && goods.goods_stock === 0 ? 1 : 0
    }
    // 是否展示购物按钮
    const isShowBuyBtn = (goods) => {
      return props.showBuyBtn && goods.goods_stock !== 0 && goods.is_negotiable !== 1 ? 1 : 0
    }
    // 是否展示会员价
    const isShowMemPrice = (goods) => {
      return (goods.level_show === 1 || goods.level_show === 2) && goods.is_negotiable !== 1 ? 1 : 0
    }
    // 是否展示超级会员价
    const isShowVip = (goods) => {
      return goods.vip_card_appoint && goods.vip_card_appoint.discount && goods.is_negotiable !== 1 ? 1 : 0
    }
    // 是否显示原价
    const isShowOriginalPrice = (goods) => {
      return props.isUnderLinePrice && goods.is_negotiable !== 1 ? 1 : 0
    }
    // 购买按钮点击事件
    const buyProduct = (goods) => {
      if (props.isBuy) {
        if (props.isShowAttr) {
          state.attrGoods.goods = goods
          state.attrGoods.attrShow = Math.random()
        } else {
          uni.showLoading({
            text: '',
            mask: true,
          })
          this.$request({
            url: this.$api.goods.attr,
            data: {
              id: goods.id,
              mch_id: goods.mch_id,
            },
          }).then((e) => {
            uni.hideLoading()
            if (e.code === 0) {
              let data = Object.assign(goods, e.data)
              emit('buyProduct', {
                goods: data,
                attrShow: Math.random(),
              })
            } else {
              uni.showToast({
                title: e.msg,
                icon: 'none',
              })
            }
          })
        }
      } else {
        router(goods)
      }
    }
    // 路由跳转
    const router = (goods) => {
      // #ifdef MP-BAIDU
      uni.navigateTo({
        url: goods.page_url,
      })
      // #endif
      // #ifndef MP-BAIDU
      if (
        goods.video_url &&
        getVideo.value == 1 &&
        !(goods.sign === 'lottery' || goods.sign === 'bargain' || goods.sign === 'wholesale')
      ) {
        let id = goods.id
        if (goods.sign === 'advance') {
          id = goods.id ? goods.id : goods.goods_id
        } else if (goods.sign === 'gift') {
          id = id + '&is_share=1'
        }
        // #ifdef MP
        uni.navigateTo({
          url: `/pages/goods/video?goods_id=${id}&sign=${goods.sign}`,
        })
        // #endif
        // #ifdef H5
        uni.navigateTo({
          url: goods.page_url,
        })
        // #endif
      } else {
        uni.navigateTo({
          url: goods.page_url,
        })
      }
      // #endif
    }
    const empty = () => {
      state.goodsList = []
    }

    watch(
      () => props.catList,
      (newVal, prevState) => {
        if (!props.showCat) return
        !Array.isArray(newVal) || isEmpty(newVal) ? (state.is_show_off = false) : (state.is_show_off = true)
      },
      {
        immediate: true,
        deep: true,
      }
    )

    watch(
      () => copyList.value,
      (nVal, oVal) => {
        if (nVal) {
          if (props.pagination && !props.reset) {
            let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0
            state.tempList = state.tempList.concat(cloneData(nVal.slice(startIndex)))
          } else {
            state.goodsList = []
            state.tempList = cloneData(nVal)
          }
          splitData()
        }
        state.tempList && splitData()
      },
      {
        immediate: true,
        deep: true,
      }
    )

    return {
      ...toRefs(state),
      appSetting,
      calcStyle,
      styleBox,
      appImg,
      isShowCart,
      isShowGoodsName,
      platform,
      getVideo,
      copyList,
      goodsStyleObject,
      mode,
      tagLeftTop,
      buyBtnClass,
      btnStyle,
      disabledBtn,
      textAlign,
      pluginAlign,
      coverPicHeight,
      goodsListClass,
      changeNav,
      router,
      isShowStock,
      isShowMemPrice,
      isShowVip,
      isShowOriginalPrice,
      isShowBuyBtn,
      buyProduct,
    }
  },
})
</script>

<style scoped lang="scss">
.u-des-price {
  display: inline-block;
  font-size: 19upx;
  color: #ffffff;
  border-radius: 7upx;
  padding: 0upx 5upx;
}

.u-list {
  overflow: hidden;
}

.u-scroll-view {
  white-space: nowrap;
  width: 750upx;
  height: 99upx;
  padding: 0 5upx;

  .u-current-round {
    height: 56upx;
    padding-left: 24upx;
    padding-right: 24upx;
    border-radius: 30upx;
    line-height: 56upx;
    margin: 21.5upx 24upx;
  }
}

.u-nav-item {
  display: inline-block;
  height: 97upx;
  line-height: 97upx;
  font-size: 26upx;
  margin: 0 44upx;
  white-space: nowrap;
  border-bottom: 1upx solid transparent;
}

.u-active-current-round {
  color: white;
}

.u-default-text {
  color: #666666;
}

.u-goods-list {
  // padding: 24upx 24upx 0 24upx;
  &.u-bottom-border {
    padding: 0;
    padding-top: 24upx;

    > .u-list-mode {
      padding: 16upx 24upx;
      margin-bottom: 0;
      border-radius: 0;
      border-bottom: 1upx solid #e2e2e2;

      &:last-of-type {
        border-bottom: 0;
      }
    }
  }
}

.u-swipe-left-right-list {
  // #ifdef MP-BAIDU
  width: 750upx;
  height: 424upx;
  // #endif
  // padding: 24upx 0 0 24upx;
}

.u-is-border {
  border: 1upx solid #e2e2e2;
}

.u-white-back {
  background-color: #ffffff;
}

%background-image {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.u-text-btn {
  height: 48upx;
  line-height: 48upx;
  padding: 0 20upx;
  font-size: 28upx;
}

.u-text-btn-radius {
  border-radius: 24upx;
}

.u-text-btn-border {
  border: 1upx solid;
}

.u-out-dialog {
  position: absolute;
  height: 100%;
  z-index: 11;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.u-border-out-dialog {
  position: absolute;
  height: 100%;
  z-index: 11;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.u-text-align {
  text-align: center;
}

.u-goods-tag {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 64upx;
  height: 64upx;
}

.u-goods-tag-radius {
  border-top-left-radius: 16upx;
}

.u-original-price {
  color: #999999;
  font-size: 22upx;
  text-decoration: line-through;
}

.u-goods-sales {
  color: #b5b5b5;
  font-size: 24upx;
}

.u-cart-btn-icon {
  width: 50upx;
  height: 50upx;
  @extend %background-image;
}

.u-cart-btn-icon-cart {
  background-image: url('../../../static/image/icon/cats.png');
}

.u-cart-btn-icon-add {
  background-image: url('../../../static/image/icon/add-to.png');
}

.u-goods-name {
  color: #353535;
}

.u-original-margin {
  margin-left: 10upx;
}

.u-price-margin {
  margin-top: 5upx;
}

.u-list-mode {
  margin-bottom: 32upx;
  border-radius: 16upx;
  &:last-child {
    margin-bottom: 0;
  }
  .u-right {
    height: 220upx;
    padding: 28upx 24upx 15upx 20upx;
  }

  .u-left {
    position: relative;
  }

  .u-out-dialog {
    width: 220upx;
    border-radius: 16upx;
  }

  .u-dialog-img {
    border-radius: 16upx;
    width: 220upx;
    height: 220upx;
  }

  .u-goods-name {
    font-size: 28upx;
    line-height: 38upx;
  }

  .u-goods-price {
    font-size: 30upx;
  }
}

.u-swipe-left-right {
  // #ifdef MP-BAIDU
  height: 424upx;
  // #endif
  // padding-bottom: 24upx;
  white-space: nowrap;

  .u-goods {
    display: inline-block;
    border-radius: 16upx;
    padding-bottom: 16upx;
    margin-right: 16upx;
  }

  .u-top {
    position: relative;
    margin-bottom: 8upx;
  }

  .u-out-dialog {
    width: 200upx;
    border-radius: 16upx 16upx 0 0;
    overflow: hidden;
  }

  .u-dialog-img {
    width: 200upx;
    height: 200upx;
  }

  .u-bottom {
    padding: 0 10upx;
  }

  .u-goods-name {
    font-size: 23upx;
    line-height: 33upx;
    margin-bottom: 8upx;
    padding: 0 10upx 0 10upx;
  }

  .u-goods-price {
    font-size: 23upx;
  }

  .u-member-margin {
    margin-bottom: 8upx;
  }

  .u-content-height {
    width: 200upx;
    height: calc(100% - 208upx);
  }
}

.u-one-per-line {
  margin-bottom: 24upx;
  border-radius: 16upx;
  overflow: hidden;

  .u-top {
    position: relative;
    width: 100%;
  }

  .u-out-dialog {
    width: 100%;
  }

  .u-dialog-img {
    width: 100%;
    height: 100%;
  }

  .u-bottom {
    padding: 0 24upx 21upx 24upx;
    margin-top: 16upx;
  }

  .u-goods-name {
    padding: 30upx 24upx 0 24upx;
    font-size: 28upx;
    line-height: 38upx;
  }

  .u-goods-price {
    font-size: 28upx;
  }

  .u-member-margin {
    margin-left: 10upx;
  }
}

.u-one-line-two {
  width: 346upx;
  margin-bottom: 25upx;
  border-radius: 16upx;

  .u-top {
    width: 346upx;
    height: 346upx;
    position: relative;
  }

  .u-out-dialog,
  .u-dialog-img {
    width: 346upx;
    height: 346upx;
    border-radius: 16upx 16upx 0 0;
  }

  .u-border-out-dialog,
  .u-border-dialog-img {
    width: 344upx;
    height: 346upx;
    border-radius: 16upx 16upx 0 0;
  }

  .u-bottom {
    padding-bottom: 15upx;
  }

  .u-goods-name {
    margin-top: 20upx;
    font-size: 28upx;
    padding: 0 24upx;
    line-height: 38upx;
  }

  .u-price {
    padding: 0 24upx;
  }

  .u-goods-price {
    font-size: 28upx;
  }
}

.u-one-line-three-list {
  // padding: 24upx 9upx 0 24upx;
}

.u-one-line-three {
  width: 224upx;
  margin: 0 15upx 16upx 0;
  border-radius: 16upx;
  overflow: hidden;
  &:nth-child(3n) {
    margin: 0px 0rpx 16rpx 0;
  }
  .u-top {
    position: relative;
  }

  .u-top,
  .u-out-dialog,
  .u-dialog-img {
    width: 224upx;
    height: 224upx;
    border-right: 16upx 16upx 0 0;
  }

  .u-goods-name {
    font-size: 26upx;
    margin-top: 10upx;
    line-height: 36upx;
  }

  .u-bottom {
    padding: 0 10upx 15upx 10upx;
  }

  .u-goods-price {
    font-size: 25upx;
  }

  .u-cart-btn-icon {
    width: 45upx;
    height: 45upx;
  }

  .u-goods-sales {
    font-size: 22upx;
  }
}

// #ifdef MP-BAIDU
#swipe-left-right {
  width: 750upx;
  height: 400upx;
}

// #endif
</style>
