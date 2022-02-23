import { ActionTree, ActionContext } from 'vuex'
import { RootState } from '@/store'
import { MallConfigState } from './state'
import { Mutations } from './mutations'
import { MallConfigActionTypes } from './action-types'
import { MallConfigMutationTypes } from './mutation-types'
import $mallConfig from '@/libs/mallConfig'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>
} & Omit<ActionContext<MallConfigState, RootState>, 'commit'>

export interface Actions {
  [MallConfigActionTypes.ACTION_MALL_GET_CONFIG]({ commit }: AugmentedActionContext): void
  [MallConfigActionTypes.ACTION_MALL_MUT_HEIGHT]({ commit }: AugmentedActionContext, data: any): void
  [MallConfigActionTypes.ACTION_MALL_RESET_CONFIG]({ commit }: AugmentedActionContext, data: any): void
}

export const actions: ActionTree<MallConfigState, RootState> & Actions = {
  [MallConfigActionTypes.ACTION_MALL_GET_CONFIG]({ commit }: AugmentedActionContext) {
    $mallConfig
      .getConfig()
      .then((response) => {
        commit(MallConfigMutationTypes.SET_MUT_MALL_CONFIG, response)
      })
      .catch(() => {})
  },
  [MallConfigActionTypes.ACTION_MALL_MUT_HEIGHT]({ commit }: AugmentedActionContext, data: any) {
    commit(MallConfigMutationTypes.SET_MUT_MALL_HEIGHT, data)
  },
  [MallConfigActionTypes.ACTION_MALL_RESET_CONFIG]({ commit }: AugmentedActionContext) {
    $mallConfig.resetConfig()

    $mallConfig
      .getConfig()
      .then((response) => {
        commit(MallConfigMutationTypes.SET_MUT_MALL_CONFIG, response)
      })
      .catch(() => {})
  },
}
