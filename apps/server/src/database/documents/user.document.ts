import { WithId } from 'mongodb'

export type UserDocument = WithId<{
  name: string
  email: string
}>
