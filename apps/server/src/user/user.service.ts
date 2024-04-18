import { User } from '@business-utils/domain'
import {
  findUserById,
  insertUserInDB,
} from '../database/repositories/user.repository'
import { Db } from 'mongodb'
import { UserDto } from './user.type'

/**
 * Find user by Id
 * @param db : database connection
 * @param id : id of the user
 * @returns the User DTO or null if the user is not found
 */
export async function getUserById(db: Db, id: string): Promise<UserDto | null> {
  const result = await findUserById(db, id)
  if (!result) {
    return null
  }
  return {
    name: result.name,
    email: result.email,
  }
}

export async function insertUser(db: Db, user: User): Promise<string> {
  return await insertUserInDB(db, user)
}
