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

      <view class="set-wrap" catchtouchmove="true">
        <view class="f-status dir-left-nowrap cross-center" :style="{ transform: 'translateY(' + statusTop + 'rpx)' }">
          <view
            class="f-item dir-left-nowrap cross-center main-between"
            :style="{ color: rotate.left === 180 ? theme.color : '' }"
            :class="rotate.left === 180 ? 'f-set' : 'f-def-set'"
            @click="setDef('left')"
          >
            <view>
              <text class="t-omit">{{ setCategory(leftSet) }}</text>
            </view>
            <view
              class="bd-image"
              :style="{
                transform: 'rotate(' + rotate.left + 'deg)',
                'background-color': rotate.left === 180 ? theme.background : '#353535',
              }"
            ></view>
          </view>
          <view
            class="f-item dir-left-nowrap cross-center main-between"
            :style="{ color: rotate.right === 180 ? theme.color : '' }"
            :class="rotate.right === 180 ? 'f-set' : 'f-def-set'"
            @click="setDef('right')"
          >
            <view>
              <text class="t-omit">{{ setStatus(rightSet) }}</text>
            </view>
            <view
              class="bd-image"
              :style="{
                transform: 'rotate(' + rotate.right + 'deg)',
                'background-color': rotate.right === 180 ? theme.background : '#353535',
              }"
            ></view>
          </view>
          <view class="f-good-btn" @click="edit">
            {{ touch ? '完成' : '管理' }}
          </view>
          <view class="f-good-icon" @click="setListStyle()">
            <image :src="listStyle ? '/static/icon/image/square.png' : '/static/icon/image/row.png'"></image>
          </view>
        </view>
        <view class="f-select" :style="{ transform: 'translateY(' + typeY + 'rpx)' }">
          <scroll-view scroll-y>
            <view class="dir-left-wrap f-type">
              <view
                v-for="it in statusList"
                :key="it.id"
                class="f-type-item"
                :style="{ color: selectStatus == it.id ? theme.color : '' }"
                :class="selectStatus == it.id ? '' : 'f-type-def'"
                @tap="setStatus(it.id)"
                >{{ it.name }}</view
              >
            </view>
          </scroll-view>
          <view class="f-button dir-left-nowrap">
            <button class="box-grow-1" @click="sureStatus(0)">重置</button>
            <button class="box-grow-1" :style="{ 'background-color': theme.background }" @click="sureStatus(1)">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed } from 'vue'
import { store } from '@/store'
import { fetchFavoriteGoodsCats, fetchFavoriteGoodsList } from '@/api/favorite'
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
      statusList: [] as any[],
      selectStatus: 0,
      typeY: -800,
      show: false,
      list: [] as any[],
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
      statusData: [
        {
          name: '全部状态',
          id: 0,
        },
        // {
        //   name: '优惠',
        //   id: 3,
        // },
        {
          name: '低库存',
          id: 1,
        },
        {
          name: '失效',
          id: 2,
        },
      ],
    })

    const catList = ref([]) as any

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

    const setDef = (key) => {
      if (key === 'right') {
        state.statusList = state.statusData
        state.rotate.left = 0
        state.typeY = -800
      } else {
        state.statusList = catList.value
        state.rotate.right = 0
        state.typeY = -800
      }
      if (state.rotate[key] === 0) {
        state.rotate[key] = 180
        state.show = true
        state.typeY = -3
      } else {
        state.rotate[key] = 0
      }
    }

    const setListStyle = () => {
      state.listStyle = !state.listStyle
      state.touch = false
      if (!state.listStyle) {
        for (let i = 0; i < state.list.length; i++) {
          state.list[i].touch = false
        }
        state.allTouch = false
      }
    }

    const setCategory = (index) => {
      for (let i = 0; i < catList.value.length; i++) {
        if (catList.value[i].id === index) {
          return catList.value[i].name
        }
      }
    }

    const setStatus = (index) => {
      state.selectStatus = index
      for (let i = 0; i < state.statusData.length; i++) {
        if (state.statusData[i].id === index) {
          return state.statusData[i].name
        }
      }
    }

    const sureStatus = (s) => {
      state.goods_page = 1

      state.typeY = -800
      state.show = false
      if (s === 1) {
        if (state.rotate.left !== 0) {
          state.leftSet = state.selectStatus
        }
        if (state.rotate.right !== 0) {
          state.rightSet = state.selectStatus
        }

        this.getFavorite()
        for (let i in state.rotate) {
          state.rotate[i] = 0
        }
      } else {
        state.leftSet = 0
        state.rightSet = 0
        this.getFavorite()
        for (let i in state.rotate) {
          state.rotate[i] = 0
        }
      }
    }

    const getCats = () => {
      fetchFavoriteGoodsCats()
        .then((r) => {
          catList.value = r.data.list
        })
        .catch((err) => console.log('fetchFavoriteGoodsCats:', err))
    }

    const getFavorite = (bool?) => {
      fetchFavoriteGoodsList({
        cat_id: state.leftSet,
        status: state.rightSet,
        page: state.goods_page,
      })
        .then((r) => {
          if (!bool) {
            state.list = r.data.list
          } else {
            state.list.push(...r.data.list)
          }
        })
        .catch((err) => console.log('fetchFavoriteGoodsList:', err))
    }

    onLoad(() => {
      getCats()
      getFavorite()
    })

    return {
      ...toRefs(state),
      tabs,
      theme,
      closeMask,
      emitHandle,
      setDef,
      setListStyle,
      setStatus,
      sureStatus,
      setCategory,
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
    .set-wrap {
      position: relative;
      .f-status {
        height: 78upx;
        background-color: #ffffff;
        border-bottom: 1upx solid #e2e2e2;
        padding: 0 24upx;
        transition: 0.5s;
        z-index: 9;
        position: absolute;
        width: 100%;
        top: 2upx;
        > view:first-child {
          margin-right: 22upx;
        }
        .f-item {
          border-radius: 26upx;
          height: 52upx;
          margin-right: 5upx;
          width: 160upx;
          image {
            width: 11upx;
            height: 6upx;
            transition: 0.3s;
            margin-right: 16upx;
          }
          > view {
            width: 133upx;
            padding-left: 25upx;
            padding-right: 10upx;
          }
          text {
            width: 98upx;
            font-size: 23upx;
          }
        }
        .f-set {
          border: 1upx solid;
          background-color: #ffffff;
        }
        .f-def-set {
          border: 1upx solid #f5f5f5;
          background-color: #f5f5f5;
        }

        .f-img {
          background-color: #353535;
        }
        text {
          font-size: 23upx;
        }
        .f-good-icon {
          width: 78upx;
          height: 78upx;
          position: absolute;
          right: 0;
          padding: 24upx;
          image {
            width: 30upx;
            height: 30upx;
          }
        }
        .f-good-btn {
          position: absolute;
          right: 79upx;
          padding: 24upx;
          font-size: 24upx;
        }
      }
      .f-select {
        position: absolute;
        top: 160rpx;
        width: 750upx;
        transition: 0.5s;
        z-index: 8;
        background-color: #f5f5f5;
        .f-button {
          height: 90upx;
          border-top: 1upx solid #e2e2e2;
          button {
            font-size: 26upx;
            line-height: 90upx;
            border-radius: 0;
          }
          button:first-child {
            color: #747474;
            background-color: #fff;
          }
          button:last-child {
            color: #fff;
          }
        }
        .f-type {
          padding: 48upx 24upx 24upx 24upx;
          max-height: 360upx;
          .f-type-item {
            margin-bottom: 24upx;
            background-color: #ffffff;
            border: 1upx solid;
            width: 339upx;
            border-radius: 37upx;
            height: 72upx;
            line-height: 72upx;
            font-size: 25upx;
            text-align: center;
          }
          .f-type-def {
            border: 1upx solid #e2e2e2;
            color: #353535;
          }
          .f-type-item:nth-child(odd) {
            margin-right: 23upx;
          }
        }
      }
    }
  }
}

.bd-image {
  background-image: url('../../static/icon/image/bottom.png');
  background-size: 102% 102%;
  width: 11upx !important;
  height: 6upx;
  transition: 0.3s;
  margin-right: 16upx;
  background-repeat: no-repeat;
  padding-left: 0 !important;
}
</style>
