export interface User {
  name: string
  email: string
  role: UserRole
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
