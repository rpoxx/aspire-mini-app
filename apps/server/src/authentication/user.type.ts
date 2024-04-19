import { Request, Response } from 'express'

export type AuthRequest = Request & {
  params: {
    id: string
  }
}
export type AuthResponse = Response & string
