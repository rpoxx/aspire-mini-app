import { Db } from 'mongodb'
import { getAdminToken } from './auth.service'
import { AuthRequest, AuthResponse } from './user.type'
import { UserRole } from '../../../../packages/business-utils/domain/src/index'
import { getUserById } from '../user/user.service'

/**
 * Defines the controllers for the user routes.
 * The controllers will control the input of the user routes
 */

/**
 *
 * @param req : Request with id as parameter
 * @param res : Response of the request
 * @returns the user object if it exists
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
