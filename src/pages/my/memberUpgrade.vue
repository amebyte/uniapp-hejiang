<template>
  <view class="container">
    <view class="nav">
      <swiper class="member-list" :current="index" previous-margin="20px" next-margin="20px" @change="change">
        <swiper-item v-for="item in list" :key="item.id" class="member-item">
          <!-- #ifdef MP-ALIPAY -->
          <image
            class="memeber-img"
            :src="item.bg_pic_url ? item.bg_pic_url : item.pic_url"
            style="margin-top: 0"
          ></image>
          <!-- #endif -->
          <!-- #ifndef MP-ALIPAY -->
          <image class="memeber-img" :src="item.bg_pic_url ? item.bg_pic_url : item.pic_url"></image>
          <!-- #endif -->
        </swiper-item>
      </swiper>
    </view>
    <view v-if="detail.is_purchase != 0 || detail.auto_update != 0" class="method">
      <view class="member-info">
        <view>{{ detail.name }}</view>
      </view>
      <view class="method-title">
        <image src="./../image/how.png"></image>
        <text>如何获得该卡</text>
      </view>
      <view class="method-list">
        <view v-if="detail.is_purchase != 0" class="dir-left cross-center way">
          <image class="way-num" :src="memberImg.one"></image>
          <view class="way-money"
            >直接购买
            <text>￥{{ detail.price }}</text>
          </view>
        </view>
        <view v-if="detail.auto_update != 0" class="dir-left cross-center way">
          <image v-if="detail.is_purchase != 0" class="way-num" :src="memberImg.two"></image>
          <image v-else class="way-num" :src="memberImg.one"></image>
          <view class="way-money"
            >累积消费满
            <text>￥{{ detail.money }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="right">
      <view class="method-title">
        <image src="./../image/right.png"></image>
        <text>特权说明</text>
      </view>
      <view class="right-list">
        <view v-for="item in detail.rights" :key="item.id">{{ item.content }}</view>
      </view>
    </view>
    <view v-if="detail.is_purchase == 1 && detail.level > level" class="right-away">
      <view class="to-recharge" @click="payMember(detail.level)">
        <button class="way-btn">￥{{ detail.price }} 立即升级</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'MemberUpgrade',
  setup() {
    const state = reactive({
      auto: false,
      list: [] as any[],
      index: 0,
      level: 0,
      other: 0,
      current: 'wechat',
      detail: {
        price: '',
        money: '',
      } as any,
    })

    return {
      ...toRefs(state),
    }
  },
  computed: {
    ...mapState({
      memberImg: (state) => state.mallConfig.__wxapp_img.member,
    }),
  },
  methods: {
    payMember(member_level) {
      let that = this
      uni.showLoading({
        mask: true,
        title: '领取中...',
      })
      that
        .$request({
          url: that.$api.member.purchase,
          data: {
            member_level: member_level,
          },
          method: 'post',
        })
        .then((response) => {
          uni.hideLoading()
          if (response.code === 0) {
            if (response.data.retry && response.data.retry === 1) {
              that.getPayDataTimer = setTimeout(() => {
                that.payMember(member_level)
              }, 1000)
            } else {
              that.pay(response.data.pay_id, member_level)
            }
          } else {
            uni.showModal({
              title: '提示',
              content: response.msg,
              showCancel: false,
            })
          }
        })
        .catch((e) => {
          uni.hideLoading()
          uni.showModal({
            title: '提示',
            content: e.errMsg,
            showCancel: false,
          })
        })
    },

    pay(id, level) {
      let that = this
      that.$payment
        .pay(id)
        .then((res) => {
          uni.showToast({
            title: '支付成功',
            duration: 1000,
          })
          that.level = level
        })
        .catch((res) => {
          uni.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000,
          })
        })
    },

    change(e) {
      let that = this
      that.index = e.detail.current
      that.detail = that.list[that.index]
    },

    getList() {
      let that = this
      that
        .$request({
          url: that.$api.member.all,
          method: 'get',
        })
        .then((response) => {
          uni.hideLoading()
          that.$hideLoading()
          if (response.code == 0) {
            that.list = response.data.list
            that.index = 0
            if (that.other > 0) {
              for (let i = 0; i < that.list.length; i++) {
                if (that.other == that.list[i].level) {
                  that.index = i
                }
              }
            } else {
              for (let i = 0; i < that.list.length; i++) {
                if (that.level == that.list[i].level) {
                  that.index = i
                }
              }
            }
            that.detail = that.list[that.index]
          } else {
            uni.showToast({
              title: response.msg,
              icon: 'none',
              duration: 1000,
            })
          }
        })
        .catch((response) => {
          uni.hideLoading()
          that.$hideLoading()
        })
    },
  },
  onLoad(options) {
    this.$commonLoad.onload(options)
    let that = this
    if (options.level) {
      that.level = options.level
    }
    if (options.other) {
      that.other = options.other
    }
    that.$showLoading({
      text: '加载中...',
    })
    that.getList()
  },
})
</script>

<style scoped lang="scss">
.nav {
  margin-top: 32rpx;
  position: relative;
  text-align: center;
  height: 370rpx;
  image {
    margin-top: 20rpx;
    height: 330rpx;
    width: 640rpx;
    border-radius: 16rpx;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.3);
  }
  .to-recharge {
    position: absolute;
    bottom: 102rpx;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 70rpx;
    width: 240rpx;
  }
}

.member-list {
  height: 370rpx;
}

.upgrade-btn {
  height: 70rpx;
  line-height: 68rpx;
  width: 240rpx;
  border: 1rpx solid #b4914f;
  border-radius: 36rpx;
  font-size: 32rpx;
  color: #b4914f;
  background-color: #f8f2e2;
}

.method {
  margin-top: 96rpx;
}

.member-info {
  font-size: 36rpx;
  color: #353535;
  padding: 0 55rpx;
  margin-bottom: 40rpx;
}

.method-title {
  height: 48rpx;
  font-size: 32rpx;
  color: #353535;
  padding: 0 55rpx;
}

.method-title image {
  height: 48rpx;
  width: 48rpx;
  float: left;
  margin-right: 40rpx;
}

.method-list {
  margin-top: 32rpx;
  margin-left: 143rpx;
}

.way-num {
  height: 36rpx;
  width: 36rpx;
  display: block;
  margin-top: 8rpx;
  margin-right: 16rpx;
}

.way {
  height: 60rpx;
  line-height: 60rpx;
}

.way-money {
  font-size: 32rpx;
  color: #353535;
}

.way-money text {
  font-size: 36rpx;
  color: #b4914f;
}

.right {
  margin-top: 64rpx;
  padding-bottom: 150rpx;
}

.right-list {
  margin-left: 143rpx;
  color: #666;
  font-size: 28rpx;
  width: 540rpx;
}

.right-away {
  height: 140rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  .way-btn {
    margin: 30rpx auto 0;
    height: 80rpx;
    line-height: 80rpx;
    width: 640rpx;
    background-color: #b4914f;
    border-radius: 40rpx;
    font-size: 32rpx;
    color: #ffffff;
  }
}

.member-name {
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  font-size: 44rpx;
  color: #fff;
  top: 85rpx;
}

.memeber-info {
  display: none;
}
</style>
