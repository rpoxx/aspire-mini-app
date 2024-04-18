import { ObjectId } from 'mongodb'

export interface Repayment {
  paymentDate: Date
  amount: number
  state: RepaymentStatus
  loanId: ObjectId
}

export enum RepaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}
