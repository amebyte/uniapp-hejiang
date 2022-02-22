import { MutationTree } from 'vuex'
import { PaymentState } from './state'
import { PaymentMutationTypes } from './mutation-types'

export type Mutations<S = PaymentState> = {
  [PaymentMutationTypes.SET_PAYMENT_ID](state: S, id: any): void
  [PaymentMutationTypes.SET_SHOW_PAYMENT](state: S, flag: boolean): void
  [PaymentMutationTypes.SET_PAY_DATA](state: S, data: any): void
  [PaymentMutationTypes.SET_PAY_TYPE](state: S, data: any): void
  [PaymentMutationTypes.SET_RESOLVE](state: S, data: any): void
  [PaymentMutationTypes.SET_REJECT](state: S, data: any): void
  [PaymentMutationTypes.SET_ALL](state: S, data: any): void
}
export const mutations: MutationTree<PaymentState> & Mutations = {
  [PaymentMutationTypes.SET_PAYMENT_ID](state: PaymentState, id: any) {
    state.id = id
  },
  [PaymentMutationTypes.SET_SHOW_PAYMENT](state: PaymentState, flag: boolean) {
    state.showPayment = flag
  },
  [PaymentMutationTypes.SET_PAY_DATA](state: PaymentState, data: any) {
    state.payData = data
  },
  [PaymentMutationTypes.SET_PAY_TYPE](state: PaymentState, data: any) {
    state.payType = data
  },
  [PaymentMutationTypes.SET_RESOLVE](state: PaymentState, data: any) {
    state.resolve = data
  },
  [PaymentMutationTypes.SET_REJECT](state: PaymentState, data: any) {
    state.reject = data
  },
  [PaymentMutationTypes.SET_ALL](state: PaymentState, data: any) {
    for (const k in data) {
      state[k] = data[k]
    }
  },
}
