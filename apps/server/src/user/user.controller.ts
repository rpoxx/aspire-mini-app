import { Response } from 'express'
import { Db } from 'mongodb'
import { getUserById, insertUser } from './user.service'
import { GetUserRequest, InsertUserRequest } from './user.type'
import { User } from '@business-utils/domain'

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

    const userToInsert: User = req.body
    const userId = await insertUser(db, userToInsert)

    console.log(`User of id ${userId} created`)
    res.status(200).send(userId)
  } catch (error) {
    console.error(error, error.stack)
    res.status(500).send('Internal Server Error')
  }
}
