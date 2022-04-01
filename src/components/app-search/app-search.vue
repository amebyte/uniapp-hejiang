<template>
  <view class="search-contain">
    <view class="search acea-row row-between-wrapper">
      <view class="input acea-row row-between-wrapper">
        <text class="iconfont icon-search"></text>
        <input
          v-model="searchValue"
          type="text"
          confirm-type="search"
          :placeholder="placeholder"
          @confirm="inputConfirm"
          @input="setValue"
        />
      </view>
      <view class="bnt" @click="searchBut">搜索</view>
    </view>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onUnload, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs, onMounted } from 'vue'
export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容',
    },
  },
  emits: ['update:modelValue', 'onSearch'],
  setup(props, { emit }) {
    const state = reactive({
      searchValue: '',
    })

    const inputConfirm = (event) => {
      if (event.detail.value) {
        uni.hideKeyboard()
      }
    }

    const setValue = (event) => {
      state.searchValue = event.detail.value
      emit('update:modelValue', event.detail.value)
    }

    const searchBut = () => {
      emit('onSearch')
    }

    onMounted(() => {
      state.searchValue = props.modelValue || ''
    })

    return {
      ...toRefs(state),
      inputConfirm,
      setValue,
      searchBut,
    }
  },
})
</script>

<style scoped>
.search-contain {
  padding: 20rpx 0;
}
.search-contain .search {
  padding-left: 30rpx;
}

.search-contain .search .input {
  width: 598rpx;
  background-color: #f7f7f7;
  border-radius: 33rpx;
  padding: 0 35rpx;
  box-sizing: border-box;
  height: 66rpx;
}

.search-contain .search .input input {
  width: 472rpx;
  font-size: 28rpx;
}

.search-contain .search .input .placeholder {
  color: #999;
}

.search-contain .search .input .iconfont {
  color: #555;
  font-size: 35rpx;
}

.search-contain .search .bnt {
  width: 120rpx;
  text-align: center;
  height: 66rpx;
  line-height: 66rpx;
  font-size: 30rpx;
  color: #282828;
}

.search-contain .title {
  font-size: 28rpx;
  color: #999;
  margin: 50rpx 30rpx 25rpx 30rpx;
}

.search-contain .title .iconfont {
  font-size: 28rpx;
}

.search-contain .list {
  padding-left: 10rpx;
}

.search-contain .list .item {
  font-size: 26rpx;
  color: #454545;
  padding: 0 21rpx;
  height: 60rpx;
  border-radius: 3rpx;
  line-height: 60rpx;
  border: 1rpx solid #aaa;
  margin: 0 0 20rpx 20rpx;
}

.search-contain .list .item.history-item {
  height: 50rpx;
  border: none;
  border-radius: 25rpx;
  background-color: #f7f7f7;
  line-height: 50rpx;
}

.search-contain .line {
  border-bottom: 1rpx solid #eee;
  margin: 20rpx 30rpx 0 30rpx;
}
</style>
