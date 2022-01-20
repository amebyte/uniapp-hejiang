import { MutationTree } from 'vuex'
import { CartState } from './state'
import { CartMutationTypes } from './mutation-types'

export type Mutations<S = CartState> = {
  [CartMutationTypes.SET_SELECTED_CART_GOODS](state: S, selectedCart: any): void
}
export const mutations: MutationTree<CartState> & Mutations = {
  [CartMutationTypes.SET_SELECTED_CART_GOODS](state: CartState, selectedCart: any) {
    state.selectedCart = selectedCart
  },
}
