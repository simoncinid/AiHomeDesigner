'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { setAuthToken } from '@/lib/auth'
import Link from 'next/link'
import { Header } from '@/components/Header'

type AuthMode = 'login' | 'register' | 'verify'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const token = searchParams.get('token')
  
  const [mode, setMode] = useState<AuthMode>(token ? 'verify' : 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Register fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Verify fields
  const [verificationCode, setVerificationCode] = useState('')

  // Funzione centralizzata per salvare il token e navigare
  const saveTokenAndNavigate = async (token: string) => {
    // eslint-disable-next-line no-console
    console.log('[login] saveTokenAndNavigate called with token:', {
      token: token,
      type: typeof token,
      length: token?.length,
      preview: token ? `${token.substring(0, 30)}...` : 'UNDEFINED/NULL',
    })
    
    // Validazione del token
    if (!token || typeof token !== 'string' || token.length < 20) {
      // eslint-disable-next-line no-console
      console.error('[login] INVALID TOKEN RECEIVED!', { token, type: typeof token })
      setError('Invalid token received from server')
      setLoading(false)
      return
    }
    
    // 1. Salva il token DIRETTAMENTE in localStorage (più affidabile)
    localStorage.setItem('auth_token', token)
    
    // Verifica immediata
    const savedToken = localStorage.getItem('auth_token')
    // eslint-disable-next-line no-console
    console.log('[login] Token saved verification:', {
      saved: !!savedToken,
      savedLength: savedToken?.length,
      match: savedToken === token,
    })
    
    if (savedToken !== token) {
      // eslint-disable-next-line no-console
      console.error('[login] TOKEN SAVE FAILED!')
      setError('Failed to save authentication token')
      setLoading(false)
      return
    }
    
    // 2. Invalida le query cached
    queryClient.clear() // Pulisce TUTTA la cache
    
    // 3. IMPORTANTE: usa window.location per un full page reload
    // Questo assicura che la nuova pagina legga il token fresco da localStorage
    // router.push() può avere problemi di timing con SSR/hydration
    window.location.href = '/app/account'
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        setError('All fields are required')
        setLoading(false)
        return
      }
      
      await apiClient.register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password })
      setSuccess('Registration complete! Check your email for the verification code.')
      setMode('verify')
    } catch (err: unknown) {
      console.error('[auth] register failed', err)
      const axiosError = err as { code?: string; response?: { data?: { detail?: unknown } } }
      const errorDetail = axiosError.response?.data?.detail
      let errorMessage = 'Registration failed'
      if (axiosError?.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Please try again.'
      }
      
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0 && errorDetail[0]?.msg) {
          errorMessage = errorDetail[0].msg
        } else if (typeof errorDetail === 'object' && errorDetail !== null) {
          const detailObj = errorDetail as { msg?: string; message?: string }
          errorMessage = detailObj.msg || detailObj.message || errorMessage
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await apiClient.login({ email: loginEmail, password: loginPassword })
      
      // eslint-disable-next-line no-console
      console.log('[login] Login response:', {
        status: response.status,
        data: response.data,
        hasToken: !!response.data?.token,
        tokenType: typeof response.data?.token,
        tokenLength: response.data?.token?.length,
      })
      
      // Usa la funzione centralizzata
      await saveTokenAndNavigate(response.data.token)
    } catch (err: unknown) {
      console.error('[auth] login failed', err)
      const axiosError = err as { response?: { data?: { detail?: unknown } } }
      const errorDetail = axiosError.response?.data?.detail
      let errorMessage = 'Invalid email or password'
      
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0 && errorDetail[0]?.msg) {
          errorMessage = errorDetail[0].msg
        } else if (typeof errorDetail === 'object' && errorDetail !== null) {
          const detailObj = errorDetail as { msg?: string; message?: string }
          errorMessage = detailObj.msg || detailObj.message || errorMessage
        }
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (token) {
        const response = await apiClient.verifyToken(token)
        if (response.data) {
          setSuccess('Account verified! Redirecting...')
          await saveTokenAndNavigate(response.data.token || token)
        }
      } else if (email && verificationCode) {
        const response = await apiClient.verifyCode({ email, code: verificationCode })
        setSuccess('Account verified! Redirecting...')
        await saveTokenAndNavigate(response.data.token)
      } else {
        setError('Email not found. Please register again.')
        setLoading(false)
      }
    } catch (err: unknown) {
      console.error('[auth] verify failed', err)
      const axiosError = err as { response?: { data?: { detail?: unknown } } }
      const errorDetail = axiosError.response?.data?.detail
      let errorMessage = 'Invalid verification code'
      
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0 && errorDetail[0]?.msg) {
          errorMessage = errorDetail[0].msg
        } else if (typeof errorDetail === 'object' && errorDetail !== null) {
          const detailObj = errorDetail as { msg?: string; message?: string }
          errorMessage = detailObj.msg || detailObj.message || errorMessage
        }
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="card p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Verify Account'}
              </h1>
              <p className="text-slate-500">
                {mode === 'login' 
                  ? 'Sign in to access your account'
                  : mode === 'register'
                  ? 'Create an account to purchase credits'
                  : 'Enter the verification code sent to your email'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                <p className="text-emerald-600 text-sm font-medium">{success}</p>
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="input"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="input"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="input"
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input"
                    placeholder="Repeat password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </form>
            )}

            {mode === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    className="input text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="0000"
                    maxLength={4}
                  />
                  <p className="text-sm text-slate-400 mt-2 text-center">
                    Enter the 4-digit code sent to your email
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              {mode === 'login' ? (
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : mode === 'register' ? (
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              ) : null}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
