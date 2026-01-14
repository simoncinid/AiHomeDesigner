'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient, setAuthToken } from '@/lib/api'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  })

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      setAuthToken(response.token)
      login(
        {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
        },
        response.token
      )
      toast({ type: 'success', title: 'Welcome to AI Home Designer!' })
      router.push('/app')
    } catch (error: any) {
      toast({ 
        type: 'error', 
        title: 'Registration failed', 
        message: error.detail || 'Please try again' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Create your account" 
      description="Start designing your dream spaces today"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...form.register('firstName')}
            placeholder="First name"
            leftIcon={<User className="h-5 w-5" />}
            error={form.formState.errors.firstName?.message}
            disabled={isLoading}
          />
          <Input
            {...form.register('lastName')}
            placeholder="Last name"
            error={form.formState.errors.lastName?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          {...form.register('email')}
          type="email"
          placeholder="Email address"
          leftIcon={<Mail className="h-5 w-5" />}
          error={form.formState.errors.email?.message}
          disabled={isLoading}
        />

        <Input
          {...form.register('password')}
          type="password"
          placeholder="Password (min 8 characters)"
          leftIcon={<Lock className="h-5 w-5" />}
          error={form.formState.errors.password?.message}
          disabled={isLoading}
        />

        {/* Password requirements */}
        <div className="px-1">
          <p className="text-xs text-foreground-muted">Password must contain:</p>
          <ul className="mt-1 space-y-1">
            {[
              { label: 'At least 8 characters', valid: (form.watch('password')?.length || 0) >= 8 },
            ].map((req) => (
              <li key={req.label} className="flex items-center gap-2 text-xs">
                <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${
                  req.valid ? 'bg-success text-white' : 'bg-surface-secondary'
                }`}>
                  {req.valid && <Check className="h-2.5 w-2.5" />}
                </div>
                <span className={req.valid ? 'text-foreground' : 'text-foreground-muted'}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Terms acceptance */}
        <div>
          <Toggle
            checked={acceptTerms}
            onChange={(checked) => {
              setAcceptTerms(checked)
              form.setValue('acceptTerms', checked)
            }}
            label={
              <span className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-500 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-500 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
          />
          {form.formState.errors.acceptTerms && (
            <p className="mt-1 text-sm text-danger">
              {form.formState.errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Create account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-foreground-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-500 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
