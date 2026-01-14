'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient, setAuthToken } from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type LoginFormData = z.infer<typeof loginSchema>
type MagicLinkFormData = z.infer<typeof magicLinkSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('password')
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const passwordForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  })

  const handlePasswordLogin = async (data: LoginFormData) => {
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

  const handleMagicLink = async (data: MagicLinkFormData) => {
    setIsLoading(true)
    try {
      await apiClient.requestMagicLink(data.email)
      setMagicLinkSent(true)
      toast({ 
        type: 'success', 
        title: 'Magic link sent!', 
        message: 'Check your email for the login link' 
      })
    } catch (error: any) {
      toast({ 
        type: 'error', 
        title: 'Failed to send magic link', 
        message: error.detail || 'Please try again' 
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
      <Tabs defaultValue="password" onValueChange={(v) => setAuthMode(v as any)}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
          <TabsTrigger value="magic" className="flex-1">Magic Link</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <form onSubmit={passwordForm.handleSubmit(handlePasswordLogin)} className="space-y-4">
            <Input
              {...passwordForm.register('email')}
              type="email"
              placeholder="Email address"
              leftIcon={<Mail className="h-5 w-5" />}
              error={passwordForm.formState.errors.email?.message}
              disabled={isLoading}
            />
            <Input
              {...passwordForm.register('password')}
              type="password"
              placeholder="Password"
              leftIcon={<Lock className="h-5 w-5" />}
              error={passwordForm.formState.errors.password?.message}
              disabled={isLoading}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="magic">
          {magicLinkSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Check your email
              </h3>
              <p className="text-foreground-muted mb-6">
                We sent a magic link to{' '}
                <span className="font-medium">{magicLinkForm.getValues('email')}</span>
              </p>
              <Button
                variant="ghost"
                onClick={() => setMagicLinkSent(false)}
              >
                Use a different email
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={magicLinkForm.handleSubmit(handleMagicLink)} className="space-y-4">
              <Input
                {...magicLinkForm.register('email')}
                type="email"
                placeholder="Email address"
                leftIcon={<Mail className="h-5 w-5" />}
                error={magicLinkForm.formState.errors.email?.message}
                disabled={isLoading}
              />

              <Button type="submit" fullWidth isLoading={isLoading}>
                Send magic link
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>

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
