<template>
  <view class="container">
    <view class="favorite-wrap">
      <view
        class="u-mask"
        :class="[show ? 'u-mask-show' : 'u-mask-no']"
        catchtouchmove="true"
        @click="closeMask"
      ></view>
      <view class="tabs">
        <scroll-view scroll-x class="u-scroll-view" :scroll-left="0" scroll-with-animation>
          <view class="u-tabs-scroll-box">
            <view
              v-for="(item, index) in tabs"
              :key="index"
              class="u-tabs-item"
              :style="{
                fontWeight: index == getCurrent ? 'bold' : 'normal',
                color: index == getCurrent ? theme.color : '',
              }"
              @click="emitHandle(index)"
            >
              {{ item['name'] }}
            </view>
            <view
              class="u-scroll-bar"
              :style="{ transform: 'translateX(' + left + 'rpx)', 'background-color': theme.background }"
            ></view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed } from 'vue'
import { store } from '@/store'
export default defineComponent({
  name: 'FavoritePage',
  setup() {
    const state = reactive({
      getCurrent: 0,
      is_goods: true,
      left: 0,
      rotate: {
        left: 0,
        right: 0,
      },
      leftSet: 0,
      rightSet: 0,
      statusTop: 85,
      listStyle: true,
      statusList: [],
      selectStatus: 0,
      typeY: -800,
      show: false,
      list: [],
      topicList: [],
      timeOutEvent: -1,
      touch: false,
      allTouch: false,
      touchNumber: 0,
      shareShow: false,
      shareItem: {},
      goods_page: 1,
      topic_page: 1,
      topicShow: false,
    })

    const tabs = ref([
      {
        name: '商品',
      },
      {
        name: '发现',
      },
    ])

    const theme = computed(() => store.state.mallConfig.theme_color)

    const closeMask = () => {
      state.show = false
      state.rotate.left = 0
      state.rotate.right = 0
      state.typeY = -500
    }

    const emitHandle = (index) => {
      state.goods_page = 1
      if (index === 0) {
        state.is_goods = true
        state.left = 0
        state.statusTop = 85
        setTimeout(() => {
          state.getCurrent = index
        })
        this.getFavorite()
      } else if (index === 1) {
        setTimeout(() => {
          state.is_goods = false
        }, 500)
        state.getCurrent = index
        state.left = 375
        state.typeY = -800
        state.statusTop = -85
        for (let i in state.rotate) {
          state.rotate[i] = 0
        }
        state.show = false
        if (!state.listStyle) {
          for (let i = 0; i < state.list.length; i++) {
            state.list[i].touch = false
          }
          state.touch = false
          state.allTouch = false
        }
        this.getTopicList()
      }
    }

    return {
      ...toRefs(state),
      tabs,
      theme,
      closeMask,
      emitHandle,
    }
  },
})
</script>
<style lang="scss">
.container {
  .favorite-wrap {
    position: relative;
    min-height: 600rpx;
    .u-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      visibility: hidden;
      background: rgba(0, 0, 0, 0.6);
      z-index: 6;
      transition: all 0.3s ease-in-out;
      transform: scale(1.2, 1.2);
    }
    .u-mask-no {
      z-index: 0;
    }
    .u-mask-show {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
    .tabs {
      height: 88upx;
      background-color: #fff;
      border-bottom: 1upx solid #e2e2e2;
      z-index: 10;
      position: absolute;
      top: 0;
      width: 100%;
      .u-scroll-view {
        .u-tabs-scroll-box {
          position: relative;
          .u-tabs-item {
            position: relative;
            display: inline-block;
            text-align: center;
            font-size: 32upx;
            height: 88upx;
            line-height: 88upx;
            width: 50%;
            transition-property: background-color, color, font-weight;
          }
          .u-scroll-bar {
            position: absolute;
            bottom: 0rpx;
            width: 58upx;
            height: 4upx;
            left: 160upx;
            transition: 0.5s;
          }
        }
      }
    }
  }
}
</style>
