<template>
  <view class="container">
    <!--top-bar start-->
    <view class="top-bar">
      <view class="search-icon">
        <text class="iconfont icon-search"></text>
      </view>
      <view class="title"></view>
      <view class="action" @click="submit">
        <text>发布</text>
      </view>
    </view>
    <!--top-bar end-->
    <view class="cells">
      <textarea
        class="textarea"
        name="content"
        placeholder="分享你的学习成果或者作业吧！ #作业题目"
        maxlength="2000"
        placeholder-class="phcolor-color"
        auto-focus
      />
      <view class="textarea-counter">0/1000</view>
    </view>
    <view class="upload-image-wrap">
      <app-upload-image :max-num="maxNum" background-color="#fff" @imageEvent="imageEvent"> </app-upload-image>
    </view>
    <view class="cat-btn-wrap">
      <view class="cat-btn" @click="toggleCatWrap">
        <view class="l">
          <view class="icon">＃</view>
          <view class="txt">{{ currCat.title }}</view>
        </view>
        <view class="r">
          <text class="iconfont icon-arrow-down"></text>
        </view>
      </view>
      <view v-if="isShowCat" class="cat-item">
        <block v-for="(item, index) in catList" :key="index">
          <view class="item" :class="item.id === currCat.id ? 'on' : ''" @click="selectCat(item)"
            >＃{{ item.title }}</view
          >
        </block>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import appUploadImage from '@/components/app-upload-image/app-upload-image.vue'
import { fetchBlogTagList } from '@/api/blog'

const maxNum = ref(9)
const imageList = ref([])
const imageEvent = (e) => {
  imageList.value = e.imageList
}
const catList = ref([
  { id: 1, title: '水培' },
  { id: 2, title: '水培水培' },
  { id: 3, title: '水培水' },
  { id: 4, title: '水培' },
  { id: 5, title: '水培水培水培' },
  { id: 6, title: '水培' },
  { id: 7, title: '水培水培' },
  { id: 8, title: '水培水' },
])
const isShowCat = ref(false)
const toggleCatWrap = () => {
  isShowCat.value = !isShowCat.value
}
const currCat = ref({
  id: null,
  title: '选择作业题目',
})
const selectCat = (item) => {
  currCat.value = item
}

const getBlogTagList = () => {
  const param = { page: 1, limit: 99 }
  fetchBlogTagList(param)
    .then((r) => {
      catList.value = r.data.list
    })
    .catch((err) => console.log(err))
}
const submit = () => {}
onMounted(() => {
  getBlogTagList()
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  padding-top: 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .top-bar {
    display: flex;
    justify-content: space-between;
    color: $theme-font-color;
    margin-left: 20rpx;
    margin-right: 20rpx;
    margin-bottom: 30rpx;
    .search-icon {
      padding-left: 15rpx;
      .icon-search {
        font-size: 32rpx;
      }
    }
    .title {
      font-size: 28rpx;
    }
    .action {
      text {
        border: 2rpx solid #009688;
        border-radius: 20rpx;
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #00796b;
        padding: 5rpx 20rpx;
      }
    }
  }
  .cells {
    border-radius: 4rpx;
    height: 280rpx;
    box-sizing: border-box;
    position: relative;
    margin-left: 20rpx;
    margin-right: 20rpx;
    .textarea {
      height: 210rpx;
      width: 94%;
      color: #666;
      font-size: 28rpx;
      background: #ffffff;
      box-shadow: 0px 0px 14px 6px rgba(29, 233, 182, 0.11);
      border-radius: 20px;
      padding: 20rpx;
    }
    .textarea-counter {
      display: none;
      font-size: 24rpx;
      color: #999;
      text-align: right;
      height: 40rpx;
      line-height: 40rpx;
      padding-top: 4rpx;
    }
  }
  .upload-image-wrap {
    display: flex;
    align-items: center;
    padding: 26rpx 10rpx;
    padding-top: 0;
    box-sizing: border-box;
    margin-left: 20rpx;
    margin-right: 20rpx;
  }
  .cat-btn-wrap {
    margin-left: 20rpx;
    margin-right: 20rpx;
    background: #f6f8f9;
    border: 3rpx solid #cbcbcb;
    box-shadow: 0rpx 0rpx 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-radius: 20rpx;
    .cat-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 93rpx;
      background: #ffffff;
      box-shadow: 0rpx 0rpx 14rpx 6rpx rgba(29, 233, 182, 0.11);
      border-radius: 20rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      .l {
        display: flex;
        align-items: center;
        .icon {
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          background: #1aa86c;
          border: 2rpx solid #ebfffd;
          border-radius: 50%;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #fefefe;
        }
        .txt {
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #00796b;
          padding-left: 20rpx;
        }
      }
      .r {
        .iconfont {
          color: #1aa86c;
          font-size: 36rpx;
        }
      }
    }
    .cat-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 20rpx;
      padding-right: 20rpx;
      .item {
        color: #cacccb;
        background: #ffffff;
        border-radius: 27rpx;
        padding: 20rpx;
        margin-top: 20rpx;
        margin-left: 20rpx;
        &.on {
          color: #fff;
          background-color: #409e5b;
        }
      }
    }
  }
}
</style>
