<template>
  <view class="container">
    <!--提示 start-->
    <MessageModal v-if="isShowMessage" @closeMessage="closeMessage"> </MessageModal>
    <!--提示 end-->
    <view class="label-title">全部答疑（{{ total_count }}）</view>
    <view class="list-wrap">
      <block v-for="(item, index) in list" :key="index"> </block>
      <template v-if="list.length === 0">
        <view class="no-list">
          <AppNoGoods background="#f7f7f7" :title="'暂无相关答疑'" color="#999999" :is-image="1" />
        </view>
      </template>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed, watch } from 'vue'
import MessageModal from './component/MessageModal.vue'
import AppNoGoods from '@/components/app-no-goods/app-no-goods.vue'
import Cache from '@/utils/cache'

export default defineComponent({
  name: 'FavoritePage',
  setup() {
    const total_count = ref(0)
    const list = ref([]) as any
    const isShowMessage = ref(true)
    const closeMessage = () => {
      isShowMessage.value = false
      Cache.set('isShowMessageMyComment', 'false')
    }

    onLoad(() => {
      const flag = Cache.get('isShowMessageMyComment')
      isShowMessage.value = flag === 'false' ? false : true
    })
    return {
      total_count,
      list,
      isShowMessage,
      closeMessage,
    }
  },
})
</script>
<style lang="scss">
.container {
  .label-title {
    font-size: 30rpx;
    font-weight: bold;
    position: relative;
    padding: 20rpx 0;
    margin-left: 30rpx;
    margin-right: 30rpx;
    margin-bottom: 10rpx;
    &::after {
      content: '';
      position: absolute;
      left: -18rpx;
      top: 32%;
      width: 6rpx;
      height: 36%;
      background: #1aa86c;
      background-image: initial;
      background-position-x: initial;
      background-position-y: initial;
      background-size: initial;
      background-repeat-x: initial;
      background-repeat-y: initial;
      background-attachment: initial;
      background-origin: initial;
      background-clip: initial;
      background-color: #1aa86c;
    }
  }
  .list-wrap {
    margin-left: 20rpx;
    margin-right: 20rpx;
    .no-list {
      margin-top: 120rpx;
    }
  }
}
</style>
