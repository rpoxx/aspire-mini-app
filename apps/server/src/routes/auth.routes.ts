import express from 'express'
import { authenticate } from '../authentication/auth.controller'

const router = express.Router()

router.get('/:id', authenticate)

export default router
