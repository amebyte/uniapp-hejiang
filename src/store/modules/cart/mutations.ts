import { MutationTree } from 'vuex'
import { CartState } from './state'
import { CartMutationTypes } from './mutation-types'

export type Mutations<S = CartState> = {
  [CartMutationTypes.SET_SELECTED_CART_GOODS](state: S, selectedCart: any): void
  [CartMutationTypes.SET_PREVIEW_ORDER_PARAM](state: S, param: any): void
  [CartMutationTypes.SET_ORDER_SUBMIT_FROM_DATA](state: S, param: any): void
}
export const mutations: MutationTree<CartState> & Mutations = {
  [CartMutationTypes.SET_SELECTED_CART_GOODS](state: CartState, selectedCart: any) {
    state.selectedCart = selectedCart
  },
  [CartMutationTypes.SET_PREVIEW_ORDER_PARAM](state: CartState, param: any) {
    state.previewOrderParam = param
  },
  [CartMutationTypes.SET_ORDER_SUBMIT_FROM_DATA](state: CartState, data: any) {
    state.orderSubmitFromData = data
  },
}
