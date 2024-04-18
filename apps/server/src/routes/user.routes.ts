import express from 'express'
import { getUser, createUser } from '../user/user.controller'
import { body } from 'express-validator'

const router = express.Router()

router.post(
  '/',
  [
    body('name').isString().withMessage('Name must be a string'),
    body('email').isString().withMessage('Email must be a string'),
    body('role')
      .isString()
      .withMessage('Role must be a string')
      .custom((value) => {
        if (value !== 'ADMIN' && value !== 'CUSTOMER') {
          throw new Error('Invalid role')
        }
        return true
      }),
  ],
  createUser
)
router.get('/:id', getUser)

export default router
