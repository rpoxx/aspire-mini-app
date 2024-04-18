import { LoanStatus } from '@business-utils/domain'
import { Request, Response } from 'express'

// ----- Requests
export type GetLoanRequest = Request & {
  params: {
    id: string
  }
}
export type RequestLoanRequest = Request & RequestLoanDto
export type ApproveLoanRequest = Request & {
  params: {
    id: string
  }
}

// ----- Responses
export type GetLoanResponse = Response & LoanDto
export type RequestLoanResponse = Response & string
export type ApproveLoanResponse = Response

// ----- DTOs
export type LoanDto = {
  startDate: Date
  amount: number
  term: number
  state: LoanStatus
  customerId: string
}

export type RequestLoanDto = {
  startDate: Date
  amount: number
  term: number
  customerId: string
}
