<template>
  <view class="app-order-goods-info">
    <view class="dir-left-nowrap item-box" :style="{ 'margin-bottom': isLastOne ? '24rpx' : 0 }">
      <image class="img box-grow-0" mode="aspectFill" :src="goods.pic_url"></image>
      <view class="box-grow-1">
        <view class="goods-name" :style="{ '-webkit-line-clamp': type == 1 ? 2 : 1 }">{{ goods.name }}</view>
        <view class="attr" :style="{ '-webkit-line-clamp': type }"
          >规格：
          <text v-for="item in goods.attr_list" :key="item.id">{{ item.attr_name }}</text>
        </view>
        <view class="dir-left-nowrap">
          <view class="box-grow-1 goods-num">x{{ goods.num }}</view>
          <view v-if="plugin == 'composition'" class="box-grow-0">
            <view class="main-right price delete-price">￥{{ goods.total_price }}</view>
          </view>
          <view v-else class="box-grow-0 dir-left-nowrap">
            <view v-if="pluginData && pluginData.exchange_list && pluginData.exchange_list.length" class="price"
              >{{ pluginData.exchange_list[pluginIndex].value }}{{ pluginData.price_name }}+</view
            >
            <view class="main-right price"
              >￥{{ pluginData.price_list ? pluginData.price_list[pluginIndex].value : goods.total_price }}</view
            >
          </view>
        </view>
        <view v-if="plugin == 'composition'" class="composition-price">
          搭配套餐价<text>￥{{ goods.total_price }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
export default defineComponent({
  name: 'AppOrderGoodsInfo',
  props: {
    goods: {
      type: Object,
      default: () => {},
    },
    plugin: {
      type: String,
      default: '',
    },
    isLastOne: {
      type: Boolean,
      default: true,
    },
    pluginData: {
      type: Object,
      default: () => {},
    },
    pluginIndex: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
})
</script>
<style scoped lang="scss">
.app-order-goods-info {
  font-size: 24#{rpx};
  width: 100%;

  .img {
    width: 160#{rpx};
    height: 160#{rpx};
    margin-right: 20#{rpx};
    flex-shrink: 0;
  }

  .item-box {
    width: 100%;
    margin-bottom: 24#{rpx};
  }

  .label {
    color: $uni-general-color-two;
  }

  .price {
    color: $uni-important-color-black;

    &.delete-price {
      text-decoration: line-through;
    }
  }

  .composition-price {
    text-align: right;
    font-size: #{22rpx};
    color: #999999;

    text {
      font-size: #{28rpx};
      color: #353535;
      margin-left: #{8rpx};
    }
  }

  .goods-num {
    font-size: $uni-font-size-weak-one;
    color: $uni-general-color-two;
  }

  .attr {
    width: 450#{rpx};
    margin: 10#{rpx} 0;
    color: $uni-general-color-two;
    font-size: $uni-font-size-weak-one;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

    text {
      margin-right: 10#{rpx};
    }
  }

  .goods-name {
    color: $uni-important-color-black;
    font-size: $uni-font-size-general-two;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
