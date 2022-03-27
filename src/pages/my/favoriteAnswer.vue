<template>
  <view class="container">
    <!--提示 start-->
    <MessageModal v-if="isShowMessage" :msg="'可以左滑动进行删除'" @closeMessage="closeMessage"> </MessageModal>
    <!--提示 end-->
    <view class="label-title">全部答疑</view>
    <view class="list-wrap">
      <block v-for="(item, index) in list" :key="index">
        <view class="item-wrapper">
          <moveBox :index="index" :move-name="moveName" @changeMoveName="changeMoveName" @action="deleteByMove">
            <AnserItem :item="item.answeringQuestion" />
          </moveBox>
        </view>
      </block>
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
import moveBox from '@/components/move-box/index.vue'
import AnserItem from '@/components/answer-item/answer-item.vue'
import AppNoGoods from '@/components/app-no-goods/app-no-goods.vue'
import Cache from '@/utils/cache'
import { fetchMyAnsweringQuestionLikeList } from '@/api/favorite'
import { fetchAnsweringQuestionLikeDelete } from '@/api/answeringQuestion'

export default defineComponent({
  name: 'FavoritePage',
  components: {
    MessageModal,
    moveBox,
    AnserItem,
    AppNoGoods,
  },
  setup() {
    const total_count = ref(0)
    const list = ref([]) as any
    const isShowMessage = ref(true)
    const closeMessage = () => {
      isShowMessage.value = false
      Cache.set('isShowMessageFavoriteAnswer', 'false')
    }

    const moveName = ref('') as any

    /**
     * 滑动回调
     */
    const changeMoveName = (name) => {
      moveName.value = name
    }

    const page = ref(1)
    const getList = (bool?) => {
      fetchMyAnsweringQuestionLikeList({ page: page.value })
        .then((r) => {
          if (!bool) {
            list.value = r.data.list
          } else {
            list.value.push(...r.data.list)
          }
        })
        .catch((err) => console.log('fetchMyAnsweringQuestionLikeList:', err))
    }

    /**
     * 滑动删除
     */
    const deleteByMove = (index) => {
      uni.showModal({
        title: '答疑删除确认',
        content: `您确定要删除该答疑吗？`,
        success: (e) => {
          if (e.confirm) {
            fetchAnsweringQuestionLikeDelete({ id: list.value[index].id })
              .then((r) => {
                if (r.code === 0) {
                  list.value.splice(index, 1)
                }
              })
              .catch((err) => console.log(err))
          }
        },
      })
    }

    onLoad(() => {
      const flag = Cache.get('isShowMessageFavoriteAnswer')
      isShowMessage.value = flag === 'false' ? false : true
      getList()
    })
    return {
      total_count,
      list,
      isShowMessage,
      moveName,
      closeMessage,
      changeMoveName,
      deleteByMove,
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
    .item-wrapper {
      position: relative;
      overflow: hidden;
      padding: 10rpx 0;
    }
    .no-list {
      margin-top: 120rpx;
    }
  }
}
</style>
