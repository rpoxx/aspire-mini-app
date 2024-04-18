import express from 'express'
import {
  getLoan,
  requestLoan,
  approveLoan,
  getLoansOfCustomer,
} from '../loan/loan.controller'
import { body, query } from 'express-validator'

const router = express.Router()

router.get('/:id', getLoan)
router.get(
  '/customer/:customerId',
  query('customerId')
    .isMongoId()
    .withMessage('Customer Id must be a mongo string id'),
  getLoansOfCustomer
)
router.post(
  '/',
  [
    body('startDate').isISO8601().withMessage('Start Date must be a date'),
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Amount must be a float greater than 0'),
    body('term').isInt({ min: 1 }).withMessage('Term must be greater than 0'),
    body('customerId')
      .isMongoId()
      .withMessage('Customer Id must be a mongo string id'),
  ],
  requestLoan
)
router.post('/:id/approve', approveLoan)

export default router
