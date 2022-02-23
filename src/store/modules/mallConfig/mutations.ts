import { MutationTree } from 'vuex'
import { MallConfigState } from './state'
import { MallConfigMutationTypes } from './mutation-types'

export type Mutations<S = MallConfigState> = {
  [MallConfigMutationTypes.SET_MUT_MALL_CONFIG](state: S, data: any): void
  [MallConfigMutationTypes.SET_MUT_MALL_HEIGHT](state: S, data: any): void
}
export const mutations: MutationTree<MallConfigState> & Mutations = {
  [MallConfigMutationTypes.SET_MUT_MALL_CONFIG](state: MallConfigState, data: any) {
    for (const item in data) {
      if (item === 'navbar') {
        for (let i = 0; i < data[item].navs.length; i++) {
          data[item].navs[i].id = i
        }
      }
      state[item] = data[item]
    }
  },
  [MallConfigMutationTypes.SET_MUT_MALL_HEIGHT](state: MallConfigState, data: any) {
    state.windowHeight = data
  },
}
