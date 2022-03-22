<template>
  <view class="container">
    <view class="label-title">全部评论（{{ comment_total_count }}）</view>
    <view class="list-wrap">
      <block v-for="(item, index) in list" :key="index">
        <view class="item-wrapper">
          <moveBox :index="item.id" :move-name="moveName" @changeMoveName="changeMoveName" @action="deleteByMove">
            <view class="cell-item">
              <image :src="item.user.userInfo.avatar" />
              <view class="detail">
                <view class="header-box">
                  <view class="nickname">{{ item.user.nickname }}</view>
                  <view class="fabulous" :class="item.is_liked ? 'on' : ''"
                    >{{ item.like_count === '0' ? '赞' : item.like_count }}
                    <text class="iconfont" :class="item.is_liked ? 'icon-good-fill' : 'icon-good'"></text
                  ></view>
                </view>
                <view class="content">{{ item.content }}</view>
                <view class="footer"> {{ item.created_at }} </view>
              </view>
            </view>
          </moveBox>
        </view>
      </block>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import BlogItem from '@/components/blog-item/blog-item.vue'
import moveBox from '@/components/move-box/index.vue'
import { fetchBlogCommentMyList, fetchBlogCommentDelete } from '@/api/blog'
import { Tips } from '@/utils/util'

const moveName = ref('') as any

/**
 * 滑动回调
 */
const changeMoveName = (name) => {
  moveName.value = name
}

const list = ref([]) as any
const comment_total_count = ref(0)
const getList = () => {
  const param = {
    page: 1,
    limit: 10,
  }
  fetchBlogCommentMyList(param)
    .then((r) => {
      if (r.code === 0) {
        list.value = r.data.list
        comment_total_count.value = r.data.pagination.total_count
      }
    })
    .catch((err) => console.log(err))
}

/**
 * 滑动删除商
 */
const deleteByMove = (id) => {
  uni.showModal({
    title: '评论删除确认',
    content: `您确定要删除该评论吗`,
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

onLoad((options) => {
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
    margin-bottom: 20rpx;
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
    margin-left: 40rpx;
    margin-right: 40rpx;
    .item-wrapper {
      position: relative;
      overflow: hidden;
      padding: 8rpx 0;
      .cell-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-bottom: 44rpx;
        background-color: #fff;
        image {
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
            justify-content: space-between;
            font-size: 30rpx;
            .nickname {
              color: #1aa86c;
            }
            .fabulous {
              width: 80rpx;
              height: 40rpx;
              line-height: 40rpx;
              color: #9a9a9a;
              .iconfont {
                font-size: 32rpx;
              }
              &.on {
                color: #1aa86c;
              }
            }
          }
          .content {
            font-size: 32rpx;
            color: #333;
            text-align: justify;
            padding-top: 8rpx;
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
      }
    }
  }
}
</style>
