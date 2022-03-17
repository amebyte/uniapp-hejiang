<template>
  <view class="app-upload-image">
    <view class="upload-box" :style="{ background: backgroundColor }">
      <view class="flex-wrap">
        <view v-for="(item, index) in imageList" :key="item.id" class="img-box">
          <view mode="aspectFill" class="remove cross-center main-center" @click="remove(index)">x</view>
          <image :src="item" mode="aspectFill" class="img" @click="previewImage(index)"></image>
        </view>
        <view @click="chooseImage">
          <view
            v-if="isAddImg"
            :style="{ margin: margin + 'rpx' }"
            :class="{ 'other-border': diy ? true : false }"
            class="add-img dir-top-nowrap cross-center main-center"
          >
            <image mode="aspectFill" class="add-img-icon" :src="defaultImg"></image>
            <text class="text">{{ text }}</text>
            <text v-if="showNumber" class="text">(最多{{ maxNum }}张)</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, onMounted, toRefs } from 'vue'
import { fetchUploadFile } from '@/api/upload'

export default defineComponent({
  name: 'AppUploadImage',
  props: {
    value: {
      type: Array,
      default: null,
    },
    defaultImg: {
      // 添加图片的默认背景图片
      type: String,
      default: '/static/image/icon/icon-image.png',
    },
    maxNum: {
      // 可添加最大图片数量
      type: Number,
      default: 3,
    },
    // 标记
    // 当组件用于循环时使用
    sign: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '#f7f7f7',
    },
    margin: {
      type: String,
      default: '10',
    },
    diy: {
      type: Boolean,
      default: false,
    },
    showNumber: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: '上传图片',
    },
    count: {
      type: Number,
      default: 9,
    },
  },
  emits: ['imageEvent'],
  setup(props, { emit }) {
    const state = reactive({
      imageList: props.value ? props.value : ([] as any[]),
      isAddImg: true,
    })

    // 上传最大图片数量
    const checkMaxNum = () => {
      let status = state.imageList.length >= props.maxNum ? false : true
      state.isAddImg = status
    }

    // 移除图片
    const remove = (index) => {
      let imageList = state.imageList
      let data = imageList.splice(index, 1)
      state.imageList = imageList
      checkMaxNum()

      // 触发事件 tabEvent
      emit('imageEvent', {
        imageList: imageList,
        sign: props.sign,
      })
    }

    // 选择图片
    const chooseImage = () => {
      let imageList = state.imageList
      // #ifdef MP
      uni.chooseImage({
        count: props.maxNum,
        success: function (e: any) {
          for (let i in e.tempFilePaths) {
            if (Number(i) >= props.maxNum - imageList.length) {
              break
            }
            let fileName = ''
            uni.uploadFile({
              url: 'r=api/attachment/upload',
              filePath: e.tempFilePaths[i],
              name: 'file',
              fileType: 'image',
              formData: {
                file: e.tempFilePaths[i],
                file_name: fileName,
              },
              success(res) {
                const data = res.data
                let result = null as any
                if (typeof data === 'string') {
                  result = JSON.parse(data)
                } else {
                  result = data
                }
                if (result.code == 0) {
                  imageList.push(result.data.url)
                  state.imageList = imageList
                  checkMaxNum()
                  emit('imageEvent', {
                    imageList: imageList,
                    sign: props.sign,
                  })
                } else {
                  uni.showModal({
                    title: '',
                    content: result.msg,
                    showCancel: false,
                  })
                }
              },
              fail(e) {
                if (e && e.errMsg) {
                  uni.showModal({
                    title: '错误',
                    content: e.errMsg,
                    showCancel: false,
                  })
                }
              },
            })
          }
        },
        complete: function (e) {
          // 触发事件 tabEvent
          emit('imageEvent', {
            imageList: imageList,
            sign: props.sign,
          })
        },
      })
      // #endif

      // #ifdef H5
      uni.chooseImage({
        count: Number(props.maxNum),
        success: function (e: any) {
          for (let i in e.tempFilePaths) {
            if (Number(i) >= props.maxNum - imageList.length) {
              break
            }
            let image = new Image()
            image.src = e.tempFilePaths[i]
            image.onload = () => {
              let canvas = document.createElement('canvas')
              canvas.width = image.width
              canvas.height = image.height
              let ctx = canvas.getContext('2d') as any
              ctx.drawImage(image, 0, 0, image.width, image.height)
              let ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
              let dataURL = canvas.toDataURL('image/' + ext)
              fetchUploadFile({
                database: dataURL,
              }).then((res) => {
                if (res.code === 0) {
                  state.imageList.push(res.data.url)
                  checkMaxNum()
                  emit('imageEvent', {
                    imageList: state.imageList,
                    sign: props.sign,
                  })
                } else {
                  uni.showModal({
                    title: '',
                    content: res.msg,
                    showCancel: false,
                  })
                }
              })
            }
          }
        },
        complete: function (e) {
          // 触发事件 tabEvent
          emit('imageEvent', {
            imageList: imageList,
            sign: props.sign,
          })
        },
      })
      // #endif
    }

    // 图片预览
    const previewImage = (index) => {
      let imageList = state.imageList
      uni.previewImage({
        current: imageList[index],
        urls: imageList,
      })
    }

    const createObjectURL = (blob) => {
      return window.URL ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
    }

    onMounted(() => {
      checkMaxNum()
    })

    return {
      ...toRefs(state),
      previewImage,
      remove,
      chooseImage,
    }
  },
})
</script>
<style lang="scss" scoped>
.upload-box {
  background-color: #fff;
}

.upload-box .title {
  padding: 15rpx 0 15rpx 20rpx;
}

.upload-box .img {
  width: 188rpx;
  height: 188rpx;
  margin: 10rpx;
  display: block;
}

.upload-box .add-img {
  width: 188rpx;
  height: 188rpx;
  border: 1rpx dotted $uni-weak-color-one;
  background-color: #fff;
}

.upload-box .add-img .text {
  color: $uni-general-color-two;
  font-size: $uni-font-size-weak-two;
}

.upload-box .add-img-icon {
  width: 56rpx;
  height: 56rpx;
  margin-bottom: 10rpx;
}

.upload-box .img-box {
  position: relative;
}

.upload-box .remove {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: -5rpx;
  top: -10rpx;
  background: $uni-important-color-red;
  color: #fff;
  border-radius: 50%;
  padding-bottom: 8rpx;
  font-size: 24rpx;
  z-index: 968;
}

.upload-box .add-img.other-border {
  border: 1rpx solid $uni-weak-color-one;
}
</style>
