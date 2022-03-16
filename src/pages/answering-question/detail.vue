<template>
  <view class="container">
    <view>{{ detail.title }}</view>
    <view><rich-text :nodes="detail.content"></rich-text></view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { Tips } from '@/utils/util'
import { fetchAnsweringQuestionDetail } from '@/api/answeringQuestion'
const id = ref('')

const detail = ref({}) as any
const getDetail = () => {
  fetchAnsweringQuestionDetail({ id: id.value })
    .then((r) => {
      if (r.code === 0) {
        detail.value = r.data
      }
    })
    .catch((err) => console.log(err))
}

onShow(() => {
  getDetail()
})

onLoad((options) => {
  id.value = options.id as string
})
</script>
<style lang="scss">
.container {
}
</style>
