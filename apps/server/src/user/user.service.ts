import { User } from '@business-utils/domain'
import {
  findUserById,
  insertUserInDB,
} from '../database/repositories/user.repository'
import { Db } from 'mongodb'
import { UserDto } from './user.type'
import { TOKEN_ADMIN } from '../secret/secret.service'

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
    role: result.role,
  }
}

export async function insertUser(db: Db, user: User): Promise<string> {
  return await insertUserInDB(db, user)
}

/**
 * retrieve the token of the admin
 * @returns the token to help connect as admin
 */
export function getAdminToken(): string {
  return TOKEN_ADMIN
}

/**
 * validate the admin token
 * @param token : token to validate
 * @returns a boolean indicating if the token is valid
 */
export function validateAdminToken(token: string): boolean {
  return token === TOKEN_ADMIN
}
