import { ActionTree, ActionContext } from 'vuex'
import { RootState } from '@/store'
import { PaymentState } from './state'
import { Mutations } from './mutations'
import { PaymentActionTypes } from './action-types'
import { PaymentMutationTypes } from './mutation-types'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>
} & Omit<ActionContext<PaymentState, RootState>, 'commit'>

export interface Actions {
  [PaymentActionTypes.ACTION_RESET_PAYMENT]({ commit }: AugmentedActionContext): void
}

export const actions: ActionTree<PaymentState, RootState> & Actions = {
  [PaymentActionTypes.ACTION_RESET_PAYMENT]({ commit }: AugmentedActionContext) {
    commit(PaymentMutationTypes.SET_PAYMENT_ID, null)
    commit(PaymentMutationTypes.SET_PAY_DATA, null)
    commit(PaymentMutationTypes.SET_PAY_TYPE, null)
    commit(PaymentMutationTypes.SET_REJECT, null)
    commit(PaymentMutationTypes.SET_RESOLVE, null)
    commit(PaymentMutationTypes.SET_SHOW_PAYMENT, false)
  },
}
