import { Db } from 'mongodb'
import {
  getLoanById,
  getLoansForCustomerId,
  insertLoan,
  updateLoanToApproved,
} from './loan.service'
import {
  ApproveLoanRequest,
  ApproveLoanResponse,
  GetLoanRequest,
  GetLoanResponse,
  GetLoansForCustomerRequest,
  GetLoansForCustomerResponse,
  RequestLoanDto,
  RequestLoanRequest,
  RequestLoanResponse,
} from './loan.type'
import { validationResult } from 'express-validator'

/**
 * Get loan by Id
 * @param req : Request with loan id as parameter
 * @param res : Response of the request
 * @returns the loan object if it exists
 */
export async function getLoan(
  req: GetLoanRequest,
  res: GetLoanResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    const id: string = req.params.id
    const loan = await getLoanById(db, id)

    if (!loan) {
      const notFoundMessage = `Loan of id ${id} not found`
      console.log(notFoundMessage)
      return res.status(404).send(notFoundMessage)
    }
    console.log(`Loan of id ${id} returned`)
    return res.status(200).send(loan)
  } catch (error) {
    console.error(error, error.stack)
    return res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}

/**
 * Get loans of customerId
 * @param req : Request with customer id as parameter
 * @param res : Response of the request
 * @returns the loans object of the customer
 */
export async function getLoansOfCustomer(
  req: GetLoansForCustomerRequest,
  res: GetLoansForCustomerResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    const customerId: string = req.params.customerId
    const loans = await getLoansForCustomerId(db, customerId)

    console.log(`Loans of customer ${customerId} returned`)
    return res.status(200).send(loans)
  } catch (error) {
    console.error(error, error.stack)
    return res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}

/**
 * Request a loan from a user
 * @param req : Request of the query with the loan object as body
 * @param res : Response of the request
 * @returns the id of the User inserted
 */
export async function requestLoan(
  req: RequestLoanRequest,
  res: RequestLoanResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    // Body data validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // convert body data into correct type
    const loanToInsert: RequestLoanDto = {
      startDate: new Date(req.body.startDate),
      amount: Math.ceil(parseFloat(req.body.amount) * 100) / 100,
      term: parseInt(req.body.term),
      customerId: req.body.customerId,
    }

    const loanInsertedId = await insertLoan(db, loanToInsert)
    return res.status(200).send(`Load of id ${loanInsertedId} created`)
  } catch (error) {
    console.error(error, error.stack)
    return res.status(500).send('Internal Server Error')
  }
}

/**
 * Approve a loan from an admin
 * @param req : Request with loan id as parameter
 * @param res : Response of the request
 * @returns a message about the approbation of the loan
 */
export async function approveLoan(
  req: ApproveLoanRequest,
  res: ApproveLoanResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    // toDo: check types of loan
    const id: string = req.params.id
    const loan = await getLoanById(db, id)

    if (!loan) {
      const notFoundMessage = `Loan of id ${id} not found`
      console.log(notFoundMessage)
      return res.status(404).send(notFoundMessage)
    }

    if (loan.state !== 'PENDING') {
      const notPendingMessage = `You cannot approve Loan of id ${id} as it is in state ${loan.state}`
      console.log(notPendingMessage)
      return res.status(403).send(notPendingMessage)
    }

    await updateLoanToApproved(db, id)
    const approvedMessage = `Loan of id ${id} approved`
    console.log(approvedMessage)
    return res.status(200).send(approvedMessage)
  } catch (error) {
    console.error(error, error.stack)
    return res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}
