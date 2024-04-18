import { LoanStatus, Repayment } from '@business-utils/domain'
import { Request, Response } from 'express'

// ----- Requests
export type GetLoanRequest = Request & {
  params: {
    id: string
  }
}
export type GetLoansForCustomerRequest = Request & {
  params: {
    customerId: string
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
export type GetLoansForCustomerResponse = Response & LoanForCutsomerIdDto
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

export type LoanForCutsomerIdDto = {
  startDate: Date
  amount: number
  term: number
  state: LoanStatus
  repayments: Omit<Repayment, 'loanId'>[]
}

export type RequestLoanDto = {
  startDate: Date
  amount: number
  term: number
  customerId: string
}
