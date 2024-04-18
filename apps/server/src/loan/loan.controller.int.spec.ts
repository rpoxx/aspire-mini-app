import { Db, ObjectId } from 'mongodb'
import { approveLoan, getLoan } from './loan.controller'
import { getLoanById, updateLoanToApproved } from './loan.service'
import { LoanStatus } from '../../../../packages/business-utils/domain/src'
/**
 * ToDo: Transform the tests into integration test using the same principle of app populate-db
 * We will impelent in the integration tests:
 *  - Every routes and that it works
 *  - Every edge cases which send HTTP error
 *  - The state machine of the repayments
 *  - The queries & body validator
 */

let mockDb: jest.Mocked<Db>
// Mocking the functions
jest.mock('./loan.service', () => ({
  getLoanById: jest.fn().mockResolvedValue({}),
  updateLoanToApproved: jest.fn().mockResolvedValue({}),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockDb = {
    collection: jest.fn(),
  } as any
})

describe('loanController', () => {
  const loanId = new ObjectId('66219dd388d6ee4c5b260c52').toString()
  describe('getLoan', () => {
    it('should return a loan', async () => {
      const mockgetLoanById = require('./loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() => Promise.resolve({}))

      const { req, res } = createRequestResponse(mockDb, loanId)

      await getLoan(req as any, res as any)

      expect(getLoanById).toHaveBeenCalledWith(mockDb, loanId)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should return 404 if loan is not found', async () => {
      const mockgetLoanById = require('./loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() => Promise.resolve(null))

      const { req, res } = createRequestResponse(mockDb, undefined)

      await getLoan(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })

    it('should return 500 if an error occurs', async () => {
      const mockgetLoanById = require('./loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() =>
        Promise.reject({ error: { stack: 'error' } })
      )

      const { req, res } = createRequestResponse(mockDb, undefined)

      await getLoan(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })
  })

  describe('approveLoan', () => {
    it('should approve loan', async () => {
      const mockgetLoanById = require('./loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() =>
        Promise.resolve({ state: LoanStatus.PENDING })
      )

      const { req, res } = createRequestResponse(mockDb, loanId)

      await approveLoan(req as any, res as any)

      expect(updateLoanToApproved).toHaveBeenCalledWith(mockDb, loanId)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it.each([LoanStatus.APPROVED, LoanStatus.PAID])(
      'should return 403 if loan not in status PENDING',
      async (loanStatus) => {
        const mockgetLoanById = require('./loan.service').getLoanById
        mockgetLoanById.mockImplementationOnce(() =>
          Promise.resolve({ state: loanStatus })
        )

        const { req, res } = createRequestResponse(mockDb, loanId)

        await approveLoan(req as any, res as any)

        expect(updateLoanToApproved).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(403)
      }
    )

    it('should return 404 if loan is not found', async () => {
      const mockgetLoanById = require('./loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() => Promise.resolve(null))

      const { req, res } = createRequestResponse(mockDb, undefined)

      await getLoan(req as any, res as any)

      expect(updateLoanToApproved).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })

    it('should return 500 if an error occurs', async () => {
      const mockgetLoanById = require('./loan.service').getLoanById
      mockgetLoanById.mockImplementationOnce(() =>
        Promise.reject({ error: { stack: 'error' } })
      )

      const { req, res } = createRequestResponse(mockDb, undefined)

      await getLoan(req as any, res as any)

      expect(updateLoanToApproved).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith(expect.any(String))
    })
  })
})

function createRequestResponse(mockDb, loanId) {
  return {
    req: {
      app: {
        locals: {
          db: mockDb,
        },
      },
      params: {
        id: loanId,
      },
    },

    res: {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    },
  }
}
