import {
  findLoanById,
  findLoansForCustomerId,
  insertLoanInDB,
  updateLoanState,
} from '../database/repositories/loan.repository'
// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  Loan,
  LoanStatus,
  Repayment,
  RepaymentStatus,
} from '../../../../packages/business-utils/domain/src/index'
import { Db, ObjectId } from 'mongodb'
import { LoanDto, LoanForCutsomerIdDto, RequestLoanDto } from './loan.type'
import { initRepayment } from '../repayment/repayment.service'
import { findRepaymentsByLoanId } from '../database/repositories/repayment.repository'

/**
 * Find loan by Id
 * @param db : database connection
 * @param id : id of the loan
 * @returns the Loan DTO or null if the loan is not found
 */
export async function getLoanById(db: Db, id: string): Promise<LoanDto | null> {
  const result = await findLoanById(db, id)
  if (!result) {
    return null
  }
  return {
    startDate: result.startDate,
    amount: result.amount,
    term: result.term,
    state: result.state,
    customerId: result.customerId.toString(),
  }
}

/**
 * Find loans for a customerId
 * @param db : database connection
 * @param customerId : id of the customer
 * @returns an array of loans with the repayments for the customer
 */
export async function getLoansForCustomerId(
  db: Db,
  customerId: string
): Promise<LoanForCutsomerIdDto[]> {
  const loans = await findLoansForCustomerId(db, customerId)
  const loanWithRepayments = await Promise.all(
    // Join all repayments associated to the loan
    loans.map(async (loan) => {
      const repaymentsDocuments = await findRepaymentsByLoanId(
        db,
        loan._id.toString()
      )
      const repayments = repaymentsDocuments.map((repayment) => {
        return {
          _id: repayment._id,
          paymentDate: repayment.paymentDate,
          amount: repayment.amount,
          state: repayment.state,
        }
      })
      return {
        startDate: loan.startDate,
        amount: loan.amount,
        term: loan.term,
        state: loan.state,
        repayments,
      }
    })
  )
  return loanWithRepayments
}

/**
 * Service which request a loan. Once the loan has been inserted, it will
 * trigger an Event to the event platform.
 * @param db : database connection
 * @param requestLoan : loan requested by the Customer
 * @returns the id of the loan inserted
 */
export async function insertLoan(
  db: Db,
  requestLoan: RequestLoanDto
): Promise<string> {
  const newLoan: Loan = {
    startDate: requestLoan.startDate,
    amount: requestLoan.amount,
    term: requestLoan.term,
    state: LoanStatus.PENDING,
    customerId: new ObjectId(requestLoan.customerId),
  }
  const insertedLoanId = await insertLoanInDB(db, newLoan)
  console.log(`Loan of id ${insertedLoanId} created`)

  // Initialise repayments
  for (let i = 1; i < requestLoan.term + 1; i++) {
    const newRepayment: Repayment = {
      // Set date to i * 7 days after the start date
      paymentDate: new Date(
        requestLoan.startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000
      ),
      amount: Math.ceil((requestLoan.amount / requestLoan.term) * 100) / 100,
      state: RepaymentStatus.PENDING,
      loanId: new ObjectId(insertedLoanId),
    }
    const newRepaymentId = await initRepayment(db, newRepayment)
    console.log(`Repayment of id ${newRepaymentId} created`)
  }

  // Mock the event we want to send to the event platform
  console.log('Event loan.requested sent to event platform')
  // Mock the reception of the event by the service NotificationService
  console.log('Event loan.requested received by Notification Service')
  console.log(
    `Sending notification to admin that loan ${insertedLoanId} has been requested`
  )
  // Mock the reception of the event by the service DataService
  console.log('Event loan.requested received by Data Service')

  return insertedLoanId
}

/**
 * Service which approves a loan. Once the loan has been approved, it will
 * trigger an Event to the event platform.
 * @param db : database connection
 * @param loanId : id of the loan to update to approved state
 * @returns nothing
 */
export async function updateLoanToApproved(
  db: Db,
  loanId: string
): Promise<void> {
  const numberOfLoanApproved = await updateLoanState(
    db,
    loanId,
    LoanStatus.APPROVED
  )

  if (numberOfLoanApproved === 0) {
    throw new Error(`Loan of id ${loanId} could not be approved`)
  }

  // Mock the event we want to send to the event platform
  console.log('Event loan.approved sent to event platform')
  // Mock the reception of the event by the service NotificationService
  console.log('Event loan.approved received by Notification Service')
  console.log(
    `Sending notification to customer that loan ${loanId} has been approved`
  )
  // Mock the reception of the event by the service SchedulePaymentService
  console.log('Event loan.approved received by Schedule Payment Service')
  console.log('Scheduling notification before deadline of payment to Customer')
  // Mock the reception of the event by the service DataService
  console.log('Event loan.approved received by Data Service')
}

/**
 * Service which mark the loan at paid.
 * It will trigger an Event to the event platform.
 * @param db : database connection
 * @param loanId : id of the loan to update to paid state
 * @returns nothing
 */
export async function updateLoanToPaid(db: Db, loanId: string): Promise<void> {
  const numberOfLoanPaid = await updateLoanState(db, loanId, LoanStatus.PAID)

  if (numberOfLoanPaid === 0) {
    throw new Error(`Loan of id ${loanId} could not be paid`)
  }

  console.log(`Loan of id ${loanId} has been paid`)
  // Mock the event we want to send to the event platform
  console.log('Event loan.paid sent to event platform')
  // Mock the reception of the event by the service NotificationService
  console.log('Event loan.paid received by Notification Service')
  console.log(
    `Sending notification to customer that loan ${loanId} has been paid`
  )
  console.log(`Sending notification to admin that loan ${loanId} has been paid`)
  // Mock the reception of the event by the service DataService
  console.log('Event loan.paid received by Data Service')
}
