import { Repayment } from '@business-utils/domain'
import { WithId } from 'mongodb'

export type RepaymentDocument = WithId<Repayment>
