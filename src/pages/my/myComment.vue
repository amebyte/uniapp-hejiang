<template>
  <view class="container">
    <!--提示 start-->
    <MessageModal v-if="isShowMessage" @closeMessage="closeMessage"> </MessageModal>
    <!--提示 end-->
    <view class="label-title">全部评论（{{ comment_total_count }}）</view>
    <view class="list-wrap">
      <block v-for="(item, index) in list" :key="index">
        <view class="item-wrapper">
          <moveBox :index="item.id" :move-name="moveName" @changeMoveName="changeMoveName" @action="deleteByMove">
            <view class="cell-item">
              <image :src="item.user.userInfo.avatar" class="avatar" />
              <view class="detail">
                <view class="header-box">
                  <view class="nickname">{{ item.user.nickname }}</view>
                  <view class="desc"><text>评论了您的作品</text></view>
                </view>
                <view class="content">{{ item.content }}</view>
                <view class="footer"> {{ item.created_at }} </view>
              </view>
              <view class="thumb" @click="gotoDiscuss(item.blog)">
                <image :src="item.blog.images[0]" mode="aspectFill" class="thumb" />
              </view>
            </view>
          </moveBox>
        </view>
      </block>
      <template v-if="list.length === 0">
        <view class="no-list">
          <AppNoGoods background="#f7f7f7" :title="'暂无相关评论'" color="#999999" :is-image="1" />
        </view>
      </template>
      <block v-if="list.length > 0">
        <LoadBar :txt="loadTitle" :loading="loading" />
      </block>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import BlogItem from '@/components/blog-item/blog-item.vue'
import moveBox from '@/components/move-box/index.vue'
import LoadBar from '@/components/load-bar/load-bar.vue'
import { fetchBlogCommentMyList, fetchBlogCommentDelete } from '@/api/blog'
import { Tips } from '@/utils/util'
import MessageModal from './component/MessageModal.vue'
import AppNoGoods from '@/components/app-no-goods/app-no-goods.vue'
import Cache from '@/utils/cache'

const moveName = ref('') as any

/**
 * 滑动回调
 */
const changeMoveName = (name) => {
  moveName.value = name
}

const loading = ref(true)
const loadTitle = ref('加载更多')
const page = ref(1)
const list = ref([]) as any
const comment_total_count = ref(0)
const getList = () => {
  const param = {
    page: page.value,
    limit: 10,
  }
  fetchBlogCommentMyList(param)
    .then((r) => {
      if (r.code === 0) {
        if (r.data.list.length !== 0) {
          page.value++
          list.value = list.value.concat(r.data.list)
          comment_total_count.value = r.data.pagination.total_count
        } else {
          loading.value = false
          loadTitle.value = '已经到底了~'
        }
      }
    })
    .catch((err) => console.log(err))
}

/**
 * 滑动删除
 */
const deleteByMove = (id) => {
  uni.showModal({
    title: '评论删除确认',
    content: `您确定要删除该评论吗？`,
    success: (e) => {
      if (e.confirm) {
        fetchBlogCommentDelete({ id })
          .then((r) => {
            if (r.code === 0) {
              getList()
            }
          })
          .catch((err) => console.log(err))
      }
    },
  })
}

let isShowMessage = ref(true)
const closeMessage = () => {
  isShowMessage.value = false
  Cache.set('isShowMessageMyComment', 'false')
}

const gotoDiscuss = (item) => {
  uni.navigateTo({
    url: `/pages/discover/discuss?id=${item.id}`,
  })
}

onLoad((options) => {
  getList()
  const flag = Cache.get('isShowMessageMyComment')
  isShowMessage.value = flag === 'false' ? false : true
})
onReachBottom(() => {
  getList()
})
</script>
<style lang="scss">
.container {
  .blog-content {
  }
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
      .cell-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 20rpx;
        background-color: #fff;
        border-radius: 10rpx;
        .avatar {
          width: 64rpx;
          height: 64rpx;
          border-radius: 32rpx;
          display: block;
          flex-shrink: 0;
        }
        .detail {
          flex: 1;
          padding-left: 16rpx;
          box-sizing: border-box;
          .header-box {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            font-size: 30rpx;
            .nickname {
              color: #1aa86c;
              padding-right: 10rpx;
            }
            .desc {
              font-size: 24rpx;
            }
          }
          .content {
            font-size: 24rpx;
            color: #333;
            text-align: justify;
            padding-top: 8rpx;
            padding-right: 20rpx;
            word-break: break-all;
            word-wrap: break-word;
          }
          .footer {
            display: flex;
            align-items: center;
            font-size: 24rpx;
            margin-top: 16rpx;
            color: #9a9a9a;
          }
        }
        .thumb {
          width: 100rpx;
          height: 100rpx;
        }
      }
    }
    .no-list {
      margin-top: 120rpx;
    }
  }
}
</style>
