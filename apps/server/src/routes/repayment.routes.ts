import express from 'express'
import { getRepayment, payRepayment } from '../repayment/repayment.controller'
import { body } from 'express-validator'

const router = express.Router()

router.get('/:id', getRepayment)
router.post(
  '/:id/pay',
  [
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Amount must be a float greater than 0'),
  ],
  payRepayment
)

export default router
