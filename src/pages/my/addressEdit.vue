<template>
  <view class="container">
    <form @submit="formSubmit">
      <view class="p20 bg_fff h100">
        <view class="form-item acea-row" @click="openCitySelect">
          <view class="title">所在地区</view>
          <text>{{
            (areaInfo.province.name || '') +
            ' ' +
            (areaInfo.city.name || '') +
            ' ' +
            (areaInfo.area.name || '') +
            ' ' +
            (areaInfo.town.name || '')
          }}</text>
        </view>
        <view class="form-item acea-row">
          <view class="title">详细地址</view>
          <input
            v-model="form.detailAddress"
            type="text"
            placeholder="请输入详细地址"
            placeholder-style="color:#ccc;"
            name="detailAddress"
            placeholder-class="placeholder"
            :maxlength="50"
          />
        </view>
        <view class="form-item acea-row">
          <view class="title">收货人</view>
          <input
            v-model="form.name"
            type="text"
            placeholder="请输入收货人"
            placeholder-style="color:#ccc;"
            name="name"
            :maxlength="15"
            placeholder-class="placeholder"
          />
        </view>
        <view class="form-item acea-row">
          <view class="title">手机号码</view>
          <input
            v-model="form.phoneNumber"
            type="text"
            placeholder="请输入手机号码"
            placeholder-style="color:#ccc;"
            name="phoneNumber"
            placeholder-class="placeholder"
            :maxlength="20"
          />
        </view>
        <view class="form-item acea-row">
          <view class="title">设为默认</view>
          <switch :checked="form.default" style="transform: scale(0.8)" type="checkbox" @change="defaultChange" />
        </view>

        <view class="uni-btn-v">
          <button form-type="submit">保存</button>
        </view>
      </view>
    </form>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import * as api from '@/api/address.js'
import { Tips } from '@/utils/util'
export default defineComponent({
  name: 'AddressEidt',
  setup() {
    const state = reactive({
      form: {
        id: '',
        name: '',
        default: false,
        detailAddress: '',
        phoneNumber: '',
        province: '', // 省
        city: '', // 市
        region: '', //  区
        street: '', // 县
      },
      areaInfo: {
        province: {},
        city: {},
        area: {},
        town: {},
      },
      title: '---',
      selected: [],
    })

    /**
     * 勾选默认
     * @param e
     */
    const defaultChange = (e) => {
      state.form.default = e.detail.value
    }

    /**
     * 打开地区选择
     */
    const openCitySelect = () => {
      //   this.$refs.citySelect.show()
    }

    /**
     * 保存
     * @param e
     */
    const formSubmit = (e) => {
      let that = this,
        value = e.detail.value
      if (!value.name)
        return Tips({
          title: '请填写收货人姓名',
        })
      if (!value.phoneNumber)
        return Tips({
          title: '请填写联系电话',
        })
      if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phoneNumber))
        return Tips({
          title: '请输入正确的手机号码',
        })
      if (!value.detailAddress)
        return Tips({
          title: '请填写详细地址',
        })
      const params = {
        city: state.areaInfo.city.name || state.form.city,
        default: state.form.default,
        detailAddress: state.form.detailAddress,
        name: state.form.name,
        phoneNumber: state.form.phoneNumber,
        // postCode: this.form.postCode,
        province: state.areaInfo.province.name || state.form.province,
        region: state.areaInfo.area.name || state.form.region,
        street: state.areaInfo.town.name || state.form.street,
      }
      if (!params.region)
        return Tips({
          title: '请选择所在地区',
        })

      const done = (res) => {
        if (res.code === 0) {
          uni.navigateBack({})
          Tips({
            title: '保存成功',
            icon: 'success',
          })
        } else {
          Tips({
            title: res.msg,
          })
        }
      }
      if (state.form.id) {
        params.id = state.form.id
        api.updateAddr(params).then((res) => {
          done(res)
        })
      } else {
        api.createAddress(params).then((res) => {
          done(res)
        })
      }
    }

    onLoad(() => {
      // #ifdef APP-NVUE
      const eventChannel = this.$scope.eventChannel // 兼容APP-NVUE
      // #endif

      // #ifndef APP-NVUE
      const eventChannel = this.getOpenerEventChannel()
      // #endif
      eventChannel.on('dataFromOpenerPage', (data) => {
        console.log(data)
        state.areaInfo.province.name = data.province
        state.areaInfo.city.name = data.city
        state.areaInfo.area.name = data.region
        state.form.detailAddress = data.detailAddress
        state.form.default = data.default
        state.form.name = data.name
        state.form.phoneNumber = data.phoneNumber
        state.form.id = data.id
      })
    })

    return {
      ...toRefs(state),
      formSubmit,
      defaultChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
}

.p20 {
  padding: 20rpx;
}

.bg_fff {
  background-color: #fff;
}

.h100 {
  height: 100%;
}

.form-item {
  margin-bottom: 20rpx;
  input {
    flex: 1;
  }
}

.form-item .title {
  width: 180rpx;
}
</style>
