<template>
  <view class="item">
    <view class="recommend" style="display: none"><text>精选</text></view>
    <view class="user-info">
      <view class="profile">
        <view class="l" @click="gotoMyBlog">
          <image :src="item.user.userInfo.avatar" mode="scaleToFill"></image>
        </view>
        <view class="r" @click="gotoMyBlog">
          <view class="name">{{ item.user.nickname }}</view>
          <view class="desc">{{ item.created_at }}</view>
        </view>
      </view>
      <view class="more-wrap">
        <view v-if="isDel" class="more" @click="toggleDelBtn">
          <text class="iconfont icon-more"></text>
        </view>
        <view v-if="isShowDel" class="del">删除</view>
      </view>
    </view>
    <view class="text-content" @click="gotoDiscuss(item)">
      {{ item.content }}
    </view>
    <view class="image-list">
      <block v-for="(val, index) in item.images" :key="index">
        <view class="image">
          <image :src="val" mode="scaleToFill" @click="previewImage(index)"></image>
        </view>
      </block>
    </view>
    <view class="interact-status">
      <view class="status" :class="item.is_liked ? 'on' : ''" @click="handleLike(item)">
        <text class="iconfont" :class="item.is_liked ? 'icon-love-fill' : 'icon-love'"></text>
        <text class="txt">{{ item.like_count === '0' ? '赞' : item.like_count }}</text>
      </view>
      <view class="status" @click="gotoDiscuss(item)">
        <text class="iconfont icon-comment"></text>
        <text class="txt">{{ item.comment_count }}</text>
      </view>
      <view class="status">
        <text class="iconfont icon-uninterested"></text>
        <text class="txt">不感兴趣</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { fetchBlogLikeSave, fetchBlogLikeDelete } from '@/api/blog'
const props = defineProps({
  item: { type: Object, required: true },
  isDetail: { type: Boolean },
  isDel: { type: Boolean },
  isList: { type: Boolean },
})
const emits = defineEmits(['getList'])
const gotoDiscuss = (item) => {
  if (!props.isDetail) {
    uni.navigateTo({
      url: `/pages/discover/discuss?id=${item.id}`,
    })
  }
}

const gotoMyBlog = () => {
  if (props.isList) {
    uni.navigateTo({
      url: `/pages/my/myBlog?userid=${props.item.user_id}`,
    })
  }
}

const isShowDel = ref(false)
const toggleDelBtn = () => {
  isShowDel.value = !isShowDel.value
}

const handleLike = (item) => {
  const param = {
    blog_id: item.id,
    comment_id: item.id,
  }
  if (item.is_liked) {
    fetchBlogLikeDelete({ id: item.blogLike.id, ...param })
      .then((r) => {
        if (r.code === 0) {
          emits('getList')
        }
      })
      .catch((err) => console.log(err))
  } else {
    fetchBlogLikeSave({ id: item.blogLike && item.blogLike.id, is_delete: 0, ...param })
      .then((r) => {
        if (r.code === 0) {
          emits('getList')
        }
      })
      .catch((err) => console.log(err))
  }
}

// 图片预览
const previewImage = (index) => {
  let imageList = props.item.images
  uni.previewImage({
    current: imageList[index],
    urls: imageList,
  })
}
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.item {
  padding: 20rpx;
  box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  .recommend {
    text {
      background-color: #80c269;
      border-radius: 7rpx;
      font-size: 19rpx;
      font-family: Hiragino Sans GB;
      font-weight: bold;
      font-style: italic;
      color: #ffffff;
      padding: 5rpx 10rpx;
    }
  }
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .profile {
      display: flex;
      justify-content: flex-start;
      padding: 30rpx 20rpx;
      padding-left: 0;
      padding-bottom: 20rpx;
      > .l {
        image {
          width: 66rpx;
          height: 66rpx;
          border-radius: 50%;
        }
      }
      > .r {
        padding-left: 20rpx;
        .name {
          font-size: 28rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #80c269;
          @extend .line1;
        }
        .desc {
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #a6a6a6;
          @extend .line1;
        }
      }
    }
    .more-wrap {
      position: relative;
      .more {
        width: 40rpx;
        overflow: hidden;
        margin-left: 10rpx;
        .icon-more {
          font-size: 60rpx;
          color: #bfbfbf;
        }
      }
      .del {
        position: absolute;
        bottom: -60rpx;
        right: -20rpx;
        width: 80rpx;
        font-size: 28rpx;
        text-align: center;
        border: 2rpx solid #80c269;
        color: #80c269;
        border-radius: 5rpx;
        padding-top: 10rpx;
        padding-bottom: 10rpx;
      }
    }
  }
  .text-content {
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #050505;
    line-height: 40rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
  }
  .image-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    .image {
      width: 193rpx;
      height: 193rpx;
      border-radius: 7rpx;
      margin-bottom: 20rpx;
      image {
        width: 100%;
        height: 100%;
        border-radius: 7rpx;
      }
    }
  }
  .interact-status {
    display: flex;
    justify-content: flex-start;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    padding-left: 20rpx;
    > .status {
      margin-right: 40rpx;
      color: #a6a6a6;
      .iconfont {
        font-size: 50rpx;
      }
      .txt {
        font-size: 21rpx;
        font-family: Hiragino Sans GB;
        font-weight: bold;
        padding-left: 10rpx;
      }
      &.on {
        color: #80c269;
      }
    }
  }
}
</style>
