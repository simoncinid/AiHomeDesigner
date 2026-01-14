'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient, setAuthToken } from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.login(data)
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
      toast({ type: 'success', title: 'Welcome back!' })
      router.push('/app')
    } catch (error: any) {
      toast({ 
        type: 'error', 
        title: 'Login failed', 
        message: error.detail || 'Please check your credentials' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      description="Sign in to your account to continue"
    >
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
              placeholder="Password"
              leftIcon={<Lock className="h-5 w-5" />}
          error={form.formState.errors.password?.message}
              disabled={isLoading}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-foreground-muted">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
