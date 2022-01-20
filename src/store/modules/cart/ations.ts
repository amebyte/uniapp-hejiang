import { ActionTree, ActionContext } from 'vuex'
import { RootState } from '@/store'
import { CartState } from './state'
import { Mutations } from './mutations'
import { CartActionTypes } from './action-types'
import { CartMutationTypes } from './mutation-types'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>
} & Omit<ActionContext<CartState, RootState>, 'commit'>

export interface Actions {
  [CartActionTypes.ACTION_SELECTED_CART_GOODS]({ commit }: AugmentedActionContext, data: any): void
  [CartActionTypes.ACTION_PREVIEW_ORDER_PARAM]({ commit }: AugmentedActionContext, data: any): void
}

export const actions: ActionTree<CartState, RootState> & Actions = {
  [CartActionTypes.ACTION_SELECTED_CART_GOODS]({ commit }: AugmentedActionContext, data: any) {
    commit(CartMutationTypes.SET_SELECTED_CART_GOODS, data)
  },
  [CartActionTypes.ACTION_PREVIEW_ORDER_PARAM]({ commit }: AugmentedActionContext, data: any) {
    commit(CartMutationTypes.SET_PREVIEW_ORDER_PARAM, data)
  },
}
