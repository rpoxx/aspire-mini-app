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
 * @param repaymentId : id of the repayment
 * @returns the Repayment or null if the Repayment is not found
 */
export async function getRepaymentById(
  db: Db,
  repaymentId: string
): Promise<RepaymentDto | null> {
  const result = await findRepaymentById(db, repaymentId)
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
 * @param repaymentId : id of the repayment to be paid
 * @param loanId : id of the loan associated to the repayment
 * @returns nothing
 */
export async function updateRepaymentToPaid(
  db: Db,
  repaymentId: string,
  loanId: string
): Promise<void> {
  const numberOfRepaymentPaid = await updateRepaymentState(
    db,
    repaymentId,
    RepaymentStatus.PAID
  )

  if (numberOfRepaymentPaid === 0) {
    throw new Error(`Repayment of id ${repaymentId} could not be paid`)
  }

  console.log(`Repayment of id ${repaymentId} paid`)

  // Mock the event we want to send to the event platform
  console.log('Event repayment.paid sent to event platform')
  // Mock the reception of the event by the service NotificationService
  console.log('Event repayment.paid received by Notification Service')
  console.log(
    `Sending notification to customer that repayment ${repaymentId} has been paid`
  )
  // Mock the reception of the event by the service DataService
  console.log('Event repayment.paid received by Data Service')

  if ((await hasOneRepaymentNotPaid(db, loanId)) === true) {
    return
  }
  return await updateLoanToPaid(db, loanId)
}
