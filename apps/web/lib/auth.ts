'use client'

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    // Validazione: il token deve essere una stringa valida
    if (!token || typeof token !== 'string' || token.length < 20) {
      // eslint-disable-next-line no-console
      console.error('[auth] setAuthToken: Invalid token!', { token, type: typeof token, length: token?.length })
      return
    }
    // eslint-disable-next-line no-console
    console.log('[auth] setAuthToken: Saving token', { length: token.length, preview: `${token.substring(0, 30)}...` })
    localStorage.setItem('auth_token', token)
    
    // Verifica immediata che sia stato salvato
    const saved = localStorage.getItem('auth_token')
    // eslint-disable-next-line no-console
    console.log('[auth] setAuthToken: Verification', { savedLength: saved?.length, match: saved === token })
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    // eslint-disable-next-line no-console
    console.log('[auth] getAuthToken:', { hasToken: !!token, length: token?.length })
    return token
  }
  return null
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[auth] clearAuthToken: Removing token')
    localStorage.removeItem('auth_token')
  }
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  return token !== null && token.length > 20
}
