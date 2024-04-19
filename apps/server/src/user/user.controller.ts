import { Response, Request, NextFunction } from 'express'
import { Db } from 'mongodb'
import {
  getAdminToken,
  getUserById,
  insertUser,
  validateAdminToken,
} from './user.service'
import {
  AuthRequest,
  AuthResponse,
  GetUserRequest,
  InsertUserRequest,
} from './user.type'
import { User, UserRole } from '../../../../packages/business-utils/domain/src'
import { validationResult } from 'express-validator'

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
export async function getUser(
  req: GetUserRequest,
  res: Response
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    const id = req.params.id
    const user = await getUserById(db, id)

    if (!user) {
      const notFoundMessage = `User of id ${id} not found`
      console.log(notFoundMessage)
      return res.status(404).send(notFoundMessage)
    }
    console.log(`User of id ${id} returned`)
    res.status(200).send(user)
  } catch (error) {
    console.error(error, error.stack)
    res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}

/**
 * Insert a user into the database
 * @param req : Request of the query with the user object as body
 * @param res : Response of the request
 * @returns the id of the User inserted
 */
export async function createUser(
  req: InsertUserRequest,
  res: Response
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    // Body data validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const userToInsert: User = req.body
    const userId = await insertUser(db, userToInsert)

    console.log(`User of id ${userId} created`)
    res.status(200).send(userId)
  } catch (error) {
    console.error(error, error.stack)
    res.status(500).send('Internal Server Error')
  }
}

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
