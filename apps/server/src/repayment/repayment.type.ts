import { RepaymentStatus } from '@business-utils/domain'
import { Request, Response } from 'express'

// ----- Requests
export type GetRepaymentRequest = Request & {
  params: {
    id: string
  }
}
export type PayRepaymentRequest = Request & {
  params: {
    id: string
  }
  body: {
    amount: number
  }
}

// ----- Responses
export type GetRepaymentResponse = Response & RepaymentDto
export type PayRepaymentResponse = Response

// ----- DTOs
export type RepaymentDto = {
  paymentDate: Date
  amount: number
  state: RepaymentStatus
  loanId: string
}
