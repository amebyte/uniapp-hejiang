<template>
  <view class="list">
    <block v-for="(item, index) in newGoodsList" :key="index">
      <view class="item" @click="goDetail(item)">
        <view v-if="item.is_time" class="tag">限时特惠</view>
        <view class="content">
          <view class="image">
            <image :src="item.thumb" mode="scaleToFill"></image>
          </view>
          <view class="wrap">
            <view class="label-wrap">
              <view class="label">{{ item.catnames[0] }}</view>
              <view class="label r">{{ item.curriculum_type === 1 ? '线下课程' : '线上课程' }}</view>
            </view>
            <view class="title">{{ item.productName }}</view>
            <view class="row">
              <view class="label">授课老师：</view>
              <view class="content">{{ item.teacherNames }}</view>
            </view>
            <view class="row">
              <view class="label">开课时间：</view>
              <view class="content">{{ item.curriculum_start_time }}</view>
            </view>
          </view>
        </view>
        <view class="action">
          <view class="l"
            >已报名<text>{{ item.salesNum }}</text
            >人</view
          >
          <view class="r">
            <view class="btn">
              <view class="l">
                <text>¥{{ item.originalPrice }}</text>
                <text>¥{{ item.marketPrice }}</text>
              </view>
              <view class="r"> 马上抢购 </view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <block v-if="newGoodsList.length > 0">
      <LoadBar :txt="loadTitle" :loading="loading" />
    </block>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { fetchGoodsList } from '@/api/goods'
import { goodsType } from '@/types'
import LoadBar from '@/components/load-bar/load-bar.vue'

const loading = ref(true)
const loadTitle = ref('加载更多')
const page = ref(1)
const newGoodsList = ref<Array<goodsType>>([])
const getNewGoodsList = () => {
  const params = {
    page: page.value,
    limit: 10,
    cat_id: 5,
  }
  fetchGoodsList(params)
    .then((r: any) => {
      if (r.length !== 0) {
        newGoodsList.value = newGoodsList.value.concat(r)
        page.value++
      } else {
        loading.value = false
        loadTitle.value = '已经到底了~'
      }
    })
    .catch((err) => console.log('fetchGoodsList:', err))
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
.list {
  margin: 20rpx;
  margin-top: 40rpx;
  .item {
    position: relative;
    background-color: #fff;
    border: 2rpx solid #fff;
    box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-radius: 20rpx;
    padding: 20rpx;
    margin-bottom: 40rpx;
    .tag {
      position: absolute;
      top: 0;
      right: 0;
      width: 150rpx;
      height: 44rpx;
      background: #4caf50;
      border-radius: 0rpx 20rpx 0rpx 13rpx;

      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 600;
      color: #fff;
      text-align: center;
      line-height: 44rpx;
    }
    > .content {
      display: flex;
      justify-content: space-between;
      border-bottom: 2rpx solid #5aefc9;
      padding-bottom: 20rpx;
      .image {
        text-align: center;
        image {
          width: 200rpx;
          height: 263rpx;
          border-radius: 10rpx;
        }
      }
      .wrap {
        flex: 1;
        padding-left: 20rpx;
        .label-wrap {
          display: flex;
          justify-content: flex-start;
          .label {
            border: 3rpx solid #009688;
            border-radius: 16rpx;
            padding: 7rpx 17rpx;
            font-size: 19rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #009688;
            margin-right: 20rpx;
            &.r {
              border: 3rpx solid #fa6f45;
              color: #fa6f45;
            }
          }
        }
        .title {
          font-size: 32rpx;
          font-family: PingFang SC;
          font-weight: 600;
          color: #00796b;
          margin-top: 20rpx;
          height: 110rpx;
        }
        .row {
          display: flex;
          justify-content: flex-start;
          padding-top: 10rpx;
          padding-bottom: 10rpx;
          .label {
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #5aefc9;
          }
          .content {
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #00796b;
          }
        }
      }
    }
    .action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      > .l {
        flex: 1.3;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 600;
        color: #5aefc9;
        text {
          color: #00796b;
          padding-left: 5rpx;
          padding-right: 5rpx;
        }
      }
      > .r {
        flex: 3.5;
        .btn {
          display: flex;
          justify-content: space-between;
          background-color: #4caf50;
          border-radius: 27rpx;
          padding: 10rpx 30rpx;

          font-size: 28rpx;
          font-family: PingFang SC;
          font-weight: 600;
          color: #ffffff;
          > .l {
            flex: 1.8;
            display: flex;
            justify-content: space-between;
            padding-right: 40rpx;
            text:first-child {
              text-decoration: line-through;
            }
          }
          > .r {
            flex: 1;
            border-left: 2rpx solid #fff;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
