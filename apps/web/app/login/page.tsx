'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

type AuthMode = 'login' | 'register' | 'verify'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Le password non corrispondono')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri')
      setLoading(false)
      return
    }

    try {
      // Verifica che tutti i campi siano compilati
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        setError('Tutti i campi sono obbligatori')
        setLoading(false)
        return
      }
      
      await apiClient.register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password })
      setSuccess('Registrazione completata! Controlla la tua email per il codice di verifica.')
      setMode('verify')
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[auth] register failed', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      })
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'Errore durante la registrazione'
      
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
          // Pydantic validation errors
          const firstError = errorDetail[0]
          errorMessage = firstError.msg || errorMessage
        } else if (typeof errorDetail === 'object') {
          errorMessage = errorDetail.msg || errorDetail.message || errorMessage
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
      localStorage.setItem('auth_token', response.data.token)
      router.push('/app/account')
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[auth] login failed', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      })
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'Email o password errate'
      
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
          const firstError = errorDetail[0]
          errorMessage = firstError.msg || errorMessage
        } else if (typeof errorDetail === 'object') {
          errorMessage = errorDetail.msg || errorDetail.message || errorMessage
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (token) {
        // Magic link verification
        const response = await apiClient.verifyToken(token)
        if (response.data) {
          localStorage.setItem('auth_token', response.data.token || token)
          setSuccess('Account verificato! Reindirizzamento...')
          setTimeout(() => {
            router.push('/app/account')
          }, 1500)
        }
      } else if (email && verificationCode) {
        // Code verification
        const response = await apiClient.verifyCode({ email, code: verificationCode })
        localStorage.setItem('auth_token', response.data.token)
        setSuccess('Account verificato! Reindirizzamento...')
        setTimeout(() => {
          router.push('/app/account')
        }, 1500)
      } else {
        setError('Email non trovata. Perfavore registrati di nuovo.')
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[auth] verify failed', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      })
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'Codice di verifica non valido'
      
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
          const firstError = errorDetail[0]
          errorMessage = firstError.msg || errorMessage
        } else if (typeof errorDetail === 'object') {
          errorMessage = errorDetail.msg || errorDetail.message || errorMessage
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              {mode === 'login' ? 'Accedi' : mode === 'register' ? 'Registrati' : 'Verifica Account'}
            </h1>
            <p className="text-navy-600">
              {mode === 'login' 
                ? 'Accedi al tuo account per acquistare crediti'
                : mode === 'register'
                ? 'Crea un account per acquistare crediti'
                : 'Inserisci il codice di verifica inviato alla tua email'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="tuo@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Password</label>
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
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Nome</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="input"
                    placeholder="Mario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Cognome</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="input"
                    placeholder="Rossi"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="tuo@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="input"
                  placeholder="Minimo 8 caratteri"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Conferma Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="Ripeti la password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrazione...' : 'Registrati'}
              </button>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Codice di Verifica</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="input text-center text-2xl tracking-widest"
                  placeholder="XXXX"
                  maxLength={4}
                />
                <p className="text-sm text-navy-500 mt-2">
                  Inserisci il codice a 4 cifre inviato alla tua email
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifica in corso...' : 'Verifica'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-navy-600">
                Non hai un account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Registrati
                </button>
              </p>
            ) : mode === 'register' ? (
              <p className="text-sm text-navy-600">
                Hai già un account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Accedi
                </button>
              </p>
            ) : null}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-navy-500 hover:text-navy-700"
            >
              ← Torna alla home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
