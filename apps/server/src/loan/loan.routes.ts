import express from 'express'
import { getLoan, requestLoan, approveLoan } from './loan.controller'
import { body } from 'express-validator'

const router = express.Router()

router.get('/:id', getLoan)
router.post(
  '/request',
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
