import { Db, ObjectId } from 'mongodb'
import { UserDocument } from '../documents/user.document'
import { USER_COLLECTION_NAME } from '../database.constants'
// ToDo: solve why @business-utils/domain is not working doesn't work
import { User } from '../../../../../packages/business-utils/domain/src/index'

/*
 ** Defines the database queries for the user collection.
 */

/**
 * Find user by Id in the database
 * @param db : database connection
 * @param id : id of the user
 * @returns : user document or null
 */
export async function findUserById(
  db: Db,
  id: string
): Promise<UserDocument | null> {
  return await db
    .collection(USER_COLLECTION_NAME)
    .findOne<UserDocument>({ _id: new ObjectId(id) })
}

/**
 * Insert User in collection
 * @param db  : database connection
 * @param user : user object
 * @returns : id of the inserted user
 */
export async function insertUserInDB(db: Db, user: User): Promise<string> {
  const result = await db.collection(USER_COLLECTION_NAME).insertOne(user)
  return result.insertedId.toString()
}
