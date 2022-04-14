<template>
  <view class="bd-nickname">
    <view class="bd-item dir-left-nowrap cross-center">
      <input v-model="nickname" class="bd-input box-grow-1" placeholder="请输入昵称" type="text" />
      <text class="iconfont icon-delete" @click="clear"></text>
    </view>
    <view class="bd-comment">
      注：最多可设置16个汉字，可设置含有中文、英文、数字、符号组合的昵称，但不建议设置特殊字符。
    </view>
    <view class="bd-bottom" :class="agree ? 'bd-yes-agree' : 'bd-no-agree'" @click="changeName"> 确认 </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted, computed } from 'vue'
import { store } from '@/store'
import { fetchUpdateNickname } from '@/api/user'

export default defineComponent({
  name: 'SetNickname',
  setup() {
    const userInfo = ref(store.state.app.userInfo)
    const nickname = ref('')
    const agree = computed(() => (nickname.value ? 1 : 0))

    const changeName = () => {
      if (!agree.value) return
      nickname.value = nickname.value.trim()
      fetchUpdateNickname({
        nickname: nickname.value,
      }).then((response) => {
        if (response.code === 0) {
          uni.navigateBack({
            delta: 1,
          })
          userInfo.value.nickname = nickname.value
        } else {
          uni.showToast({
            icon: 'none',
            title: response.msg,
          })
        }
      })
    }

    const clear = () => {
      nickname.value = ''
    }

    onMounted(() => {
      nickname.value = userInfo.value.nickname
    })

    return {
      nickname,
      agree,
      clear,
      changeName,
    }
  },
})
</script>

<style scoped lang="scss">
.bd-nickname {
  min-height: 100vh;
}
.bd-item {
  height: 100upx;
  padding: 46upx 42upx;
  background-color: #ffffff;
  position: relative;
}
.bd-input {
  height: 36upx;
}
.bd-bottom {
  height: 88upx;
  line-height: 88upx;
  color: #ffffff;
  font-size: 36upx;
  border-radius: 44upx;
  margin-top: 68upx;
  text-align: center;
}
.bd-yes-agree {
  background: rgba(26, 168, 108, 1);
}
.bd-no-agree {
  background: rgba(26, 168, 108, 0.5);
}

.bd-comment {
  padding: 24upx;
  font-size: 24upx;
  color: #999999;
}

.bd-clear {
  width: 25upx;
  height: 25upx;
  position: absolute;
  right: 33upx;
  top: 50%;
  transform: translateY(-50%);
}
</style>
