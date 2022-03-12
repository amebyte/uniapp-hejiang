<template>
  <view class="container">
    <view>{{ detail.title }}</view>
    <view @click="bookingAdd">预约</view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { fetchActivityDetail, fetchActivityBookingAdd } from '@/api/activity'
import { Tips } from '@/utils/util'
const id = ref('')
const bookingAdd = () => {
  fetchActivityBookingAdd({
    activity_id: id.value,
  })
    .then((r) => {
      if (r.code === 0) {
        Tips(r.msg)
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
      }
    })
    .catch((err) => console.log(err))
}

onLoad((options) => {
  id.value = options.id as string
  getDetail()
})
</script>
<style lang="scss">
.container {
}
</style>
