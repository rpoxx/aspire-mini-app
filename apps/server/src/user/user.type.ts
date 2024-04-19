import { User, UserRole } from '@business-utils/domain'
import { Request, Response } from 'express'

export type GetUserRequest = Request & {
  params: {
    id: string
  }
}
export type AuthRequest = Request & {
  params: {
    id: string
  }
}

export type InsertUserRequest = Request & {
  body: User
}
export type AuthResponse = Response & string

export type UserDto = {
  name: string
  email: string
  role: UserRole
}
