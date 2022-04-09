<template>
  <view class="share-bar-wrapper">
    <view class="generate-posters acea-row row-middle" :class="isShowShare ? 'on' : ''">
      <!-- #ifndef MP -->
      <button v-if="wechatH5Status === true" class="item" hover-class="none" @click="H5ShareBox = true">
        <!-- <button class="item" hover-class='none' v-if="wechatStatus === true" @click="setShareInfoStatus"> -->
        <view class="iconfont icon-wechat"></view>
        <view class="">发送给朋友</view>
      </button>
      <!-- #endif -->
      <!-- #ifdef MP -->
      <button class="item" open-type="share" hover-class="none" @click="closeShare">
        <view class="iconfont icon-wechat"></view>
        <view class="">发送给朋友</view>
      </button>
      <!-- #endif -->
      <button class="item" hover-class="none" @click="goPoster">
        <view class="iconfont icon-posters"></view>
        <view class="">生成海报</view>
      </button>
    </view>

    <view v-if="posters" class="mask" @click="closePosters"></view>
    <view v-if="canvasStatus" class="mask"></view>
    <!-- 海报展示 -->
    <view v-if="canvasStatus" class="poster-pop">
      <image src="/static/images/poster-close.png" class="close" @click="posterImageClose"></image>
      <image :src="imagePath"></image>
      <!-- #ifndef H5  -->
      <view class="save-poster" @click="savePosterPath">保存到手机</view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="keep">长按图片可以保存到手机</view>
      <!-- #endif -->
    </view>
    <view v-else class="canvas">
      <canvas style="width: 750px; height: 1190px" canvas-id="firstCanvas"></canvas>
      <canvas canvas-id="qrcode" :style="{ width: `${qrcodeSize}px`, height: `${qrcodeSize}px` }" />
    </view>

    <view v-if="isShowShare" class="mask" @click="closeShare"></view>
    <view v-if="H5ShareBox" class="share-box">
      <image src="/static/images/share-info.png" @click="H5ShareBox = false"></image>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, watch } from 'vue'
export default defineComponent({
  name: 'ShareBar',
  props: {
    isShowShare: {
      type: Boolean,
      required: false,
    },
    wechatH5Status: {
      type: Boolean,
      required: false,
    },
    imagePath: {
      type: String,
      required: false,
    },
    canvasStatus: {
      type: Boolean,
      required: false,
    },
    qrcodeSize: {
      type: Number,
      required: false,
    },
    posters: {
      type: Boolean,
      required: false,
    },
    onlyH5ShareBox: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['closeShare', 'createPoster', 'posterImageClose', 'savePosterPath'],
  setup(props, { emit }) {
    const H5ShareBox = ref(false)

    watch(
      () => props.onlyH5ShareBox,
      (newVal, oldVal) => {
        H5ShareBox.value = newVal
      }
    )

    watch(
      () => H5ShareBox.value,
      (newVal, oldVal) => {
        if (newVal === false) {
          closeShare()
        }
      }
    )

    const closeShare = () => {
      emit('closeShare')
    }
    const goPoster = () => {
      emit('createPoster')
    }

    const posterImageClose = () => {
      emit('posterImageClose')
    }

    const savePosterPath = () => {
      emit('savePosterPath')
    }

    return {
      H5ShareBox,
      closeShare,
      goPoster,
      posterImageClose,
      savePosterPath,
    }
  },
})
</script>

<style lang="scss">
.share-bar-wrapper {
  .generate-posters {
    width: 100%;
    height: 170rpx;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 300;
    transform: translate3d(0, 100%, 0);
    transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    border-top: 1rpx solid #eee;
  }

  .generate-posters.on {
    transform: translate3d(0, 0, 0);
  }

  .generate-posters .item {
    flex: 50%;
    text-align: center;
    font-size: 30rpx;
  }

  .generate-posters .item .iconfont {
    font-size: 80rpx;
    color: #5eae72;
  }

  .generate-posters .item .iconfont.icon-haibao {
    color: #5391f1;
  }

  .canvas {
    position: fixed;
    z-index: -5;
    opacity: 0;
  }

  .poster-pop {
    position: fixed;
    width: 450rpx;
    height: 714rpx;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -432rpx;
    z-index: 399;
  }

  .poster-pop image {
    width: 100%;
    height: 100%;
    display: block;
  }

  .poster-pop .close {
    width: 46rpx;
    height: 75rpx;
    position: fixed;
    right: 0;
    top: -73rpx;
    display: block;
  }

  .poster-pop .save-poster {
    background-color: #3ba5f8;
    font-size: ：22rpx;
    color: #fff;
    text-align: center;
    height: 76rpx;
    line-height: 76rpx;
    width: 100%;
  }

  .poster-pop .keep {
    color: #fff;
    text-align: center;
    font-size: 25rpx;
    margin-top: 10rpx;
  }

  .share-box {
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
