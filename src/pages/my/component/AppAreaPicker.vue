<template>
  <view class="picker-wrapper">
    <!-- #ifdef MP-WEIXIN || MP-BAIDU || H5 -->
    <picker
      class="box-grow-1 area-picker-left"
      mode="multiSelector"
      :value="multiIndex"
      range-key="name"
      :range="multiArray"
      @change="bindMultiPickerChange"
      @columnchange="bindMultiPickerColumnChange"
    >
      <text v-if="place !== `请选择`" class="address-name-color">{{ place }}</text>
      <text v-else class="address-place-name-color">{{ place }}</text>
    </picker>
    <!-- #endif -->
    <text class="iconfont icon-arrow-right"></text>
  </view>
</template>

<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs, PropType } from 'vue'
import Cache from '@/utils/cache'
import { fetchDistrict } from '@/api/address'
export default defineComponent({
  name: 'AppAreaPicker',
  props: {
    ids: {
      type: Array as PropType<Array<any>>,
      default: () => {
        return []
      },
    },
  },
  emits: ['customevent'],
  setup(props, { emit }) {
    const state = reactive({
      tempIds: props.ids,
      area_picker_show: '',
      list: [] as any[],
      multiIndex: [] as any[],
      multiArray: [] as any[],
      place: '请选择',
    })

    const bindMultiPickerChange = (e) => {
      let list = [
        state.multiArray[0][e.detail.value[0]],
        state.multiArray[1][e.detail.value[1]],
        state.multiArray[2][e.detail.value[2]],
      ]

      let place = list[0].name + '，' + list[1].name + '，' + list[2].name
      ;[state.multiIndex, state.place] = [e.detail.value, place]
      setEvent(list)
    }

    const setEvent = (list, status = true) => {
      let data = {
        province: {
          id: list[0].id,
          name: list[0].name,
        },
        city: {
          id: list[1].id,
          name: list[1].name,
        },
        district: {
          id: list[2].id,
          name: list[2].name,
        },
      }
      emit('customevent', status ? data : null)
    }

    const bindMultiPickerColumnChange = (e) => {
      let data = {
        multiArray: state.multiArray,
        multiIndex: state.multiIndex,
      }
      data.multiIndex[e.detail.column] = e.detail.value
      switch (e.detail.column) {
        case 0:
          data.multiIndex.splice(1, 1, 0)
          data.multiIndex.splice(2, 1, 0)
          data.multiArray.splice(1, 1, state.list[data.multiIndex[0]].list)
          data.multiArray.splice(2, 1, state.list[data.multiIndex[0]].list[data.multiIndex[1]].list)
          break
        case 1:
          data.multiIndex.splice(2, 1, 0)
          data.multiArray.splice(2, 1, state.list[data.multiIndex[0]].list[data.multiIndex[1]].list)
          break
      }
      ;[state.multiArray, state.multiIndex] = [data.multiArray, data.multiIndex]
    }

    const before = (cb) => {
      const district = Cache.get('_DISTRICT')
      if (district) {
        cb(JSON.parse(district))
      } else {
        fetchDistrict()
          .then((r) => {
            if (r.code === 0) {
              Cache.set('_DISTRICT', r.data.list)
              cb(r.data.list)
            }
          })
          .catch((err) => console.log(err))
      }
    }

    const init = (list) => {
      console.log('list', list)
      const null_status = state.tempIds.length === 3 && state.tempIds[0] != 0
      const ids = null_status ? state.tempIds : [2, 3, 4]
      const multiIndex = getIndex(list, ids)
      const multiArray = [list, list[multiIndex[0]].list, list[multiIndex[0]].list[multiIndex[1]].list]
      let place =
        multiArray[0][multiIndex[0]].name +
        '，' +
        multiArray[1][multiIndex[1]].name +
        '，' +
        multiArray[2][multiIndex[2]].name

      /////初始化
      let eve = [multiArray[0][multiIndex[0]], multiArray[1][multiIndex[1]], multiArray[2][multiIndex[2]]]
      ////
      setEvent(eve, null_status)
      ;[state.list, state.multiArray, state.multiIndex, state.place] = [
        list,
        multiArray,
        multiIndex,
        null_status ? place : '请选择',
      ]
    }

    const getIndex = (list, data) => {
      console.log('data', data)
      let arr: any[] = []
      list.map((item, index) => {
        if (data[0] == item.id) arr.push(index)
      })

      list[arr[0]].list.map((item, index) => {
        if (data[1] == item.id) arr.push(index)
      })

      list[arr[0]].list[arr[1]].list.map((item, index) => {
        if (data[2] == item.id) arr.push(index)
      })
      return arr
    }

    onLoad(() => {
      before(init)
    })

    return {
      ...toRefs(state),
      bindMultiPickerChange,
      bindMultiPickerColumnChange,
    }
  },
})
</script>

<style scoped lang="scss">
.picker-wrapper {
  display: flex;
  align-items: center;
  flex-direction: row;
}
</style>
