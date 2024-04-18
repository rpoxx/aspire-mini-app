import { Db, ObjectId } from 'mongodb'
import { getRepayment, payRepayment } from './repayment.controller'
import { getRepaymentById, updateRepaymentToPaid } from './repayment.service'
import {
  LoanStatus,
  RepaymentStatus,
} from '../../../../packages/business-utils/domain/src'
import { body } from 'express-validator'

/**
 * ToDo: Transform the tests into integration test using the same principle of app populate-db
 * We will impelent in the integration tests:
 *  - Every routes and that it works
 *  - Every edge cases which send HTTP error
 *  - The state machine of the repayment
 *  - The queries & body validator
 */

let mockDb: jest.Mocked<Db>
// Mocking the functions
jest.mock('./repayment.service', () => ({
  getRepaymentById: jest.fn().mockResolvedValue({}),
  updateRepaymentToPaid: jest.fn().mockResolvedValue({}),
}))
jest.mock('../loan/loan.service', () => ({
  getLoanById: jest.fn().mockResolvedValue({}),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockDb = {
    collection: jest.fn(),
  } as any
})

describe('repaymentController', () => {
  const repaymentId = new ObjectId('66219dd388d6ee4c5b260c52').toString()
  const loanId = new ObjectId('66219dd388d6ee4c5b260c52').toString()
  describe('getRepayment', () => {
    it('should return a repayment', async () => {
      const mockgetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockgetRepaymentById.mockImplementationOnce(() => Promise.resolve({}))

      const { req, res } = createRequestResponse(mockDb, repaymentId)

      await getRepayment(req as any, res as any)

      expect(getRepaymentById).toHaveBeenCalledWith(mockDb, repaymentId)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should return 404 if repayment is not found', async () => {
      const mockgetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockgetRepaymentById.mockImplementationOnce(() => Promise.resolve(null))

      const { req, res } = createRequestResponse(mockDb, undefined)

      await getRepayment(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })

    it('should return 500 if an error occurs', async () => {
      const mockgetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockgetRepaymentById.mockImplementationOnce(() =>
        Promise.reject({ error: { stack: 'error' } })
      )

      const { req, res } = createRequestResponse(mockDb, undefined)

      await getRepayment(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })
  })

  describe('payRepayment', () => {
    it('should pay payRepayment', async () => {
      const mockGetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockGetRepaymentById.mockImplementationOnce(() =>
        Promise.resolve({ state: RepaymentStatus.PENDING, amount: 100, loanId })
      )
      const mockGetLoanById = require('../loan/loan.service').getLoanById
      mockGetLoanById.mockImplementationOnce(() =>
        Promise.resolve({ state: LoanStatus.APPROVED })
      )

      const { req, res } = createRequestResponse(mockDb, repaymentId)

      await payRepayment(req as any, res as any)

      expect(updateRepaymentToPaid).toHaveBeenCalledWith(
        mockDb,
        repaymentId,
        loanId
      )
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it.each([LoanStatus.PENDING, LoanStatus.PAID])(
      'should return 403 if loan not in status APPROVED',
      async (loanStatus) => {
        const mockgetLoanById = require('../loan/loan.service').getLoanById
        mockgetLoanById.mockImplementationOnce(() =>
          Promise.resolve({ state: loanStatus })
        )
        const mockGetRepaymentById =
          require('./repayment.service').getRepaymentById
        mockGetRepaymentById.mockImplementationOnce(() =>
          Promise.resolve({
            state: RepaymentStatus.PENDING,
            amount: 100,
            loanId,
          })
        )

        const { req, res } = createRequestResponse(mockDb, repaymentId)

        await payRepayment(req as any, res as any)

        expect(updateRepaymentToPaid).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(403)
      }
    )

    it('should return 403 if repayment not in status PENDING', async () => {
      const mockgetLoanById = require('../loan/loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() =>
        Promise.resolve({ state: LoanStatus.APPROVED })
      )
      const mockGetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockGetRepaymentById.mockImplementationOnce(() =>
        Promise.resolve({
          state: RepaymentStatus.PAID,
          amount: 100,
          loanId,
        })
      )

      const { req, res } = createRequestResponse(mockDb, repaymentId)

      await payRepayment(req as any, res as any)

      expect(updateRepaymentToPaid).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('should return 400 if payment <= repayment', async () => {
      const mockgetLoanById = require('../loan/loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() =>
        Promise.resolve({ state: LoanStatus.APPROVED })
      )
      const mockGetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockGetRepaymentById.mockImplementationOnce(() =>
        Promise.resolve({
          state: RepaymentStatus.PENDING,
          amount: 10000,
          loanId,
        })
      )

      const { req, res } = createRequestResponse(mockDb, repaymentId)

      await payRepayment(req as any, res as any)

      expect(updateRepaymentToPaid).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should return 404 if repayment is not found', async () => {
      const mockGetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockGetRepaymentById.mockImplementationOnce(() => Promise.resolve(null))
      const mockGetLoanById = require('../loan/loan.service').getLoanById
      mockGetLoanById.mockImplementationOnce(() =>
        Promise.resolve({ state: LoanStatus.APPROVED })
      )

      const { req, res } = createRequestResponse(mockDb, repaymentId)

      await payRepayment(req as any, res as any)

      expect(updateRepaymentToPaid).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })

    it('should return 500 if an error occurs', async () => {
      const mockGetRepaymentById =
        require('./repayment.service').getRepaymentById
      mockGetRepaymentById.mockImplementationOnce(() =>
        Promise.reject({ error: { stack: 'error' } })
      )
      const mockGetLoanById = require('../loan/loan.service').getLoanById
      mockGetLoanById.mockImplementationOnce(() =>
        Promise.resolve({ state: LoanStatus.APPROVED })
      )

      const { req, res } = createRequestResponse(mockDb, repaymentId)

      await payRepayment(req as any, res as any)

      expect(updateRepaymentToPaid).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })
  })
})

function createRequestResponse(mockDb, repaymentId) {
  return {
    req: {
      app: {
        locals: {
          db: mockDb,
        },
      },
      params: {
        id: repaymentId,
      },
      body: {
        amount: 100,
      },
    },

    res: {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    },
  }
}
