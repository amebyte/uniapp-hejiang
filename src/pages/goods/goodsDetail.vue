<template>
  <view class="container">
    <!--轮播图 start-->
    <ProductDetailSwiper :img-urls="sliderImage" :videoline="goodsInfo.videoLink" />
    <!--轮播图 end-->
    <!--商品信息 start-->
    <goodsInfo :goods-info="goodsInfo" :is-curriculum="isCurriculum" @openShare="openShare" />
    <!--商品信息 end-->
    <template v-if="isCurriculum">
      <!--课程信息 start-->
      <GoodsCurriculum />
      <!--课程信息 end-->
    </template>
    <!--老师信息 start-->
    <GoodsTeacher />
    <!--老师信息 end-->
    <!--商品详情 start-->
    <GoodsContent :goods-info="goodsInfo" />
    <!--商品详情 end-->
    <!--底部导航栏 start-->
    <DetailFooterBar
      ref="detailFooterBarRef"
      :cart-num="cart_num"
      :create-cart-param="createCartParam"
      @setIsOpenAttrWindow="setIsOpenAttrWindow"
      @setIsBuyNow="setIsBuyNow"
    />
    <!--底部导航栏 end-->
    <!--规格属性 start-->
    <AttrWindow
      id="attr-window"
      :attr="attr"
      :attr-txt="attrTxt"
      :i-splus="1"
      :i-scart="1"
      @closeWindow="closeWindow"
      @changeCartNum="changeCartNum"
      @selectAttrVal="selectAttrVal"
      @iptCartNum="iptCartNum"
      @confirm="confirm"
    />
    <!--规格属性 end-->
  </view>
</template>
<script lang="ts">
import { onPageScroll, onLoad, onShow, onHide, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, toRef, computed, defineComponent, toRefs } from 'vue'
import { useStore, mapGetters } from 'vuex'
import ProductDetailSwiper from '@/components/product-detail-swiper/index.vue'
import AttrWindow from '@/components/attr-window/index.vue'
import GoodsInfo from './components/GoodsInfo.vue'
import GoodsContent from './components/GoodsContent.vue'
import DetailFooterBar from './components/DetailFooterBar.vue'
import GoodsCurriculum from './components/GoodsCurriculum.vue'
import GoodsTeacher from './components/GoodsTeacher.vue'
import { fetchGoodsDetail } from '@/api/goods'
import { fetchUserInfo } from '@/api/user'
import { minHeap } from '@/utils/util'
export default defineComponent({
  name: 'GoodsDetail',
  components: {
    ProductDetailSwiper,
    AttrWindow,
    GoodsInfo,
    GoodsContent,
    DetailFooterBar,
    GoodsCurriculum,
    GoodsTeacher,
  },
  setup() {
    const store = useStore()
    const isLogin = computed(mapGetters(['isLogin']).isLogin.bind({ $store: store }))
    console.log('isLogin', isLogin.value)
    let state = reactive({
      productId: '',
      goodsInfo: {} as any,
      sliderImage: [],
      attr: {
        isOpenAttrWindow: false, // 是否打开属性面板
        productAttr: [],
        productSelect: {},
      } as any,
      isBuyNow: false,
      cart_num: 0,
      attrValue: '',
      attrTxt: '请选择',
      isCurriculum: false,
    })
    const detailFooterBarRef = ref(null)
    const getGoodsDetail = () => {
      fetchGoodsDetail({ id: state.productId })
        .then((r) => {
          console.log('r', r)
          state.goodsInfo = r
          state.isCurriculum = state.goodsInfo.cats.includes('5')
          state.sliderImage = state.goodsInfo.sliderImage
          state.attr.productAttr = state.goodsInfo.attrGroups
          const minPrice = minHeap(state.goodsInfo.skus, 'marketPrice')

          setDefaultAttrSelect(minPrice)
        })
        .catch((err) => console.log('err', err))
    }

    /**
     * 设置默认选中属性
     * @param {Object} data
     */
    const setDefaultAttrSelect = (data) => {
      state.attr.productSelect.productName = state.goodsInfo.productName
      state.attr.productSelect.image = data.thumb || state.goodsInfo.thumb
      state.attr.productSelect.price = data.marketprice
      state.attr.productSelect.stock = data.stock
      state.attr.productSelect.limits = data.limits
      state.attr.productSelect.cart_num = 1
      state.attrValue = ''

      if (data.attrOptions) {
        state.attrTxt = createSelectedAttrTxt(data.attrOptions)
        data.attrOptions.forEach((v) => {
          setAttrVal(v.val, v.attrId)
        })
      }
    }

    /**
     * 设置是否打开属性面板
     */
    const setIsOpenAttrWindow = (flag) => {
      state.attr.isOpenAttrWindow = flag
    }

    /**
     * 设置是否立即购买
     */
    const setIsBuyNow = (flag) => {
      state.isBuyNow = flag
    }

    /**
     * 关闭属性面板回调事件
     *
     */
    const closeWindow = () => {
      setIsBuyNow(false)
      setIsOpenAttrWindow(false)
    }

    /**
     * 属性选中确认回调
     */
    const confirm = () => {
      //   const instance = getCurrentInstance() as any
      console.log('instance', detailFooterBarRef.value)
      const { buyNow, addCart, groupBuyingNow } = detailFooterBarRef.value as any
      setIsOpenAttrWindow(false)
      state.isBuyNow ? buyNow() : addCart()
      setIsBuyNow(false)
    }

    /**
     * 购物车数量加和数量减
     *
     */
    const changeCartNum = (changeValue) => {
      // changeValue:是否 加|减
      let stock = state.attr.productSelect.stock || 0
      let num = state.attr.productSelect
      if (changeValue) {
        num.cart_num++
        if (num.cart_num > stock) {
          state.attr.productSelect.cart_num = stock
          state.cart_num = stock
        }
      } else {
        num.cart_num--
        if (num.cart_num < 1) {
          state.attr.productSelect.cart_num = 1
          state.cart_num = 1
        }
      }
    }

    /**
     * 选中的SKU属性之后的操作
     *
     */
    const selectAttrVal = (attrval, attrid) => {
      setAttrVal(attrval, attrid)
      const skus = getSelectedAttrVal()
      state.attrTxt = createSelectedAttrTxt(skus)
      const goodsItem: any = createSelectSkuParam(skus)
      if (goodsItem) {
        if (goodsItem.selectedSku.thumb) state.attr.productSelect.image = goodsItem.selectedSku.thumb
        if (goodsItem.selectedSku.price) state.attr.productSelect.price = goodsItem.selectedSku.price
        if (goodsItem.selectedSku.stock) state.attr.productSelect.stock = goodsItem.selectedSku.stock
      }
    }

    /**
     * 创建购物车参数
     */
    const createCartParam = () => {
      const skus = getSelectedAttrVal()
      const goodsItem: any = createSelectSkuParam(skus)
      return goodsItem
    }

    /**
     * 创建选择的商品SKU参数
     */
    const createSelectSkuParam = (skus) => {
      let goodsItem = {
        productId: state.productId,
        selectedSku: {},
      }

      const skuUniqueIds = createSkuUniqueIds(skus)
      state.goodsInfo.skus.forEach((o) => {
        if (o.skuUniqueIds === skuUniqueIds) {
          goodsItem['selectedSku'] = {
            thumb: createThumb(skus),
            stock: o.stock,
            price: o.marketPrice,
            skuId: o.id,
            cartNum: state.attr.productSelect.cart_num,
            attr: createAttrs(o.id),
          }
        }
      })

      return goodsItem
    }

    const createAttrs = (id) => {
      console.log('state.goodsInfo', state.goodsInfo)
      let attr = []
      state.goodsInfo.attr.some((o) => {
        if (o.id === id) {
          attr = o
        }
      })
      return attr
    }

    const createSkuUniqueIds = (skus) => {
      const skuUniqueIds = skus.reduce((prev, curr) => `${prev}:${curr.valId}`, '')
      return skuUniqueIds.slice(1)
    }

    const createSelectedAttrTxt = (skus) => {
      const attrTxt = skus.reduce((prev, curr) => `${prev};${curr.val}`, '')
      return `已选择：${attrTxt.slice(1)}`
    }

    const createThumb = (skus) => {
      return skus.reduce((prev, curr) => {
        // if (curr.thumb !== '') prev = curr.thumb  // 此选项是每个属性都会设置thumb，但要看后端系统支不支持
        if (prev === '') prev = curr.thumb
        return prev
      }, '')
    }

    /**
     * 设置选中的SKU属性
     *
     */
    const setAttrVal = (attrval, attrid) => {
      state.attr.productAttr = state.attr.productAttr.map((o) => {
        o.attrValues.map((v) => {
          if (attrval.val === v.val || attrval === v.val) {
            if (v.isSelect) {
              v.isSelect = false
            } else {
              v.isSelect = true
            }
          } else if (o.attrId === attrid) {
            v.isSelect = false
          }
          return v
        })
        return o
      })
    }

    /**
     * 获取已经选择的规格属性
     */
    const getSelectedAttrVal = () => {
      let skus: any[] = []
      state.attr.productAttr.forEach((o) => {
        o.attrValues.forEach((v) => {
          if (v.isSelect) {
            skus.push(v)
          }
        })
      })
      return skus
    }

    /**
     * 购物车手动填写
     *
     */
    const iptCartNum = (e) => {
      state.attr.productSelect.cart_num = e || 1
    }

    const openShare = () => {
      console.log('openShare')
    }

    onShow(() => {
      getGoodsDetail()
    })

    onLoad((options) => {
      state.productId = options.productId!
    })

    return {
      ...toRefs(state),
      detailFooterBarRef,
      setIsOpenAttrWindow,
      setIsBuyNow,
      iptCartNum,
      changeCartNum,
      selectAttrVal,
      closeWindow,
      confirm,
      openShare,
      createCartParam,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '@/static/css/variable.scss';
.container {
  background-color: $background-color;
}
</style>
<style lang="scss">
@import '@/static/css/variable.scss';
page {
  background-color: $background-color;
}
</style>
