import { Db } from 'mongodb'
import { getAdminToken } from './auth.service'
import { authenticate } from './auth.controller'
import { UserRole } from '../../../../packages/business-utils/domain/src'

let mockDb: jest.Mocked<Db>
// Mocking the functions
jest.mock('../user/user.service', () => ({
  getUserById: jest.fn().mockResolvedValue({}),
}))
jest.mock('./auth.service', () => ({
  getAdminToken: jest.fn().mockResolvedValue('123456789'),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockDb = {
    collection: jest.fn(),
  } as any
})

describe('authController', () => {
  const userId = 'userId'
  describe('authenticate', () => {
    it('should authenticate as admin', async () => {
      const mockGetUserById = require('../user/user.service').getUserById
      mockGetUserById.mockImplementationOnce(() =>
        Promise.resolve({ role: UserRole.ADMIN })
      )

      const { req, res } = createRequestResponse(mockDb, userId)

      await authenticate(req as any, res as any)

      expect(getAdminToken).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should authenticate as customer', async () => {
      const mockGetUserById = require('../user/user.service').getUserById
      mockGetUserById.mockImplementationOnce(() =>
        Promise.resolve({ role: UserRole.CUSTOMER })
      )

      const { req, res } = createRequestResponse(mockDb, userId)

      await authenticate(req as any, res as any)

      expect(getAdminToken).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should return 403 if the user is not found', async () => {
      const mockGetUserById = require('../user/user.service').getUserById
      mockGetUserById.mockImplementationOnce(() => Promise.resolve(null))

      const { req, res } = createRequestResponse(mockDb, undefined)

      await authenticate(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(getAdminToken).not.toHaveBeenCalled()
    })

    it('should return 500 if an error occurs', async () => {
      const mockgetLoanById = require('../user/user.service').getUserById
      mockgetLoanById.mockImplementationOnce(() =>
        Promise.reject({ error: { stack: 'error' } })
      )

      const { req, res } = createRequestResponse(mockDb, undefined)

      await authenticate(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})

function createRequestResponse(mockDb, userId) {
  return {
    req: {
      app: {
        locals: {
          db: mockDb,
        },
      },
      params: {
        id: userId,
      },
    },

    res: {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    },
  }
}
