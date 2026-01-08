'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import Link from 'next/link'

export default function AccountPage() {
  const searchParams = useSearchParams()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccess(true)
    }
  }, [searchParams])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen py-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Account</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-4">Please log in to view your account.</p>
          <Link
            href="/app"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition inline-block"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">Credits purchased successfully! They have been added to your account.</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Credits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Photo Credits</p>
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-gray-500">(Fetch from API)</p>
            </div>
            <div>
              <p className="text-gray-600">Video Credits</p>
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-gray-500">(Fetch from API)</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Purchase Credits</h2>
          <Link
            href="/pricing"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition inline-block"
          >
            View Pricing
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Designs</h2>
          <p className="text-gray-600">Your generated designs will appear here.</p>
        </div>
      </div>
    </div>
  )
}
