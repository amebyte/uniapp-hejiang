<template>
  <app-layout>
    <view v-if="is_show" class="express-box">
      <view class="box-grow-1 top-box dir-left-wrap">
        <view class="box-grow-0 cross-center main-center">
          <image class="goods-pic" mode="aspectFill" :src="cover_pic"></image>
        </view>
        <view class="dir-top-wrap box-grow-1">
          <view class="dir-left-nowrap">
            <text class="box-grow-0 label">物流状态:</text>
            <text class="box-grow-0 sign-text">
              {{ expressDetail.status_text ? expressDetail.status_text : '未知' }}
            </text>
          </view>
          <view class="dir-left-nowrap">
            <text class="box-grow-0 label">快递公司:</text>
            <text class="box-grow-0">{{ order.express }}</text>
          </view>
          <view class="dir-left-nowrap cross-center">
            <text class="box-grow-0 label">快递单号:</text>
            <text class="box-grow-1">{{ order.express_no }}</text>
            <view class="box-grow-0 detail-btn" @click="copyText">复制</view>
          </view>
        </view>
      </view>
      <view class="logistics-box dir-top-wrap">
        <block v-if="expressDetail.list">
          <view class="item-box">
            <view
              v-for="item in expressDetail.list"
              :key="item.id"
              :class="{ 'sign-text': index == 0 ? true : false }"
              class="dir-top item"
            >
              <image v-if="index == 0" class="sign-big" src="/static/image/icon/order/point-green.png"></image>
              <image v-else class="sign" src="/static/image/icon/order/point-gray.png"></image>
              <view>{{ item.desc }}</view>
              <view>{{ item.datetime }}</view>
            </view>
          </view>
        </block>
        <view v-else class="main-center empty-box">
          <view>暂无物流信息</view>
        </view>
      </view>
    </view>
  </app-layout>
</template>

<script lang="ts">
import { fetchOrderExpressDetail } from '@/api/order'
import { uniCopy } from '@/utils/util'
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed, watch } from 'vue'
export default defineComponent({
  name: 'ExpressDetail',
  setup() {
    const state = reactive({
      expressDetail: null,
      order: null as any,
      express: '' as any,
      express_no: '' as any,
      cover_pic: '' as any,
      customer_name: '' as any,
      is_show: false,
    })

    const getExpressDetail = () => {
      fetchOrderExpressDetail({
        express: state.express,
        customer_name: state.customer_name,
        express_no: state.express_no,
      })
        .then((response) => {
          state.is_show = true
          if (response.code === 0) {
            state.order = response.data.order
            state.expressDetail = response.data.express
          } else {
            uni.showModal({
              title: '',
              content: response.msg,
              showCancel: false,
            })
          }
        })
        .catch((err) => {
          console.log('getExpressDetail err:', err)
        })
    }

    const copyText = () => {
      uniCopy({
        data: state.order.express_no,
        success: function () {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
    }

    onLoad((options) => {
      state.express = options.express
      state.express_no = options.express_no
      state.customer_name = options.customer_name
      state.cover_pic = options.cover_pic
      getExpressDetail()
    })

    return {
      ...toRefs(state),
      copyText,
    }
  },
})
</script>

<style lang="scss" scoped>
.express-box {
  position: absolute;
  height: 100%;
  width: 100%;
}
.express-box .top-box {
  padding: 20rpx;
  background-color: #ffffff;
}

.express-box .label {
  margin-right: 10rpx;
}

.express-box .goods-pic {
  width: 130rpx;
  height: 130rpx;
  margin-right: 20rpx;
}

.logistics-box {
  padding: 20rpx 25rpx;
  background-color: #fff;
  margin-top: 25rpx;
  font-size: $uni-font-size-weak-two;
  color: $uni-general-color-two;
}

.logistics-box .item-box {
  border-left: 1rpx solid $uni-weak-color-one;
  padding-left: 45rpx;
  position: relative;
}

.logistics-box .item {
  margin-bottom: 25rpx;
  padding-bottom: 25rpx;
  border-bottom: 1rpx solid $uni-weak-color-one;
}

.logistics-box .item .sign {
  width: 16rpx;
  height: 16rpx;
  position: absolute;
  left: -7rpx;
}

.logistics-box .item .sign-big {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  left: -16rpx;
}

.sign-text {
  color: #25ae5f;
}
.empty-box {
  font-size: $uni-font-size-general-one;
}
.detail-btn {
  border: 1rpx solid #bbbbbb;
  border-radius: 30rpx;
  padding: 10rpx 30rpx;
}
</style>
