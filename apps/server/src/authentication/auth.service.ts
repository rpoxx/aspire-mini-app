import { TOKEN_ADMIN } from '../secret/secret.service'

/**
 * retrieve the token of the admin
 * @returns the token to help connect as admin
 */
export function getAdminToken(): string {
  return TOKEN_ADMIN
}

/**
 * validate the admin token
 * @param token : token to validate
 * @returns a boolean indicating if the token is valid
 */
export function validateAdminToken(token: string): boolean {
  return token === TOKEN_ADMIN
}
