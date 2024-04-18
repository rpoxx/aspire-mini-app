import { Db, ObjectId } from 'mongodb'
import { LoanDocument } from '../documents/loan.document'
import { LOAN_COLLECTION_NAME } from '../database.constants'
// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  Loan,
  LoanStatus,
} from '../../../../../packages/business-utils/domain/src/index'

/*
 ** Defines the database queries for the loan collection.
 */

/**
 * Find loan by Id in the database
 * @param db : database connection
 * @param id : id of the loan
 * @returns : loan document or null
 */
export async function findLoanById(
  db: Db,
  id: string
): Promise<LoanDocument | null> {
  return await db
    .collection(LOAN_COLLECTION_NAME)
    .findOne<LoanDocument>({ _id: new ObjectId(id) })
}

/**
 * Find loans for a specific customerId in the database
 * @param db : database connection
 * @param customerId : id of the customer
 * @returns : loans document or null
 */
export async function findLoansForCustomerId(
  db: Db,
  customerId: string
): Promise<LoanDocument[] | null> {
  return await db
    .collection(LOAN_COLLECTION_NAME)
    .find<LoanDocument>({ customerId: new ObjectId(customerId) })
    .toArray()
}

/**
 * Insert Loan in collection
 * @param db  : database connection
 * @param user : loan object
 * @returns : id of the inserted loan
 */
export async function insertLoanInDB(db: Db, loan: Loan): Promise<string> {
  const result = await db.collection(LOAN_COLLECTION_NAME).insertOne(loan)
  return result.insertedId.toString()
}

/**
 * Update Loan state in collection
 * @param db  : database connection
 * @param id : loan id
 * @returns : number of loan updated
 */
export async function updateLoanState(
  db: Db,
  id: string,
  newState: LoanStatus
): Promise<number> {
  const result = await db
    .collection(LOAN_COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(id) }, { $set: { state: newState } })
  return result.modifiedCount
}
