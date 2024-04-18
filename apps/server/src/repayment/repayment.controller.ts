import { Db } from 'mongodb'
import { getRepaymentById, updateRepaymentToPaid } from './repayment.service'
import {
  GetRepaymentRequest,
  GetRepaymentResponse,
  PayRepaymentRequest,
  PayRepaymentResponse,
} from './repayment.type'
import { validationResult } from 'express-validator'
import { getLoanById } from '../loan/loan.service'

/**
 * Defines the controllers for the repayment routes.
 * The controllers will control the input of the repayment routes
 */

/**
 * Get Repayment by id
 * @param req : Request with id as parameter
 * @param res : Response of the request
 * @returns the repayment object if it exists
 */
export async function getRepayment(
  req: GetRepaymentRequest,
  res: GetRepaymentResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    const id: string = req.params.id
    const repayment = await getRepaymentById(db, id)

    if (!repayment) {
      const notFoundMessage = `Repayment of id ${id} not found`
      console.log(notFoundMessage)
      return res.status(404).send(notFoundMessage)
    }
    console.log(`Repayment of id ${id} returned`)
    return res.status(200).send(repayment)
  } catch (error) {
    console.error(error, error.stack)
    return res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}

/**
 * Pay the repayment of id
 * @param req : Request with id as parameter
 * @param res : Response of the request
 * @returns the id of the Repayment inserted
 */
export async function payRepayment(
  req: PayRepaymentRequest,
  res: PayRepaymentResponse
): Promise<void> {
  try {
    const db: Db = req.app.locals.db

    // Body data validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const id: string = req.params.id
    // convert body data into correct type
    const payment: number = Math.ceil(parseFloat(req.body.amount) * 100) / 100

    const repayment = await getRepaymentById(db, id)

    if (!repayment) {
      const notFoundMessage = `Repayment of id ${id} not found`
      console.log(notFoundMessage)
      return res.status(404).send(notFoundMessage)
    }

    if (repayment.state !== 'PENDING') {
      const notPendingMessage = `You cannot pay Repayment of id ${id} as it is in state ${repayment.state}`
      console.log(notPendingMessage)
      return res.status(403).send(notPendingMessage)
    }

    if (repayment.amount > payment || !payment) {
      const payMoreMessage = `You need to pay ${repayment.amount} or more to get this repayment of id ${id} paid`
      console.log(payMoreMessage)
      return res.status(400).send(payMoreMessage)
    }

    const loan = await getLoanById(db, repayment.loanId)
    if (loan.state !== 'APPROVED') {
      const notApprovedMessage = `You cannot pay Repayment of id ${id} as the loan is in state ${loan.state}`
      console.log(notApprovedMessage)
      return res.status(403).send(notApprovedMessage)
    }

    await updateRepaymentToPaid(db, id, repayment.loanId)
    const approvedMessage = `Repayment of id ${id} paid`
    return res.status(200).send(approvedMessage)
  } catch (error) {
    console.error(error, error.stack)
    return res.status(500).send('Internal Server Error')
  }
}
