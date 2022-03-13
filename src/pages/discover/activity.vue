<template>
  <view class="container">
    <!--top-bar start-->
    <view class="top-bar" style="display: none">
      <view class="search-icon">
        <text class="iconfont icon-search"></text>
      </view>
      <view class="title">活动中心</view>
      <view class="action">
        <text>发布</text>
      </view>
    </view>
    <!--top-bar end-->
    <!--预约次数 start-->
    <view class="info-bar">
      <view class="date">
        <view class="day">{{ currDay }}</view>
        <view class="year-month">/{{ currYear }}.{{ currMonth }} <text class="iconfont icon-arrow-down"></text></view>
      </view>
      <view class="subscribe-num"
        >已预约<text>{{ myBookCount }}</text
        >场活动</view
      >
    </view>
    <!--预约次数 end-->
    <!--日历 start-->
    <view class="calendar-wrap" :class="isToggleArrow ? 'hide' : ''">
      <Calendar @onDayClick="onDayClick" @onMonthChange="onMonthChange" />
    </view>
    <view class="toggle-arrow" @click="toggleArrow"
      ><text class="iconfont" :class="isToggleArrow ? 'icon-arrow-down' : 'icon-arrow-up'"></text
    ></view>
    <!--日历 end-->
    <view class="activity-sessions">
      - 当天共 <text>{{ pagination.total_count }}</text> 场活动 -
    </view>
    <!--日历 end-->
    <!--预约列表 start-->
    <view class="list">
      <block v-for="(item, index) in list" :key="index">
        <view class="item">
          <view class="time">
            <text class="iconfont icon-time"></text>
            {{ item.start_time }}-{{ item.end_time }}
          </view>
          <view class="title">{{ item.title }}</view>
          <view class="action">
            <view class="l">
              <text class="iconfont icon-people"></text>
              限定 {{ item.max_num }} 人
            </view>
            <view class="r" @click="gotoDetail(item)">{{ item.is_booked ? '预约成功' : '立即预约' }}</view>
          </view>
        </view>
      </block>
      <view class="item full" style="display: none">
        <view class="time">
          <text class="iconfont icon-time"></text>
          9:00-10:00
        </view>
        <view class="title"> 活动主题-活动标题名字活动标题名字活动标题名字活动标题名字活动标题名字活动标题名字 </view>
        <view class="action">
          <view class="l">
            <text class="iconfont icon-people"></text>
            限定 20 人
          </view>
          <view class="r">人数已满</view>
        </view>
      </view>
    </view>
    <!--预约列表 end-->
  </view>
</template>

<script setup lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { PropType, ref, toRefs, defineComponent, reactive, onMounted } from 'vue'
import Calendar from '@/components/calendar/calendar.vue'
import { fetchActivityList, fetchMyActivityBookCount, fetchActivityDoByMonth } from '@/api/activity'
import { getDateObj } from '@/utils/util'

const currDay = ref(getDateObj().currDay)
const currMonth = ref(getDateObj().currMonth)
const currYear = ref(getDateObj().currYear)
const date = `${currYear.value}-${currMonth.value}-${currDay.value}`
const yearMonth = `${currYear.value}-${currMonth.value}`

const list = ref<Array<any>>([])
const pagination = ref({}) as any
const getEventReservationList = (date) => {
  const params = {
    page: 1,
    limit: 10,
    date,
  }
  fetchActivityList(params)
    .then((data: any) => {
      list.value = data.list
      pagination.value = data.pagination
    })
    .catch((err) => console.log(err))
}

const getActivityDoByMonth = (date) => {
  const params = {
    page: 1,
    limit: 100,
    date,
  }
  fetchActivityDoByMonth(params)
    .then((r) => {
      console.log('rrr', r)
    })
    .catch((err) => console.log(err))
}
const myBookCount = ref(0)
const getMyActivityBookCount = () => {
  fetchMyActivityBookCount()
    .then((r) => {
      if (r.code === 0) {
        myBookCount.value = r.data.book_count
      }
    })
    .catch((err) => console.log(err))
}

const gotoDetail = (item) => {
  uni.navigateTo({
    url: '/pages/discover/activityDetail?id=' + item.id,
  })
}

const onDayClick = (event) => {
  getEventReservationList(event.id)
}

const onMonthChange = (event) => {
  const date = new Date(event) //得到当前日期原始模式
  const currDay = date.getDate() // 得到当前日期
  const currMonth = date.getMonth() + 1 //得到当前日期月份（注意： getMonth()方法一月为 0, 二月为 1, 以此类推。）
  const currentYear = date.getFullYear()
  const currYearMontch = `${currentYear}-${currMonth < 10 ? '0' + currMonth : currMonth}`
  getActivityDoByMonth(currYearMontch)
}

const isToggleArrow = ref(true)
const toggleArrow = () => {
  isToggleArrow.value = !isToggleArrow.value
}

onMounted(() => {
  getEventReservationList(date)
  getActivityDoByMonth(yearMonth)
  getMyActivityBookCount()
})
</script>
<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  margin: 20rpx;
  .top-bar {
    display: flex;
    justify-content: space-between;
    color: $theme-font-color;
    margin-bottom: 10rpx;
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
  .info-bar {
    margin-left: 20rpx;
    margin-right: 20rpx;
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
    .date {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .day {
        font-size: 40rpx;
        font-family: PingFang SC;
        font-weight: 600;
        color: #009688;
        border-bottom: 4rpx solid #5aefc9;
        margin-right: 10rpx;
      }
      .year-month {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 600;
        color: #009688;
        .iconfont {
          font-size: 22rpx;
          color: #fff;
          background-color: #dbdbdb;
          border-radius: 50%;
        }
      }
    }
    .subscribe-num {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #009688;
      text {
        font-size: 32rpx;
        margin-left: 5rpx;
        margin-right: 5rpx;
      }
    }
  }
  .calendar-wrap {
    background-color: #fff;
    box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    margin-top: 40rpx;
    overflow: hidden;
    &.hide {
      height: 280rpx;
    }
  }
  .toggle-arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    .iconfont {
      font-size: 42rpx;
    }
  }
  .activity-sessions {
    text-align: center;
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #00beac;
    margin-top: 30rpx;
    margin-bottom: 40rpx;
    text {
      font-size: 32rpx;
      color: #009688;
    }
  }
  .list {
    .item {
      height: 246rpx;
      border: 3rpx solid #ffffff;
      background: linear-gradient(200deg, #2fb383 0%, #18a86b 100%);
      box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
      border-radius: 20rpx;
      padding: 20rpx;
      margin-bottom: 40rpx;
      .time {
        font-size: 32rpx;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: #ebfffd;
        .iconfont {
          font-size: 32rpx;
        }
      }
      > .title {
        padding-top: 30rpx;
        padding-bottom: 30rpx;
        font-size: 35rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        @extend .line1;
      }
      .action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .l {
          font-size: 32rpx;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ebfffd;
          .iconfont {
            font-size: 40rpx;
          }
        }
        .r {
          background-color: #ffffff;
          border-radius: 27rpx;
          font-size: 26rpx;
          font-family: PingFang SC;
          font-weight: 400;
          color: #21ac74;
          padding: 10rpx 20rpx;
        }
      }
      &.full {
        border: 3rpx solid #ffffff;
        background: linear-gradient(200deg, #fffeff 0%, #d7fffe 100%);
        box-shadow: 0px 0px 14rpx 6rpx rgba(29, 233, 182, 0.11);
        border-radius: 20rpx;
        .time {
          color: #009688;
          .iconfont {
            color: #38f8d4;
          }
        }
        > .title {
          color: #009688;
        }
        .action {
          .l {
            color: #009688;
            .iconfont {
              color: #38f8d4;
            }
          }
          .r {
            border: 3rpx solid #009688;
            border-radius: 27rpx;
            color: #009688;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import '@/static/css/variable.scss';
page {
  background-color: $background-color;
}
</style>
