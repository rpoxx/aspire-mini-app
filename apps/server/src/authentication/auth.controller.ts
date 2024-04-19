import { Db } from 'mongodb'
import { NextFunction, Request, Response } from 'express'
import { getAdminToken, validateAdminToken } from './auth.service'
import { AuthRequest, AuthResponse } from './auth.type'
import { UserRole } from '../../../../packages/business-utils/domain/src/index'
import { getUserById } from '../user/user.service'

/**
 * Defines the controllers for the auth routes.
 * The controllers will control the input of the auth routes
 */

/**
 *
 * @param req : Request with userId as parameter
 * @param res : Response of the request
 * @returns a token if an admin is connected, otherwise nothing.
 */
export async function authenticate(
  req: AuthRequest,
  res: AuthResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    const userId = req.params.id
    const user = await getUserById(db, userId)

    if (!user) {
      const notFoundMessage = `Authentication refused, user not found`
      console.log(notFoundMessage)
      return res.status(403).send(notFoundMessage)
    }

    const connectedMessage = `User ${userId} connected as ${user.role}.`
    console.log(connectedMessage)

    if (user.role === UserRole.CUSTOMER) {
      return res.status(200).send(connectedMessage)
    }

    if (user.role === UserRole.ADMIN) {
      return res
        .status(200)
        .send(
          connectedMessage + ` Please register your token: ${getAdminToken()}`
        )
    }
  } catch (error) {
    console.error(error, error.stack)
    res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}

/**
 * Check if the admin token in the header is valid
 * @param req : request with a header containing a Bearer token
 * @param res : response
 * @param next : allows the next middleware to be called (next route)
 * @returns an unauthorized response if the admin token in the header is missing or invalid
 */
export function checkAdminTokenInHeader(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader: string = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: Missing Bearer token')
  }

  const token = authHeader.split(' ')[1]

  if (!validateAdminToken(token)) {
    return res.status(401).send('Unauthorized: Invalid Bearer token')
  }

  console.log('Admin token is valid')
  next()
}
