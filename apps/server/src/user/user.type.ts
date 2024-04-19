import { User, UserRole } from '@business-utils/domain'
import { Request } from 'express'

export type GetUserRequest = Request & {
  params: {
    id: string
  }
}

export type InsertUserRequest = Request & {
  body: User
}

export type UserDto = {
  name: string
  email: string
  role: UserRole
}
