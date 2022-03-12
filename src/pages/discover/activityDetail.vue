<template>
  <view class="container"> <view @click="bookingAdd">预约</view> </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { fetchActivityBookingAdd } from '@/api/activity'
const id = ref('')
const bookingAdd = () => {
  fetchActivityBookingAdd({
    activity_id: id.value,
  })
    .then((r) => {
      console.log('booking', r)
    })
    .catch((err) => console.log(err))
}

onLoad((options) => {
  id.value = options.id as string
})
</script>
<style lang="scss">
.container {
}
</style>
