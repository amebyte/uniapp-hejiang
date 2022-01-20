import { createStore } from 'vuex'
import { store as app, AppState, AppStore } from '@/store/modules/app'
import { store as cart, CartState, CartStore } from '@/store/modules/cart'
import { store as banner, BannerState, BannerStore, imgUrlsType } from '@/store/modules/banner'
import getters from './getters'
export interface RootState {
  app: AppState
  cart: CartState
  banner: BannerState<imgUrlsType>
}
export type Store = AppStore<Pick<RootState, 'app'>> &
  CartStore<Pick<RootState, 'cart'>> &
  BannerStore<Pick<RootState, 'banner'>>

export const store = createStore<RootState>({
  modules: {
    app,
    cart,
    banner,
  },
  getters,
})

export const useStore = (): Store => {
  return store as Store
}
