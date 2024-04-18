import { ObjectId } from 'mongodb'

export interface Loan {
  startDate: Date
  amount: number
  term: number
  state: LoanStatus
  customerId: ObjectId
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
}
