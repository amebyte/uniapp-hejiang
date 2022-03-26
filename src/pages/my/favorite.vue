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
          <view class="f-good-btn" @click="editHandle">
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

      <view v-if="is_goods" class="good-list" :class="getCurrent === 0 ? 'good-show' : 'good-hidden'">
        <block v-if="listStyle">
          <view v-for="(item, index) in list" :key="index" class="dir-left-nowrap">
            <view
              v-if="touch"
              class="f-radio box-grow-0 dir-top-nowrap main-center cross-center"
              style="background-color: #ffffff"
              @tap="setTouch(index)"
            >
              <view v-if="!item.touch" class="f-radio-no">
                <text class="iconfont icon-radio-uncheck"></text>
              </view>
              <view v-if="item.touch" class="f-radio-yes">
                <text class="iconfont icon-radio-checked"></text>
              </view>
            </view>
            <moveBox
              :index="index"
              :move-name="moveName"
              :disabled="!touch"
              @changeMoveName="changeMoveName"
              @action="deleteByMove"
            >
              <view class="f-item u-border-bottom dir-left-nowrap" @click="routeUrl(item)">
                <image class="f-img" :src="item.cover_pic" />
                <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
                <view class="f-content dir-top-wrap main-between">
                  <text class="t-omit-two f-title">{{ item.name }}</text>
                  <view>
                    <view v-if="item.status_type === 3" class="f-invalid dir-left-nowrap cross-center main-between">
                      <image src="/static/image/icon/invalid.png"></image>
                      <text>失效</text>
                    </view>
                    <view v-if="item.status_type === 2" class="f-low-stock dir-left-nowrap cross-center main-between">
                      <image src="/static/image/icon/low_stock.png"></image>
                      <text>低库存</text>
                    </view>
                    <view v-if="item.status_type === 1" class="f-low-price dir-left-nowrap">
                      <view class="dir-left-nowrap main-between cross-center">
                        <image src="/static/image/icon/low_price.png"></image>
                        比收藏时降价{{ item.low_price }}元
                      </view>
                    </view>
                    <view v-if="item.status_type !== 3" class="dir-left-nowrap main-between">
                      <template v-if="item.is_negotiable == 1">
                        <view :style="{ color: theme.color, 'margin-bottom': '8rpx' }">价格面议</view>
                      </template>
                      <view v-else class="dir-top-wrap main-between">
                        <text class="f-price" :style="{ color: theme.color }">{{ item.price_content }}</text>
                        <text class="f-scale">{{ item.sales }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </moveBox>
          </view>

          <view v-if="touch" class="f-delete-box"></view>
          <view
            class="f-delete dir-left-nowrap main-between cross-center"
            :class="touch ? 'f-delete-show' : 'f-delete-hidden'"
          >
            <view class="dir-left-nowrap" @click="setTouchAll(allTouch)">
              <view class="f-radio">
                <view v-if="!allTouch" class="f-kon">
                  <text class="iconfont icon-radio-uncheck"></text>
                </view>
                <view v-if="allTouch" class="f-touch">
                  <text class="iconfont icon-radio-checked"></text>
                </view>
              </view>
              <text>全选</text>
            </view>
            <button :class="touchNumber > 0 ? 'f-button-t ' : 'f-button-m'" @click="remove">删除</button>
          </view>
        </block>
        <block v-else>
          <view class="f-list dir-left-wrap">
            <view v-for="(item, index) in list" :key="index" class="f-list-item" @click="handleTouchend(item, index)">
              <view class="f-img">
                <image :src="item.cover_pic"></image>
                <view v-if="item.status_type === 3" class="f-invalid f-icon dir-left-nowrap cross-center main-between">
                </view>
                <view
                  v-if="item.status_type === 1"
                  class="f-low-price f-icon dir-left-nowrap cross-center main-between"
                >
                </view>
                <view
                  v-if="item.status_type === 2"
                  class="f-low-stock f-icon dir-left-nowrap cross-center main-between"
                >
                </view>
                <view class="f-radio">
                  <view v-if="touch && !item.touch" class="f-kon"
                    ><text class="iconfont icon-radio-uncheck"></text
                  ></view>
                  <view v-if="item.touch" class="f-touch"><text class="iconfont icon-radio-checked"></text></view>
                </view>
              </view>
              <view class="f-text dir-top-nowrap main-between">
                <text class="t-omit-two">{{ item.name }}</text>
                <template v-if="item.is_negotiable == 1">
                  <view :style="{ color: theme.color, 'margin-bottom': '8rpx' }">价格面议</view>
                </template>
                <view v-else class="dir-left-nowrap main-between">
                  <text class="f-price" :style="{ color: theme.color }">{{ item.price_content }}</text>
                  <text class="f-sales">{{ item.sales }}</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="touch" class="f-delete-box"></view>
          <view
            class="f-delete dir-left-nowrap main-between cross-center"
            :class="touch ? 'f-delete-show' : 'f-delete-hidden'"
          >
            <view class="dir-left-nowrap" @click="setTouchAll(allTouch)">
              <view class="f-radio">
                <view v-if="!allTouch" class="f-kon"><text class="iconfont icon-radio-uncheck"></text></view>
                <view v-if="allTouch" class="f-touch"><text class="iconfont icon-radio-checked"></text></view>
              </view>
              <text>全选</text>
            </view>
            <button :class="touchNumber > 0 ? 'f-button-t ' : 'f-button-m'" @click="remove">删除</button>
          </view>
        </block>
        <app-no-goods v-if="list.length === 0" background="#f7f7f7"></app-no-goods>
      </view>

      <view v-if="!is_goods" class="blog-like-list" :class="getCurrent === 1 ? 'good-show' : 'good-hidden'">
        <block v-for="item in blogLikeList" :key="item.id">
          <BlogItem :item="item.blog" />
        </block>
        <template v-if="blogLikeList.length === 0">
          <view class="no-list">
            <AppNoGoods background="#f7f7f7" :title="'暂无相关作品'" color="#999999" :is-image="1" />
          </view>
        </template>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed, watch } from 'vue'
import moveBox from '@/components/move-box/index.vue'
import BlogItem from '@/components/blog-item/blog-item.vue'
import { store } from '@/store'
import {
  fetchFavoriteBatchRemove,
  fetchFavoriteGoodsCats,
  fetchFavoriteGoodsList,
  fetchFavoriteRemove,
  fetchMyBlogLikeList,
} from '@/api/favorite'
import AppNoGoods from '@/components/app-no-goods/app-no-goods.vue'
export default defineComponent({
  name: 'FavoritePage',
  components: { moveBox, AppNoGoods, BlogItem },
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
      blogLikeList: [] as any[],
      timeOutEvent: -1,
      touch: false,
      allTouch: false,
      touchNumber: 0,
      shareShow: false,
      shareItem: {},
      goods_page: 1,
      blog_like_page: 1,
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
        getFavorite()
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
        getMyBlogLikeList()
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

        getFavorite()
        for (let i in state.rotate) {
          state.rotate[i] = 0
        }
      } else {
        state.leftSet = 0
        state.rightSet = 0
        getFavorite()
        for (let i in state.rotate) {
          state.rotate[i] = 0
        }
      }
    }

    const editHandle = () => {
      if (state.touch) {
        for (let i = 0; i < state.list.length; i++) {
          state.list[i].touch = false
        }
        state.touch = false
        state.allTouch = false
      } else {
        state.touch = !state.touch
        for (let i = 0; i < state.list.length; i++) {
          state.list[i].show = false
        }
      }
    }

    const setTouch = (index) => {
      state.list[index].touch = !state.list[index].touch
    }

    const setTouchAll = (allTouch) => {
      state.allTouch = !allTouch
      for (let i = 0; i < state.list.length; i++) {
        state.list[i].touch = state.allTouch
      }
    }

    const handleTouchend = (item, index) => {
      if (!state.touch) {
        routeUrl(item)
      } else if (state.touch) {
        setTouch(index)
      }
    }

    const deleteByMove = (index) => {
      if (state.getCurrent === 0) {
        fetchFavoriteRemove({
          goods_id: state.list[index].id,
        })
          .then((r) => {
            if (r.code === 0) {
              state.list.splice(index, 1)
            }
          })
          .catch((err) => console.log('fetchFavoriteRemove:', err))
      } else {
        // this.$request({
        //   url: this.$api.topic.favorite,
        //   data: {
        //     id: this.topicList[index].id,
        //     is_favorite: 'no_love',
        //   },
        //   method: 'post',
        // })
        // this.$delete(this.topicList, index)
      }
      uni.showToast({
        title: '取消收藏成功',
        icon: 'none',
      })
    }

    const routeUrl = (item) => {
      if (item.status_type !== 3) {
        uni.navigateTo({
          url: item.page_url,
        })
      }
    }

    const remove = () => {
      let goods_ids = [] as any[]
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].touch) {
          goods_ids.push(state.list[i].id)
        }
      }
      if (goods_ids.length === 0) return
      fetchFavoriteBatchRemove({
        goods_ids: JSON.stringify(goods_ids),
      })
      for (let i = 0; i < state.list.length; i++) {
        for (let j = 0; j < goods_ids.length; j++) {
          if (goods_ids[j] === state.list[i].id) {
            state.list.splice(i, 1)
          }
        }
      }
      uni.showToast({
        title: '取消收藏成功',
        icon: 'none',
      })
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

    const getMyBlogLikeList = (bool?) => {
      fetchMyBlogLikeList({ page: state.blog_like_page })
        .then((r) => {
          if (!bool) {
            state.blogLikeList = r.data.list
          } else {
            state.blogLikeList.push(...r.data.list)
          }
        })
        .catch((err) => console.log('fetchMyBlogLikeList:', err))
    }

    const moveName = ref('') as any

    /**
     * 滑动回调
     */
    const changeMoveName = (name) => {
      moveName.value = name
    }

    onLoad(() => {
      getCats()
      getFavorite()
    })

    onReachBottom(() => {
      if (state.getCurrent === 0) {
        state.goods_page++
        getFavorite(true)
      } else {
        state.blog_like_page++
        getMyBlogLikeList(true)
      }
    })

    watch(
      () => state.rotate,
      (data) => {
        if (data.left === 0 && data.right === 0) {
          state.show = false
        }
        if (data.left !== 0) {
          state.selectStatus = state.leftSet
        }
        if (data.right !== 0) {
          state.selectStatus = state.rightSet
        }
      },
      { deep: true }
    )

    watch(
      () => state.list,
      (data) => {
        let touch = 0
        for (let i = 0; i < data.length; i++) {
          if (data[i].touch) {
            touch++
          }
        }
        state.touchNumber = touch
        if (touch === data.length) {
          state.allTouch = true
        } else {
          state.allTouch = false
        }
      },
      { deep: true }
    )

    return {
      ...toRefs(state),
      tabs,
      theme,
      moveName,
      closeMask,
      emitHandle,
      setDef,
      setListStyle,
      setStatus,
      sureStatus,
      setCategory,
      changeMoveName,
      editHandle,
      deleteByMove,
      setTouch,
      setTouchAll,
      routeUrl,
      remove,
      handleTouchend,
    }
  },
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
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
    .good-list {
      padding-top: 166upx;
      visibility: visible;
      transition: all 0.3s ease-in-out;
      .f-radio {
        width: 85upx;
        height: 248upx;
        .f-radio-no {
          width: 40upx;
          height: 40upx;
        }
        .f-radio-yes {
          width: 40upx;
          height: 40upx;
        }
        .iconfont {
          font-size: 36rpx;
          color: $top-background-color;
        }
      }
      .f-item {
        width: 750upx;
        padding: 24upx;
        background-color: #fff;
        .f-img {
          width: 200upx;
          height: 200upx;
          border-radius: 23upx;
          margin-right: 24upx;
        }
        .f-content {
          width: 478upx;
        }
        .f-title {
          font-size: 26upx;
          color: #353535;
        }
        .f-invalid {
          width: 128upx;
          height: 42upx;
          line-height: 42upx;
          background-color: #f7f7f7;
          padding: 0 27upx 0 18upx;
          > text {
            font-size: 23upx;
            color: #999999;
          }
          > image {
            width: 24upx;
            height: 24upx;
          }
        }
        .f-low-stock {
          width: 148upx;
          height: 42upx;
          line-height: 42upx;
          background-color: #ffecec;
          padding: 0 27upx 0 18upx;
          > text {
            font-size: 23upx;
            color: #ff4544;
          }
          > image {
            width: 24upx;
            height: 24upx;
          }
        }
        .f-low-price {
          height: 42upx;
          line-height: 42upx;
          display: inline-block;
          background-color: #ffecec;
          padding: 0 27upx 0 18upx;
          position: relative;
          font-size: 23upx;
          color: #ff4544;
          > text {
            font-size: 23upx;
            color: #ff4544;
            vertical-align: center;
          }
          image {
            width: 24upx;
            height: 24upx;
            margin-right: 14upx;
          }
        }
        .f-delete-icon {
          width: 46upx;
          height: 50upx;
          padding: 8upx;
        }
        .f-share-icon {
          width: 46upx;
          height: 46upx;
          padding: 8upx;
          margin-right: 10upx;
        }
        .f-price {
          font-size: 24upx;
          margin-top: 12upx;
        }
        .f-scale {
          font-size: 21upx;
          color: #b0b0b0;
        }
      }

      .f-list {
        padding: 0 20upx;
        .f-list-item {
          height: 492upx;
          width: 344upx;
          border-radius: 12upx;
          margin-top: 14upx;
          background-color: #fff;
          overflow: hidden;
        }
        .f-list-item:nth-child(odd) {
          margin-right: 15upx;
        }
        .f-img {
          width: 344upx;
          height: 344upx;
          position: relative;
          > image {
            width: 344upx;
            height: 344upx;
          }
          .f-radio {
            width: 40upx;
            height: 40upx;
            border-radius: 50%;
            position: absolute;
            top: 10upx;
            right: 10upx;
            .f-kon {
              width: 40upx;
              height: 40upx;
            }
            .f-touch {
              width: 40upx;
              height: 40upx;
              z-index: 1;
            }
          }
        }
        .f-invalid {
          width: 112upx;
          background-image: url('./image/invalid.png');
        }
        .f-low-price {
          width: 112upx;
          background-image: url('./image/low_price.png');
        }
        .f-low-stock {
          width: 152upx;
          background-image: url('./image/low_stock.png');
        }
        .f-icon {
          bottom: 24upx;
          left: 0;
          height: 46upx;
          padding: 0 18upx 0 17upx;
          position: absolute;
          border-top-right-radius: 25upx;
          border-bottom-right-radius: 25upx;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .f-text {
          width: 100%;
          height: 148upx;
          padding-bottom: 10upx;
          > text {
            font-size: 26upx;
            padding: 18upx 23upx 0 23upx;
          }
          > view {
            padding: 0 23upx 0 23upx;
            margin-bottom: 18upx;
          }
          .f-price {
            font-size: 21upx;
          }
          .f-sales {
            font-size: 23upx;
            color: #999999;
          }
        }
      }
      .f-delete-box {
        width: 100%;
        height: 100upx;
      }
      .f-delete {
        position: fixed;
        width: 100%;
        height: 100upx;
        border-top: 1px solid #e2e2e2;
        background-color: #ffffff;
        z-index: 8;
        left: 0;
        transition: all 0.3s ease-in-out;
        font-size: 26upx;
        padding: 0 24upx;
        > button {
          width: 138upx;
          height: 64upx;
          line-height: 64upx;
          border-radius: 32upx;
          background-color: #ffffff;
          margin: 0;
          border-width: 1upx;
          border-style: solid;
          transform: rotateZ(360deg);
        }
        .f-button-m {
          border-color: #999999;
          color: #999999;
        }
        .f-button-t {
          border-color: #ff4544;
          color: #ff4544;
        }
        > view {
          width: 103upx;
          .f-radio {
            width: 40upx;
            height: 40upx;
            border-radius: 50%;
            margin-right: 10upx;
            .f-kon {
              width: 40upx;
              height: 40upx;
            }
            .f-touch {
              width: 40upx;
              height: 40upx;
            }
            .iconfont {
              font-size: 36rpx;
              color: $top-background-color;
            }
          }
        }
      }
      .f-delete-show {
        bottom: 0;
        visibility: visible;
      }
      .f-delete-hidden {
        bottom: -101upx;
        visibility: hidden;
      }

      &.good-show {
        opacity: 1;
        visibility: visible;
      }
      &.good-hidden {
        opacity: 0;
        visibility: hidden;
      }
    }
    .blog-like-list {
      padding-top: 126upx;
      visibility: visible;
      transition: all 0.3s ease-in-out;
      padding-left: 20rpx;
      padding-right: 20rpx;
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
