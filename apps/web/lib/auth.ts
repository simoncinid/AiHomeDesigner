/**
 * Auth utilities - Gestione semplice del token
 */

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  
  if (!token || typeof token !== 'string' || token.length < 20) {
    console.error('[auth] setAuthToken: Invalid token!')
    return
  }
  
  localStorage.setItem('auth_token', token)
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  return !!token && token.length > 20
}
