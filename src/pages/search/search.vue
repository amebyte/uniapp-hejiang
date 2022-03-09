<template>
  <view class="app-layout" :style="{ background: isSearch ? '#f7f7f7' : '#fafafa' }">
    <view class="search">
      <view class="top">
        <view class="dir-left-nowrap box">
          <input v-model="keyword" type="text" class="box-grow-1 input" confirm-type="搜索" @confirm="search" />
          <view class="close-tip" @click="clear">
            <image v-if="keyword" class="search-close" src="/static/icon/delete-yuan.png"></image>
          </view>
          <view class="box-grow-0 cross-center" @click="search">搜索</view>
        </view>
      </view>
      <!-- hidden -->
      <view style="height: 104rpx"></view>
      <view class="hot opacity-hide">
        <view v-if="historyList.length > 0" class="history">
          <view class="dir-left-wrap list">
            <block v-for="(item, index) in historyList" :key="index">
              <view class="box-grow-0 cross-center item once-item">
                <view class="t-omit" style="max-width: 650rpx">{{ item.keyword }}</view>
              </view>
            </block>
          </view>
        </view>
      </view>
      <!-- -->
      <view v-show="!isSearch" class="hot">
        <!-- 历史记录 -->
        <view v-if="historyList.length > 0" class="history">
          <view class="dir-left-nowrap cross-center title">
            <view class="box-grow-1">历史搜索</view>
            <image src="/static/icon/delete.png" class="box-grow-0" @click="deleteHistory"></image>
          </view>
          <view class="dir-left-wrap list">
            <view class="dir-top-nowrap">
              <view v-for="(line, temp_index) in realHistoryList" :key="temp_index" class="dir-left-wrap box-grow-1">
                <view v-for="(item, index) in line" :key="index" class="dir-left-wrap">
                  <view v-if="!item.mark" class="box-grow-0 cross-center item" @click="historyClick(item.keyword)">
                    <view class="t-omit" style="max-width: 650rpx">{{ item.keyword }}</view>
                  </view>
                  <view
                    v-if="item.mark && temp_index === 1"
                    class="box-grow-0 close-pic cross-center"
                    @click="selectAllList"
                  >
                    <image src="./image/icon_open.png"></image>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 热搜 -->
        <view v-if="getSetting.is_show_hot_goods == 1 && sign === 'goods'" class="hot-center">
          <image class="top-image" src="./image/icon_top.png"></image>
          <view v-if="hotGoodsList && hotGoodsList.length" class="top-list">
            <view
              v-for="(goods, index) in hotGoodsList"
              :key="index"
              class="item cross-center dir-left-nowrap"
              @click="goodsNav(goods.url)"
            >
              <view class="box-grow-0 main-center first">
                <image
                  v-if="goods.sort < 4"
                  :src="
                    goods.sort === 1
                      ? './image/list_icon_first.png'
                      : goods.sort === 2
                      ? './image/list_icon_second.png'
                      : './image/list_cion_third.png'
                  "
                ></image>
                <view v-if="goods.sort > 3">{{ goods.sort }}</view>
              </view>
              <view class="goods-image box-grow-0">
                <image :src="goods.cover_pic"></image>
              </view>
              <view class="goods-name t-omit">{{ goods.title }}</view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="isSearch" class="goods-list">
        <template v-if="list.length <= 0">
          <view class="main-center no-result">
            <view class="dir-left-nowrap cross-center">
              <image class="box-grow-0 empty" src="/static/icon/empty.png"></image>
              <view class="box-grow-1">
                <view>抱歉，没有相关商品</view>
                <view v-if="!mch_id" class="text"></view>
              </view>
            </view>
          </view>
        </template>
      </view>
      <view v-if="loading" class="u-loading-list">加载中...</view>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import { store } from '@/store'
let page = 1
let is_loading = false
let is_no_more = false

export default defineComponent({
  name: 'SearchPage',
  setup() {
    const state = reactive({
      hotGoodsList: [],
      list: [] as any[],
      isSearch: false,
      historyList: [],
      keyword: '',
      recommend_list: [],
      mch_id: 0 as any,
      beginAfter: true,
      tempList: [],
      realHistoryList: [] as any[],
      loading: false,
      goodsReset: false,
      attrGoods: {
        attrShow: 0,
        goods: null,
      },
      submitUrl: '',
      previewUrl: '',
      sign: '',
      url: '',
    })
    const getSetting = computed(() => store.state.mallConfig.mall.setting)
    const getTheme = store.state.mallConfig.theme_color

    const newList = computed(() => {
      if (state.list.length > 0) {
        return state.list
      } else {
        return state.recommend_list
      }
    })

    const sizeTransform = computed(() => {
      const windowWidth = uni.getSystemInfoSync().windowWidth
      const p = 750 / windowWidth
      const boxLeft = 24 / p
      const marginRight = 20 / p
      const btnWidth = 60 / p
      const listWidth = windowWidth - boxLeft * 2
      return {
        p,
        boxLeft,
        marginRight,
        btnWidth,
        listWidth,
      }
    })

    const isListUnderlinePrice = computed(() => store.state.mallConfig.mall.setting.is_list_underline_price)

    const getSelect = async () => {
      const historyList = state.historyList
      if (historyList && historyList.length) {
        const self = this
        // #ifdef MP-WEIXIN || H5
        let time = 0
        // #endif
        // #ifndef MP-WEIXIN || H5
        let time = 500
        // #endif
        setTimeout(() => {
          // #ifndef MP-WEIXIN
          let query = uni.createSelectorQuery()
          // #endif
          // #ifdef MP-WEIXIN
          let query = uni.createSelectorQuery().in(this)
          // #endif
          query
            .selectAll('.once-item')
            .fields(
              {
                size: true,
              },
              function (res) {
                self.formatData(res)
                if (self.beginAfter) {
                  self.selectLimitList(res)
                } else {
                  self.selectAllList()
                }
              }
            )
            .exec()
        }, time)
      }
    }

    const formatData = (res) => {
      const self = this
      const historyList = state.historyList
      const { marginRight, listWidth } = sizeTransform.value

      //列表格式化
      let tempList = [] as any[]
      let item = []
      let line_width = 0
      for (let i = 0; i < res.length; i++) {
        const alone_width = res[i].width + marginRight
        let alone_width_count = alone_width + line_width
        if (alone_width_count <= listWidth) {
          item.push(historyList[i])
          line_width = alone_width_count
        } else {
          if (item.length === 0 && line_width === 0) {
            tempList.push([historyList[i]])
          } else {
            tempList.push(item)
            line_width = 0
            item = []
            i--
          }
        }
      }
      if (item.length) {
        tempList.push(item)
      }
      state.tempList = tempList
    }

    const selectLimitList = (res) => {
      const self = this
      const { btnWidth, listWidth, marginRight } = sizeTransform.value
      let newArr = JSON.parse(JSON.stringify(state.tempList))
      let realHistoryList = [] as any[]
      if (newArr.length > 2) {
        let indexMore = 0
        const secondWidth = listWidth - btnWidth - marginRight
        let maxWidth = 0
        newArr[1].forEach((item, index) => {
          maxWidth += res[newArr[0].length + index].width + marginRight
          if (maxWidth <= secondWidth) {
            indexMore = index + 1
          }
        })
        newArr[1].splice(indexMore, newArr[1].length - indexMore, {
          mark: true,
        })
        realHistoryList = [newArr[0], newArr[1]]
        state.beginAfter = true
      } else {
        //newArr.forEach(item => realHistoryList = [...realHistoryList, ...item]);
        newArr.forEach((item) => realHistoryList.push(item))
        state.beginAfter = false
      }
      state.realHistoryList = realHistoryList
    }

    const selectAllList = () => {
      const tempList = state.tempList
      let arr = []
      if (tempList && tempList.length) {
        for (let i = 0; i < 5 && i < tempList.length; i++) {
          arr.push(tempList[i])
        }
      }
      state.beginAfter = false
      state.realHistoryList = arr
    }

    const goodsNav = (url) => {
      uni.navigateTo({ url: url })
    }

    const clear = () => {
      uni.hideKeyboard()
      state.keyword = ''
      state.loading = false
    }

    const getHotSearch = () => {
      if (getSetting.value.is_show_hot_goods != 1) {
        return
      }
      this.$request({
        url: this.$api.goods.hot_search,
      }).then((response) => {
        state.hotGoodsList = response.data.list
      })
    }

    const cancel = () => {
      state.isSearch = false
      state.loading = false
      state.keyword = ''
      state.list = []
    }

    const reset = () => {
      page = 1
      is_no_more = false
      state.goodsReset = true
      getGoodsList()
    }

    const search = () => {
      let keyword = state.keyword
      if (keyword === '') return
      state.keyword = keyword.trim()
      setHistory()
      getSelect()
      reset()
    }

    const getGoodsList = () => {
      if (!state.keyword) return
      if (is_loading) return
      is_loading = true
      this.$request({
        url: state.url,
        data: {
          keyword: state.keyword,
          mch_id: state.mch_id,
          page: page,
        },
      })
        .then((response) => {
          is_loading = false
          state.isSearch = true
          state.loading = false
          let { code, data, msg } = response
          if (code === 0) {
            if (page === 1) state.list = []
            if (data.list.length > 0) {
              state.list.push(...data.list)
              page++
            } else {
              is_no_more = true
              if (page === 1) getRecommend()
            }
          } else {
            uni.showModal({
              content: msg,
            })
          }
        })
        .catch(() => {
          is_loading = false
        })
    }

    const setHistory = () => {
      let historyList = getHistory()
      let keyword = state.keyword.trim()

      historyList.forEach((item, index) => {
        if (item.keyword === keyword) historyList.splice(index, 1)
      })
      historyList.unshift({
        keyword: keyword,
      })
      if (historyList.length > 20) historyList.pop()
      state.historyList = historyList
      uni.setStorageSync('SEARCH_HISTORY_LIST', historyList)
    }

    const getHistory = () => {
      let historyList = uni.getStorageSync('SEARCH_HISTORY_LIST')
      if (!historyList) historyList = []
      return historyList
    }

    const deleteHistory = () => {
      let self = this
      uni.showModal({
        content: '确认删除全部历史记录？',
        success: function (res) {
          if (res.confirm) {
            uni.removeStorageSync('SEARCH_HISTORY_LIST')
            state.historyList = []
          }
        },
      })
    }

    const historyClick = (keyword) => {
      state.keyword = keyword.trim()
      reset()
    }

    const getRecommend = () => {
      if (state.mch_id) return
      if (state.recommend_list.length > 0) return
      this.$request({
        url: this.$api.goods.new_recommend,
        data: {
          goods_id: 0,
          type: 'goods',
        },
      }).then((response) => {
        if (response.code === 0) state.recommend_list = response.data.list
      })
    }

    const buyProduct = ({ goods, attrShow }) => {
      state.attrGoods.goods = goods
      setTimeout(() => {
        state.attrGoods.attrShow = attrShow
      })
    }

    onLoad((options) => {
      state.mch_id = options.mch_id ? options.mch_id : 0
      state.sign = options.sign ? options.sign : 'goods'
      if (state.sign === 'goods') {
        state.url = this.$api.default.goods_list
      } else if (state.sign === 'pt') {
        state.url = this.$api.pt.goods
      } else if (state.sign === 'wholesale') {
        state.url = this.$api.wholesale.index
      }
      page = 1
      is_loading = false
      is_no_more = false
      state.historyList = getHistory()
      getSelect()
      getRecommend()
      getHotSearch()
    })

    onReachBottom(() => {
      if (is_no_more) {
        console.log('xxx')
      } else {
        state.goodsReset = false
        if (state.keyword) {
          state.loading = true
          getGoodsList()
        }
      }
    })

    return {
      ...toRefs(state),
      getTheme,
      getSetting,
      newList,
      sizeTransform,
      isListUnderlinePrice,
    }
  },
  watch: {
    keyword: {
      handler(v) {
        if (v == '') {
          this.cancel()
        }
      },
      immediate: true,
    },
  },
})
</script>

<style scoped lang="scss">
.opacity-hide {
  position: fixed;
  top: 0;
  z-index: -10;
  opacity: 0;
  overflow: hidden;
}

.search {
  background-color: #efeff4;
}

.close-pic {
  margin-right: 20rpx;
  margin-bottom: 16rpx;
  border-radius: 50%;

  image {
    height: 60rpx;
    width: 60rpx;
    display: block;
  }
}

.hot {
  background-color: #fafafa;
  border-radius: 16rpx;

  .hot-center {
    padding: 32rpx 24rpx;

    .top-image {
      width: 159rpx;
      height: 25rpx;
      display: block;
    }

    .top-list {
      margin-top: 32rpx;
      border-radius: 16rpx;
      padding: 32rpx - 10rpx 0;
      box-shadow: 0 0 12rpx 0 #e0e0e0;

      .item {
        height: 110rpx;

        .first {
          width: 120rpx;
          font-weight: bold;

          image {
            width: 48rpx;
            height: 43rpx;
            display: block;
          }

          view {
            color: #999999;
            font-size: 26rpx;
          }
        }

        .goods-image {
          image {
            height: 90rpx;
            width: 90rpx;
            display: block;
            border-radius: 8rpx;
          }
        }

        .goods-name {
          color: #333333;
          font-size: 26rpx;
          margin: 0 24rpx;
        }
      }
    }
  }
}

.app-layout {
  min-height: 100vh;
}

.top {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 15;
  padding: 20rpx 24rpx;
  background-color: #efeff4;
  font-size: $uni-font-size-import-two;
  color: $uni-general-color-one;

  .input {
    background-color: #ffffff;
    border-radius: 50rpx 0 0 50rpx;
    padding: 0 32rpx;
    font-size: $uni-font-size-general-one;
    height: 64rpx;
  }

  .box {
    position: relative;

    .close-tip {
      width: 64rpx;
      height: 64rpx;
      background-color: #ffffff;
      border-radius: 0 50rpx 50rpx 0;
      margin-right: 20rpx;
    }

    .search-close {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      margin: 16rpx;
    }
  }

  .radio {
    margin-top: 32rpx;

    .radio-item {
      padding-bottom: 12rpx;
    }

    .active {
      border-bottom: 4rpx solid;
    }
  }
}

.history {
  padding: 36rpx 24rpx;
  border-radius: 16rpx 16rpx 0 0;
  background-color: #ffffff;
  font-size: $uni-font-size-general-one;

  .title {
    padding-bottom: 24rpx;
    color: $uni-general-color-one;

    image {
      width: 28rpx;
      height: 34rpx;
      display: block;
    }
  }

  .list {
    .item {
      height: 64rpx;
      background-color: #f7f7f7;
      padding: 0 20rpx;
      margin-right: 20rpx;
      margin-bottom: 16rpx;
      border-radius: 32rpx;
    }
  }
}

.goods-list {
  .no-result {
    height: 156rpx;
    padding: 28rpx 0;
    font-size: $uni-font-size-general-one;
    background-color: #ffffff;

    .text {
      color: $uni-general-color-two;
    }

    .empty {
      width: 100rpx;
      height: 100rpx;
      display: block;
      margin-right: 40rpx;
    }
  }
}
.u-loading-list {
  height: 64upx;
  line-height: 64upx;
  text-align: center;
  color: #b0b0b0;
  font-size: 24upx;
  background-color: #f7f7f7;
}
</style>
