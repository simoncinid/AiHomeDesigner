'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  CreditCard,
  LogOut,
  Image as ImageIcon,
  Video,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { photoCredits, videoCredits } = useCreditsStore()

  // Mock transaction history
  const transactions = [
    {
      id: '1',
      type: 'purchase',
      description: 'Photo Pack - 30 credits',
      amount: 24.99,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: '2',
      type: 'usage',
      description: 'Photo generation',
      amount: -1,
      date: new Date(Date.now() - 86400000).toISOString(),
      unit: 'credit',
    },
    {
      id: '3',
      type: 'usage',
      description: 'Video generation',
      amount: -1,
      date: new Date().toISOString(),
      unit: 'credit',
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-surface-secondary flex items-center justify-center mb-6">
          <User className="h-10 w-10 text-foreground-muted" />
        </div>
        <h1 className="heading-3 text-foreground mb-2">Sign in to view your account</h1>
        <p className="text-foreground-muted mb-8 max-w-md">
          Create an account to track your credits, view history, and manage your subscription.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="heading-3 text-foreground">Account</h1>
        <p className="text-foreground-muted mt-1">Manage your profile and credits</p>
      </div>

      {/* Profile card */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-500">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-foreground-muted">{user?.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Input
              label="First name"
              defaultValue={user?.firstName || ''}
              disabled
            />
            <Input
              label="Last name"
              defaultValue={user?.lastName || ''}
              disabled
            />
            <div className="sm:col-span-2">
              <Input
                label="Email"
                defaultValue={user?.email || ''}
                disabled
                leftIcon={<Mail className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="danger" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credits card */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              Credits
            </CardTitle>
            <Button size="sm" asChild>
              <Link href="/pricing">
                Buy more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-primary-500" />
                </div>
                <span className="text-sm text-foreground-muted">Photo Credits</span>
              </div>
              <p className="text-4xl font-bold text-foreground">{photoCredits}</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Video className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-sm text-foreground-muted">Video Credits</span>
              </div>
              <p className="text-4xl font-bold text-foreground">{videoCredits}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="divide-y divide-border">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'purchase' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-surface-secondary text-foreground-muted'
                  }`}>
                    {tx.type === 'purchase' ? (
                      <CreditCard className="h-5 w-5" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <p className="text-sm text-foreground-muted">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {tx.type === 'purchase' ? (
                    <span className="font-semibold text-foreground">
                      ${tx.amount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-foreground-muted">
                      {tx.amount} {tx.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
