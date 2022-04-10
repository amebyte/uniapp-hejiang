<template>
  <view class="container">
    <view class="header">
      <view class="title">{{ detail.title }}</view>
      <view class="title-bar">
        <view class="title-bar-left"><text class="iconfont icon-calendar"></text>{{ detail.created_at }}</view>
        <view class="title-bar-right">
          <view class="favorite" style="display: none">
            <text class="iconfont icon-hits"></text> 浏览：{{ detail.hits }}
          </view>
          <view class="share"> <text class="iconfont icon-share"></text> 分享 </view>
        </view>
      </view>
      <view class="sub-info">
        <view class="row">
          <text class="iconfont icon-time"></text>
          活动时间：{{ detail.datetime }} {{ detail.start_time }}-{{ detail.end_time }}
        </view>
        <view class="row">
          <text class="iconfont icon-people"></text>
          限定 {{ detail.max_num }} 人
        </view>
        <view class="row">
          <text class="iconfont icon-booked"></text>
          已预约 {{ detail.book_count }} 人
        </view>
      </view>
    </view>
    <view class="detail">
      <image src="/static/icon/goods-detail.png"></image>
      <rich-text :nodes="detail.content"></rich-text>
    </view>

    <view class="footer acea-row row-between-wrapper">
      <view class="bookBtn bg-color" :class="detail.is_booked ? 'booked' : ''" @click="bookingAdd">
        <text v-if="renderBtnText(detail) === '预约成功'" class="iconfont icon-selected"></text>
        <text v-if="renderBtnText(detail) === '立即预约'" class="iconfont icon-add-bold"></text>
        <text v-if="renderBtnText(detail) === '人数已满'" class="iconfont icon-booked"></text>
        {{ renderBtnText(detail) }}
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { fetchActivityDetail, fetchActivityBookingAdd } from '@/api/activity'
import { Tips } from '@/utils/util'
const id = ref('')
const bookingAdd = () => {
  if (detail.value.is_booked || Number(detail.value.max_num) === Number(detail.value.book_count)) {
    return
  }
  fetchActivityBookingAdd({
    activity_id: id.value,
  })
    .then((r) => {
      if (r.code === 0) {
        Tips({ title: r.msg })
      } else {
        Tips({ title: r.msg })
      }
    })
    .catch((err) => console.log(err))
}
const detail = ref({}) as any
const getDetail = () => {
  fetchActivityDetail({ activity_id: id.value })
    .then((r) => {
      if (r.code === 0) {
        detail.value = r.data
        detail.value.datetime = r.data.date_start_time.slice(0, 10)
      }
    })
    .catch((err) => console.log(err))
}

const renderBtnText = (item) => {
  let txt = ''
  if (Number(item.book_count) === Number(item.max_num)) {
    txt = '人数已满'
  } else if (item.is_booked) {
    txt = '预约成功'
  } else {
    txt = '立即预约'
  }

  return txt
}

onShow(() => {
  getDetail()
})

onLoad((options) => {
  id.value = options.id as string
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  .header {
    background-color: #fff;
    border-radius: 15rpx;
    margin: 20rpx;
    padding-bottom: 20rpx;
    .title {
      font-size: 42rpx;
      font-weight: 500;
      text-align: justify;
      color: #353535;
      padding: 20rpx;
    }
    .title-bar {
      padding-top: 20rpx;
      padding-bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28rpx;
      color: #999;
      .title-bar-left {
        padding-left: 20rpx;
        .iconfont {
          padding-right: 10rpx;
          color: $theme-font-color;
        }
      }
      .title-bar-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .iconfont {
          color: $theme-font-color;
        }
        .favorite {
          padding-right: 20rpx;
        }
        .share {
          color: #fff;
          height: 48rpx;
          line-height: 48rpx;
          font-size: 22rpx;
          border-radius: 40rpx 0 0 40rpx;
          padding: 0 14rpx;
          width: 103rpx;
          background-color: $theme-font-color;

          .iconfont {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }
    }
    .sub-info {
      background-color: #ebfffd;
      padding: 20rpx;
      font-size: 24rpx;
      border-radius: 16rpx;
      margin: 0 20rpx;
      color: $theme-font-color;
      .row {
        padding-top: 5rpx;
        padding-bottom: 5rpx;
        .iconfont {
          padding-right: 10rpx;
        }
      }
    }
  }
  .detail {
    padding: 20upx;
    background-color: #ffffff;
    border-radius: 15upx;
    margin: 20rpx;
    margin-top: 24upx;
    min-height: 800rpx;
    image {
      width: 100%;
      height: 80rpx;
      display: block;
    }
  }

  .footer {
    position: fixed;
    width: 100%;
    background-color: #fff;
    bottom: 0;
    height: 136rpx;
    padding: 0 30rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
    .bookBtn {
      width: 100%;
      height: 76rpx;
      border-radius: 50rpx;
      text-align: center;
      line-height: 76rpx;
      font-size: 30rpx;
      color: #fff;
      background: rgba(26, 168, 108, 1);
      .iconfont {
        font-size: 35rpx;
        margin-right: 8rpx;
        vertical-align: -1rpx;
      }
      &.booked {
        background: rgba(26, 168, 108, 0.6);
      }
    }
  }
}
</style>
