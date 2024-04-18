import { Db, ObjectId } from 'mongodb'
import { RequestLoanDto } from './loan.type'
import {
  insertLoan,
  updateLoanToApproved,
  updateLoanToPaid,
} from './loan.service'
import {
  LoanStatus,
  RepaymentStatus,
} from '../../../../packages/business-utils/domain/src'
import { initRepayment } from '../repayment/repayment.service'
import {
  insertLoanInDB,
  updateLoanState,
} from '../database/repositories/loan.repository'

let mockDb: jest.Mocked<Db>
// Mocking the functions
jest.mock('../database/repositories/loan.repository', () => ({
  insertLoanInDB: jest.fn().mockResolvedValue(new ObjectId().toString()),
  updateLoanState: jest.fn().mockResolvedValue(1),
}))
jest.mock('../repayment/repayment.service', () => ({
  initRepayment: jest.fn().mockResolvedValue(new ObjectId().toString()),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockDb = {
    collection: jest.fn(),
  } as any
})

describe('loanService', () => {
  const loanId = new ObjectId('66219dd388d6ee4c5b260c52').toString()
  describe('insertLoan', () => {
    it('should insert a loan and initialize repayments', async () => {
      const loanRequested: RequestLoanDto = {
        startDate: new Date(),
        amount: 1000,
        term: 12,
        customerId: new ObjectId().toString(),
      }

      await insertLoan(mockDb, loanRequested)

      expect(insertLoanInDB).toHaveBeenCalledWith(
        mockDb,
        expect.objectContaining({
          state: LoanStatus.PENDING,
        })
      )
      expect(initRepayment).toHaveBeenCalledWith(
        mockDb,
        expect.objectContaining({
          amount:
            Math.ceil((loanRequested.amount / loanRequested.term) * 100) / 100,
          state: RepaymentStatus.PENDING,
        })
      )
      expect(initRepayment).toHaveBeenCalledTimes(loanRequested.term)
    })
  })

  describe('updateLoanToApproved', () => {
    it('should update a loan to state approved', async () => {
      await updateLoanToApproved(mockDb, loanId)

      expect(updateLoanState).toHaveBeenCalledWith(
        mockDb,
        loanId,
        LoanStatus.APPROVED
      )
    })
  })

  describe('updateLoanToPay', () => {
    it('should update a loan to state paid', async () => {
      await updateLoanToPaid(mockDb, loanId)

      expect(updateLoanState).toHaveBeenCalledWith(
        mockDb,
        loanId,
        LoanStatus.PAID
      )
    })
  })
})
