import { Db } from 'mongodb'
import { getAdminToken, validateAdminToken } from './auth.service'
import { authenticate, checkAdminTokenInHeader } from './auth.controller'
import { UserRole } from '../../../../packages/business-utils/domain/src'
import { TOKEN_ADMIN } from '../secret/secret.service'

let mockDb: jest.Mocked<Db>
// Mocking the functions
jest.mock('../user/user.service', () => ({
  getUserById: jest.fn().mockResolvedValue({}),
}))
jest.mock('./auth.service', () => ({
  getAdminToken: jest.fn().mockResolvedValue('123456789'),
  validateAdminToken: jest.fn().mockResolvedValue(true),
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

  describe('checkAdminTokenInHeader', () => {
    const token = 'token'
    it('should authenticate as admin', async () => {
      const mockvalidateAdminToken =
        require('./auth.service').validateAdminToken
      mockvalidateAdminToken.mockImplementationOnce(() => true)

      const { req, res, next } = createHeaderRequestResponse(token)

      await checkAdminTokenInHeader(req as any, res as any, next)

      expect(res.status).not.toHaveBeenCalledWith(401)
      expect(res.status).not.toHaveBeenCalledWith(500)
    })

    it('should unauthorized the authentification if wrong token', async () => {
      const mockvalidateAdminToken =
        require('./auth.service').validateAdminToken
      mockvalidateAdminToken.mockImplementationOnce(() => false)

      const { req, res, next } = createHeaderRequestResponse(token)

      await checkAdminTokenInHeader(req as any, res as any, next)

      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})

function createHeaderRequestResponse(token: string) {
  return {
    req: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },

    res: {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    },

    next: jest.fn(),
  }
}
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
