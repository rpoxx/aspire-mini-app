import { Db, ObjectId } from 'mongodb'
import { updateRepaymentToPaid } from './repayment.service'
import { updateRepaymentState } from '../database/repositories/repayment.repository'
import { RepaymentStatus } from '../../../../packages/business-utils/domain/src'
import { updateLoanToPaid } from '../loan/loan.service'

let mockDb: jest.Mocked<Db>
// Mocking the functions
jest.mock('../database/repositories/repayment.repository', () => ({
  updateRepaymentState: jest.fn().mockResolvedValue(1),
  hasOneRepaymentNotPaid: jest.fn().mockResolvedValue(true),
}))
jest.mock('../loan/loan.service', () => ({
  updateLoanToPaid: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockDb = {
    collection: jest.fn(),
  } as any
})

describe('repaymentService', () => {
  const repaymentId = new ObjectId('66219dd388d6ee4c5b260c52').toString()
  const loanId = new ObjectId('66219dd388d6ee4c5b260c52').toString()

  describe('updateRepaymentToPaid', () => {
    it('should update a repayment to state paid', async () => {
      await updateRepaymentToPaid(mockDb, repaymentId, loanId)

      expect(updateRepaymentState).toHaveBeenCalledWith(
        mockDb,
        loanId,
        RepaymentStatus.PAID
      )
    })
    it('should update a loan state to paid', async () => {
      const mockHasOneRepaymentNotPaid =
        require('../database/repositories/repayment.repository').hasOneRepaymentNotPaid
      mockHasOneRepaymentNotPaid.mockImplementationOnce(() =>
        Promise.resolve(false)
      )
      await updateRepaymentToPaid(mockDb, repaymentId, loanId)
      // Redefine the mock hasOneRepaymentNotPaid to return false
      expect(updateLoanToPaid).toHaveBeenCalledWith(mockDb, loanId)
    })

    it('should not update a loan state to paid', async () => {
      const mockHasOneRepaymentNotPaid =
        require('../database/repositories/repayment.repository').hasOneRepaymentNotPaid
      mockHasOneRepaymentNotPaid.mockImplementationOnce(() =>
        Promise.resolve(true)
      )
      await updateRepaymentToPaid(mockDb, repaymentId, loanId)
      // Redefine the mock hasOneRepaymentNotPaid to return false
      expect(updateLoanToPaid).not.toHaveBeenCalledWith()
    })
  })
})
