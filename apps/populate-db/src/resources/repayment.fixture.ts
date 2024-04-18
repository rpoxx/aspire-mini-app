import { ObjectId } from 'mongodb'
// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  Repayment,
  RepaymentStatus,
} from '../../../../packages/business-utils/domain/src/index'

export const repaymentFixtures: Repayment[] = [
  {
    paymentDate: new Date('2024-02-17T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PENDING,
    loanId: new ObjectId('661f130fc3fdd13fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-24T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PENDING,
    loanId: new ObjectId('661f130fc3fdd13fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-17T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PENDING,
    loanId: new ObjectId('661f130fc3fdd13fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-24T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PAID,
    loanId: new ObjectId('661f140fc3fdd14fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-17T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PENDING,
    loanId: new ObjectId('661f140fc3fdd14fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-24T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PENDING,
    loanId: new ObjectId('661f140fc3fdd14fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-24T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PAID,
    loanId: new ObjectId('661f150fc3fdd14fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-17T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PAID,
    loanId: new ObjectId('661f150fc3fdd14fa39c2fa9'),
  },
  {
    paymentDate: new Date('2024-02-24T12:00:00Z'),
    amount: 3333.33,
    state: RepaymentStatus.PAID,
    loanId: new ObjectId('661f150fc3fdd14fa39c2fa9'),
  },
]
