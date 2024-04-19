import { TOKEN_ADMIN } from '../secret/secret.service'

/**
 * retrieve the token of the admin
 * @returns the token to help connect as admin
 */
export function getAdminToken(): string {
  return TOKEN_ADMIN
}
