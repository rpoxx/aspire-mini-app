import { Loan } from '@business-utils/domain'
import { WithId } from 'mongodb'

export type LoanDocument = WithId<Loan>
