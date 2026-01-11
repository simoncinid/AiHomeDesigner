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
      <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-navy-900 mb-8">Account</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <p className="text-yellow-800 mb-6 font-medium">Please log in to view your account.</p>
            <Link
              href="/app"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-block"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Account</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-800 font-medium">Credits purchased successfully! They have been added to your account.</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Your Credits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6">
                <p className="text-navy-700 font-medium mb-2">Photo Credits</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">-</p>
                <p className="text-sm text-navy-500">(Fetch from API)</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6">
                <p className="text-navy-700 font-medium mb-2">Video Credits</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">-</p>
                <p className="text-sm text-navy-500">(Fetch from API)</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Purchase Credits</h2>
            <Link
              href="/pricing"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-block"
            >
              View Pricing
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Your Designs</h2>
            <p className="text-navy-700">Your generated designs will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
