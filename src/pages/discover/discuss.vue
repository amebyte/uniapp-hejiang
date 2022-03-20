<template>
  <view class="container">
    <view class="label-title">全部评论（{{ comment_total_count }}）</view>
    <view class="list-wrap">
      <block v-for="(item, index) in list" :key="index">
        <view class="cell-item">
          <image :src="item.user.userInfo.avatar" class="avatar"></image>
          <view class="detail">
            <view class="header-box">
              <view class="nickname">{{ item.user.nickname }}</view>
              <view class="fabulous" @click="handleLike(item)"
                >{{ item.like_count }} <text class="iconfont icon-good"></text
              ></view>
            </view>
            <view class="content">{{ item.content }}</view>
            <view class="footer"> {{ item.created_at }} </view>
          </view>
        </view>
      </block>
    </view>
    <view class="operation">
      <view class="operation-left">
        <textarea
          v-model="content"
          class="textarea"
          placeholder="请发表您的评论"
          maxlength="2000"
          placeholder-class="phcolor-color"
          auto-focus
        />
      </view>
      <view class="operation-right">
        <view class="sumbit" @click="sumbit">发布</view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import { fetchBlogCommentList, fetchBlogCommentSave, fetchBlogCommentLikeSave } from '@/api/blog'
import { Tips } from '@/utils/util'

const id = ref('') as any
const content = ref('')

const list = ref([]) as any
const comment_total_count = ref(0)
const getList = () => {
  const param = {
    page: 1,
    limit: 10,
  }
  fetchBlogCommentList(param)
    .then((r) => {
      if (r.code === 0) {
        list.value = r.data.list
        comment_total_count.value = r.data.pagination.total_count
      }
    })
    .catch((err) => console.log(err))
}

const handleLike = (item) => {
  const param = {
    blog_id: id.value,
    comment_id: item.id,
  }
  fetchBlogCommentLikeSave(param)
    .then((r) => {})
    .catch((err) => console.log(err))
}

const sumbit = () => {
  if (!content.value) {
    Tips({ title: '请填写评论内容' })
    return
  }
  fetchBlogCommentSave({
    content: content.value,
    blog_id: id.value,
  })
    .then((r) => {
      if (r.code === 0) {
        Tips({ title: '评论成功' })
        content.value = ''
      }
    })
    .catch((err) => console.log(err))
}

onLoad((options) => {
  id.value = options.id
  getList()
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
    .cell-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding-bottom: 44rpx;
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
          justify-content: space-between;
          font-size: 30rpx;
          .nickname {
            color: #1aa86c;
          }
          .fabulous {
            color: #9a9a9a;
            .iconfont {
              font-size: 32rpx;
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
  .operation {
    width: 100%;
    height: 100rpx;
    overflow: hidden;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99999;
    padding-bottom: env(safe-area-inset-bottom);
    .operation-left {
      .textarea {
        height: 80rpx;
        background: #ededed;
        color: #999;
        border-radius: 8rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        box-sizing: border-box;
        padding-top: 20rpx;
      }
    }
    .operation-right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1aa86c;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      border-top: 1rpx solid #eaeef1;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-top-width: 0.5px;
      border-top-style: solid;
      border-top-color: rgb(234, 238, 241);
    }
  }
}
</style>
