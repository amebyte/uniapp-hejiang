import { ActionTree, ActionContext } from 'vuex'
import { RootState } from '@/store'
import { MallConfigState } from './state'
import { Mutations } from './mutations'
import { MallConfigActionTypes } from './action-types'
import { MallConfigMutationTypes } from './mutation-types'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>
} & Omit<ActionContext<MallConfigState, RootState>, 'commit'>

export interface Actions {
  [MallConfigActionTypes.ACTION_GET_MALL_CONFIG]({ commit }: AugmentedActionContext): void
}

export const actions: ActionTree<MallConfigState, RootState> & Actions = {
  [MallConfigActionTypes.ACTION_GET_MALL_CONFIG]({ commit }: AugmentedActionContext) {},
}
