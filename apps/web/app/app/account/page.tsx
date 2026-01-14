'use client'

import { useState, useEffect } from 'react'
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
  Plus,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'
import { apiClient } from '@/lib/api'

interface Transaction {
  id: string
  kind: 'grant' | 'spend' | 'refund'
  photo_delta: number
  video_delta: number
  reason: string
  created_at: string
}

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { photoCredits, videoCredits, refresh } = useCreditsStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTx, setLoadingTx] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      refresh()
      fetchTransactions()
    }
  }, [isAuthenticated, refresh])

  const fetchTransactions = async () => {
    try {
      const data = await apiClient.getTransactions(20)
      setTransactions(data.items || [])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoadingTx(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-surface-secondary flex items-center justify-center mb-6">
          <User className="h-10 w-10 text-foreground-muted" />
        </div>
        <h1 className="heading-3 text-foreground mb-2">Sign in to view your account</h1>
        <p className="text-foreground-muted mb-8 max-w-md">
          Create an account to track your credits, view history, and manage your purchases.
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
          {loadingTx ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      tx.kind === 'grant' 
                        ? 'bg-success/10 text-success' 
                        : tx.kind === 'refund'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-surface-secondary text-foreground-muted'
                    }`}>
                      {tx.kind === 'grant' ? (
                        <Plus className="h-5 w-5" />
                      ) : tx.kind === 'refund' ? (
                        <Plus className="h-5 w-5" />
                      ) : (
                        <Minus className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.reason}</p>
                      <p className="text-sm text-foreground-muted">
                        {new Date(tx.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {tx.photo_delta !== 0 && (
                      <div className={`text-sm font-medium ${tx.photo_delta > 0 ? 'text-success' : 'text-foreground-muted'}`}>
                        {tx.photo_delta > 0 ? '+' : ''}{tx.photo_delta} photo
                      </div>
                    )}
                    {tx.video_delta !== 0 && (
                      <div className={`text-sm font-medium ${tx.video_delta > 0 ? 'text-success' : 'text-foreground-muted'}`}>
                        {tx.video_delta > 0 ? '+' : ''}{tx.video_delta} video
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-foreground-muted" />
              </div>
              <p className="text-foreground-muted mb-4">No transactions yet</p>
              <Button size="sm" asChild>
                <Link href="/pricing">Buy credits</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
