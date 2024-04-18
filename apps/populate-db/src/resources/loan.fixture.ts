import { ObjectId, WithId } from 'mongodb'
// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  Loan,
  LoanStatus,
} from '../../../../packages/business-utils/domain/src/index'

export const loanFixtures: WithId<Loan>[] = [
  {
    _id: new ObjectId('661f130fc3fdd13fa39c2fa9'),
    startDate: new Date('2024-02-10T12:00:00Z'),
    amount: 10000,
    term: 3,
    state: LoanStatus.PENDING,
    customerId: new ObjectId('661f140fc3fdd12fa39c2fa9'),
  },
  {
    _id: new ObjectId('661f140fc3fdd14fa39c2fa9'),
    startDate: new Date('2024-02-10T12:00:00Z'),
    amount: 10000,
    term: 3,
    state: LoanStatus.APPROVED,
    customerId: new ObjectId('661f140fc3fdd12fa39c2faa'),
  },
  {
    _id: new ObjectId('661f150fc3fdd14fa39c2fa9'),
    startDate: new Date('2024-02-10T12:00:00Z'),
    amount: 10000,
    term: 3,
    state: LoanStatus.PAID,
    customerId: new ObjectId('661f140fc3fdd12fa39c2faa'),
  },
]
