import { createStore } from 'vuex'
import { store as app, AppState, AppStore } from '@/store/modules/app'
import { store as mallConfig, MallConfigState, MallConfigStore } from '@/store/modules/mallConfig'
import { store as payment, PaymentState, PaymentStore } from '@/store/modules/payment'
import { store as cart, CartState, CartStore } from '@/store/modules/cart'
import { store as banner, BannerState, BannerStore, imgUrlsType } from '@/store/modules/banner'
import getters from './getters'
export interface RootState {
  app: AppState
  cart: CartState
  banner: BannerState<imgUrlsType>
  payment: PaymentState
  mallConfig: MallConfigState
}
export type Store = AppStore<Pick<RootState, 'app'>> &
  CartStore<Pick<RootState, 'cart'>> &
  BannerStore<Pick<RootState, 'banner'>> &
  PaymentStore<Pick<RootState, 'payment'>> &
  MallConfigStore<Pick<RootState, 'mallConfig'>>

export const store = createStore<RootState>({
  modules: {
    app,
    cart,
    banner,
    payment,
    mallConfig,
  },
  getters,
})

export const useStore = (): Store => {
  return store as Store
}
