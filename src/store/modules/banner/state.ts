export interface imgUrlsType {
  type: string
  src: string
}
export interface BannerState<T> {
  indexBanner: Array<T>
  seckillBanner: Array<T>
  groupBanner: Array<T>
  fullMinussBanner: Array<T>
  newsGoodsBanner: Array<T>
  specialPriceBanner: Array<T>
  rankBanner: Array<T>
  integralBanner: Array<T>
  isLoaded: boolean
}
export const state: BannerState<imgUrlsType> = {
  indexBanner: [
    {
      type: 'image',
      src: 'https://kaizhuo.eadts.cn/web/uploads/mall1/20220306/146aae386c1f376bdbf13a2f15027f13.png',
    },
  ], // 首页的banner列表
  seckillBanner: [], // 秒杀的banner列表
  groupBanner: [], // 拼团的banner列表
  fullMinussBanner: [], // 满减的banner列表
  newsGoodsBanner: [], // 新品首发的banner列表
  specialPriceBanner: [], // 特价推荐的banner列表
  rankBanner: [], // 排行榜的banner列表
  integralBanner: [], // 积分兑换的banner列表
  isLoaded: false, // 用于是否已经调用过此接口的标识
}
