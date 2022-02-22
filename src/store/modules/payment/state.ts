export interface PaymentState {
  id: any
  showPayment: boolean
  payData: any
  payType: any
  resolve: any
  reject: any
}

export const state = {
  id: null,
  showPayment: false,
  payData: null,
  payType: null,
  resolve: null,
  reject: null,
}
