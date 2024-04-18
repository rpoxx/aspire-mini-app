import express from 'express'
import { getUser, createUser } from './user.controller'

const router = express.Router()

router.post('/', createUser)
router.get('/:id', getUser)

export default router
