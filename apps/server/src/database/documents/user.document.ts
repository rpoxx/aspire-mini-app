import { UserRole } from '@business-utils/domain'
import { WithId } from 'mongodb'

export type UserDocument = WithId<{
  name: string
  email: string
  role: UserRole
}>
