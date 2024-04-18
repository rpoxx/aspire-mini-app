import { Db, ObjectId } from 'mongodb'
import { REPAYMENT_COLLECTION_NAME } from '../database.constants'
// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  Repayment,
  RepaymentStatus,
} from '../../../../../packages/business-utils/domain/src/index'
import { RepaymentDocument } from '../documents/repayment.document'

/*
 ** Defines the database queries for the repayment collection.
 */

/**
 * Find Repayment by Id in the database
 * @param db : database connection
 * @param id : id of the repayment
 * @returns : repayment document or null
 */
export async function findRepaymentById(
  db: Db,
  id: string
): Promise<RepaymentDocument | null> {
  return await db
    .collection(REPAYMENT_COLLECTION_NAME)
    .findOne<RepaymentDocument>({ _id: new ObjectId(id) })
}

/**
 * Find Repayments by loanId in the database
 * @param db : database connection
 * @param loanId : id of the loan
 * @returns : repayment documents or null
 */
export async function findRepaymentsByLoanId(
  db: Db,
  loanId: string
): Promise<RepaymentDocument[] | null> {
  return await db
    .collection(REPAYMENT_COLLECTION_NAME)
    .find<RepaymentDocument>({ loanId: new ObjectId(loanId) })
    .toArray()
}

/**
 * Insert Repayment in collection
 * @param db  : database connection
 * @param repayment : repayment object
 * @returns : id of the inserted repayment
 */
export async function insertRepaymentInDB(
  db: Db,
  repayment: Repayment
): Promise<string> {
  const result = await db
    .collection(REPAYMENT_COLLECTION_NAME)
    .insertOne(repayment)
  return result.insertedId.toString()
}

/**
 * Update Repayment state in collection
 * @param db  : database connection
 * @param id : repayment id
 * @returns : number of repayment updated
 */
export async function updateRepaymentState(
  db: Db,
  id: string,
  newState: RepaymentStatus
): Promise<number> {
  const result = await db
    .collection(REPAYMENT_COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(id) }, { $set: { state: newState } })
  return result.modifiedCount
}

/**
 * Check if there is at least one repayment not paid
 * @param db : database connection
 * @param loanId : id of the loan
 * @returns true if there is at least one repayment not paid
 */
export async function hasOneRepaymentNotPaid(
  db: Db,
  loanId: string
): Promise<boolean> {
  const repayments = await db
    .collection(REPAYMENT_COLLECTION_NAME)
    .find<RepaymentDocument>({ loanId: new ObjectId(loanId) })
    .toArray()
  return repayments.some(
    (repayment) => repayment.state !== RepaymentStatus.PAID
  )
}
