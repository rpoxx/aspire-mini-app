// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  Repayment,
  RepaymentStatus,
} from '../../../../packages/business-utils/domain/src/index'
import { Db } from 'mongodb'
import {
  findRepaymentById,
  hasOneRepaymentNotPaid,
  insertRepaymentInDB,
  updateRepaymentState,
} from '../database/repositories/repayment.repository'
import { RepaymentDto } from './repayment.type'
import { updateLoanToPaid } from '../loan/loan.service'

/**
 * Find repayment by Id
 * @param db : database connection
 * @param id : id of the repayment
 * @returns the Repayment or null if the Repayment is not found
 */
export async function getRepaymentById(
  db: Db,
  id: string
): Promise<RepaymentDto | null> {
  const result = await findRepaymentById(db, id)
  if (!result) {
    return null
  }
  return {
    paymentDate: result.paymentDate,
    amount: result.amount,
    state: result.state,
    loanId: result.loanId.toString(),
  }
}

/**
 * Initialize a repayment while the loan is being requested
 * @param db : database connection
 * @param repayment : repayment object
 * @returns the id of the inserted repayment
 */
export async function initRepayment(
  db: Db,
  repayment: Repayment
): Promise<string> {
  return await insertRepaymentInDB(db, repayment)
}

/**
 * Service which pay a repayment. Once the repayment has been paid, it will
 * trigger an Event to the event platform.
 * @param db : database connection
 * @param payRepayment : repayment requested by the Customer
 * @param loanId : id of the loan associated to the repayment
 * @returns nothing
 */
export async function updateRepaymentToPaid(
  db: Db,
  id: string,
  loanId: string
): Promise<void> {
  const numberOfRepaymentPaid = await updateRepaymentState(
    db,
    id,
    RepaymentStatus.PAID
  )

  if (numberOfRepaymentPaid === 0) {
    throw new Error(`Repayment of id ${id} could not be paid`)
  }

  console.log(`Repayment of id ${id} paid`)

  // Mock the event we want to send to the event platform
  console.log('Event repayment.paid sent to event platform')
  // Mock the reception of the event by the service NotificationService
  console.log('Event repayment.paid received by Notification Service')
  console.log(
    `Sending notification to customer that repayment ${id} has been paid`
  )
  // Mock the reception of the event by the service DataService
  console.log('Event repayment.paid received by Data Service')

  if ((await hasOneRepaymentNotPaid(db, loanId)) === true) {
    return
  }
  return await updateLoanToPaid(db, loanId)
}
