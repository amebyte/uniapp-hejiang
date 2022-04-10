<template>
  <view class="container">
    <rich-text :nodes="state.detail.rules"></rich-text>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref, reactive } from 'vue'
import { fetchMemberLevelInfo, fetchMemberRechargeSetting } from '@/api/user'

const state = reactive({
  tabbarbool: false,
  detail: {
    rules: '',
    level: 0,
  },
  list: [] as any,
  nextList: [],
  goods: [],
  first: false,
  haveBackground: false,
  coupon: [],
  balance: 0,
  loading: false,
  member_pic_url: null,
  nextMember: {
    money: 0,
  },
  recharge: false,
  current: 'wechat',
  prop: 0,
  page_loading: true,
  level: 0,
})

const getList = () => {
  let that = this
  fetchMemberLevelInfo()
    .then((response) => {
      if (response.code == 0) {
        state.list = response.data
        state.detail = state.list.mall_member
        state.goods = state.list.member_goods
        state.coupon = state.list.member_coupons
        state.nextMember = state.list.next_consume_upgrade_member
        state.member_pic_url = state.list.member_pic_url
        state.nextList = state.list.next_mall_member
        if (state.recharge) {
          state.balance = state.list.user_info.balance
        }
        if (state.detail != null) {
          state.level = state.detail.level
        }
        if (state.nextMember) {
          state.prop = (state.list.consumption_money / state.nextMember.money) * 100
          if (state.prop > 100) {
            state.prop = 100
          }
        }
        if (state.detail == null && state.nextList && state.nextList.length > 0) {
          state.detail = state.nextList[0]
        }
        state.detail.rules = state.detail.rules.replace(
          /<img/gi,
          "<img class='richImg' style='width:auto!important;height:auto!important;max-height:100%;width:100%;'"
        )
        state.detail.rules = state.detail.rules.replace(/&nbsp;/g, '&ensp;')
      } else {
        uni.showToast({
          title: response.msg,
          icon: 'none',
          duration: 1000,
        })
      }
    })
    .catch((response) => {
      console.log('fetchMemberLevelInfo:', response)
    })
}

onShow(() => {
  getList()
})
</script>
<style lang="scss">
.container {
  padding: 20rpx;
}
</style>
