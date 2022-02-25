<template>
  <view class="auth-wraper">正在登录</view>
</template>
<script setup lang="ts">
import { onPageScroll, onLoad, onUnload, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
</script>
<style lang="scss">
.auth-wraper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
