<template>
  <view class="product-list-grid">
    <view v-if="goodsList.length" class="list">
      <view v-for="(item, index) in goodsList" :key="index" class="item" @click="goDetail(item)">
        <view class="pictrue">
          <image :src="item.thumb" mode="widthFix"></image>
        </view>
        <view class="text">
          <view class="name line1">{{ item.productName }}</view>
          <view v-if="is_level" class="app-member-price dir-left-nowrap cross-center">
            <view class="box-grow-0">
              <view class="member dir-left-nowrap cross-center main-center">会员价</view>
            </view>
            <view class="box-grow-1 price">
              <view class="money font-color">
                ￥<text class="num">{{ item.level_price }}</text>
              </view>
            </view>
          </view>
          <view class="vip acea-row row-between-wrapper">
            <view class="money font-color">
              ￥<text class="num">{{ item.marketPrice }}</text>
            </view>
            <view class="add-cart">
              <text class="iconfont icon-add-cart-fill"></text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="goodsList.length > 0" class="loadingicon acea-row row-center-wrapper">
      <text v-if="loading" class="iconfont icon-jiazai"></text>{{ loadTitle }}
    </view>
    <block v-if="!goodsList.length">
      <view class="empty-img">暂无数据</view>
    </block>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { fetchGoodsList } from '@/api/goods'
import { goodsType } from '@/types'
const props = defineProps({
  catId: { type: String, required: false },
  is_level: { type: Number, required: false },
})
const loading = ref(true)
const loadTitle = ref('加载更多')
const goodsList = ref<Array<goodsType>>([])
const page = ref(1)
const getNewGoodsList = () => {
  const params = {
    page: page.value,
    limit: 10,
    cat_id: props.catId,
    is_level: props.is_level,
  }
  fetchGoodsList(params)
    .then((r: any) => {
      console.log('rrr', r)
      if (r.length !== 0) {
        goodsList.value = goodsList.value.concat(r)
        page.value++
      } else {
        loading.value = false
        loadTitle.value = '已经到底了~'
      }
    })
    .catch((err) => console.log(err))
}

const goDetail = (item) => {
  uni.navigateTo({
    url: `/pages/goods/goodsDetail?productId=${item.id}&shopId=${item.shopId}`,
  })
}
onMounted(() => {
  getNewGoodsList()
})

onReachBottom(() => {
  getNewGoodsList()
})
</script>
<style lang="scss" scoped>
.product-list-grid {
  margin-top: 40rpx;
}

.product-list-grid .list {
  padding: 0 30rpx;
  column-count: 2;
  column-gap: 20rpx;
}

.product-list-grid .list .item {
  width: 335rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  //   border: 1rpx solid #eee;
  break-inside: avoid;
  box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
}

.product-list-grid .list .item .pictrue {
  position: relative;
  width: 100%;
  // height: 335rpx;
}

.product-list-grid .list .item .pictrue image {
  width: 100%;
  height: 100%;
  border-radius: 20rpx 20rpx 0 0;
}

.product-list-grid .list .item .text {
  padding: 20rpx 17rpx 26rpx 17rpx;
  font-size: 30rpx;
  color: #0a3121;
}

.product-list-grid .list .item .text .money {
  font-size: 26rpx;
  font-weight: bold;
  //   margin-top: 8rpx;
  color: #1aa86c;
}

.product-list-grid .list .item .text .money .num {
  font-size: 34rpx;
}

.product-list-grid .list .item .text .app-member-price .box-grow-0 .member {
  border: 1rpx solid #1aa86c;
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #1aa86c;
  margin-right: 10rpx;
}

.product-list-grid .list .item .text .vip {
  font-size: 22rpx;
  color: #aaa;
  //   margin-top: 7rpx;
}

.product-list-grid .list .item .text .vip .add-cart {
  //   margin-top: 10rpx;
}

.product-list-grid .list .item .text .vip .add-cart .iconfont {
  font-size: 50rpx;
  font-weight: bold;
  color: #1aa86c;
}

.empty-img {
  width: 690rpx;
  height: 300rpx;
  border-radius: 14rpx;
  margin: 0 auto;
  background-color: #f2f2f2;
  text-align: center;
  line-height: 300rpx;

  .iconfont {
    font-size: 50rpx;
  }
}
</style>
