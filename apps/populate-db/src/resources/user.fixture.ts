import { ObjectId, WithId } from 'mongodb'
// ToDo: solve why @business-utils/domain is not working doesn't work
import {
  User,
  UserRole,
} from '../../../../packages/business-utils/domain/src/index'

export const userFixtures: WithId<User>[] = [
  {
    _id: new ObjectId('661f140fc3fdd12fa39c2fa9'),
    name: 'Jean',
    email: 'jean@gmail.com',
    role: UserRole.CUSTOMER,
  },
  {
    _id: new ObjectId('661f140fc3fdd12fa39c2faa'),
    name: 'Paul',
    email: 'paul@gmail.com',
    role: UserRole.CUSTOMER,
  },
  {
    _id: new ObjectId('661f140fc3fdd12fa39c2fbb'),
    name: 'Claude',
    email: 'claude@gmail.com',
    role: UserRole.ADMIN,
  },
]
