<template>
  <view class="container">
    <form @submit="formSubmit">
      <view class="p20 bg_fff h100">
        <view class="form-item acea-row">
          <view class="title">所在地区</view>
          <view style="flex: 1">
            <app-area-picker
              v-if="tt_area_show"
              :ids="[form.province_id, form.city_id, form.district_id]"
              @customevent="areaEvent"
            ></app-area-picker>
          </view>
        </view>
        <view class="form-item acea-row">
          <view class="title">详细地址</view>
          <input
            v-model="form.detail"
            type="text"
            placeholder="请输入详细地址"
            placeholder-style="color:#ccc;"
            name="detail"
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
            v-model="form.mobile"
            type="text"
            placeholder="请输入手机号码"
            placeholder-style="color:#ccc;"
            name="mobile"
            placeholder-class="placeholder"
            :maxlength="20"
          />
        </view>
        <view class="form-item acea-row" style="display: none">
          <view class="title">设为默认</view>
          <switch :checked="form.default" style="transform: scale(0.8)" type="checkbox" @change="defaultChange" />
        </view>

        <view class="btn">
          <button form-type="submit">保存</button>
        </view>
      </view>
    </form>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import AppAreaPicker from './component/AppAreaPicker.vue'
import { fetchEidtAddress, fetchAddressDetail } from '@/api/address'
import { Tips } from '@/utils/util'
export default defineComponent({
  name: 'AddressEidt',
  components: {
    AppAreaPicker,
  },
  setup() {
    const state = reactive({
      form: {
        location: '',
        latitude: '',
        longitude: '',
        id: '',
        name: '',
        mobile: '',
        address: '',
        province_id: 0,
        city_id: 0,
        district_id: 0,
        detail: '',
        type: '' as any,
        default: false,
        is_default: 0,
      },
      is_refund_address: 0,
      detail_url: '',
      list: [] as any[],
      submit_status: false,
      tt_area_show: false,
      automatic: '',
      provinceString: '',
      cityString: '',
      areaString: '',
      focus: false,
    })

    /**
     * 勾选默认
     * @param e
     */
    const defaultChange = (e) => {
      state.form.default = e.detail.value
    }

    /**
     * 保存
     * @param e
     */
    const formSubmit = async (e) => {
      try {
        if (state.submit_status) return
        let content

        if (!state.form.detail) {
          content = state.form.type == 1 ? '门牌号不能为空' : '详细地址不能为空'
        }
        if (!state.form.province_id && state.form.type == 0) {
          content = '地区不能为空'
        }
        if (!state.form.mobile) {
          content = '请输入手机号码'
        }
        if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(state.form.mobile)) {
          content = '请输入正确的手机号码'
        }
        if (!state.form.name) {
          content = '姓名不能为空'
        }
        if (content) {
          uni.showToast({
            title: content,
            icon: 'none',
          })
          return
        }

        state.submit_status = true

        let para, url
        if (state.is_refund_address > 0) {
          let { id, name, mobile, detail } = state.form
          para = {
            form: JSON.stringify({
              id,
              name,
              mobile,
              address_detail: detail,
              address: state.list,
              is_default: 0,
              remark: '',
            }),
          }
        } else {
          para = Object.assign({}, state.form)
        }

        const info = await fetchEidtAddress(para)

        state.submit_status = false

        if (info.code === 0) {
          uni.showToast({ title: info.msg, icon: 'none' })
          uni.navigateBack({ delta: 1 })
        } else {
          uni.showToast({ title: info.msg, icon: 'none' })
        }
      } catch (e: any) {
        state.submit_status = false
        throw new Error(e)
      }
    }

    const areaEvent = (data) => {
      if (data) {
        state.form.province_id = data.province.id
        state.form.city_id = data.city.id
        state.form.district_id = data.district.id
        state.list = [data.province.name, data.city.name, data.district.name]
      }
    }

    onLoad((options: any) => {
      if (options.id > 0) {
        fetchAddressDetail(options)
          .then((info) => {
            if (info.code === 0) {
              if (options.is_refund_address > 0) {
                const detail = info.data.detail
                // getInfo(Object.assign({ detail: detail.address_detail }, detail))
              } else {
                state.form = info.data.list
              }
            } else {
              uni.showToast({ title: info.msg, icon: 'none' })
            }
            state.tt_area_show = true
          })
          .catch(() => {
            state.tt_area_show = true
          })
      } else {
        state.tt_area_show = true
      }
    })

    return {
      ...toRefs(state),
      formSubmit,
      defaultChange,
      areaEvent,
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
.btn {
  width: 100%;
  height: 76rpx;
  border-radius: 50rpx;
  text-align: center;
  line-height: 76rpx;
  font-size: 30rpx;
  color: #fff;
  background-color: #1aa86c;
  button {
    height: 76rpx;
    line-height: 76rpx;
    color: #fff;
    background-color: transparent;
  }
}
</style>
