import Link from 'next/link'
import { Header } from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto">
            {/* 404 */}
            <div className="relative mb-8">
              <span className="text-[10rem] font-semibold text-slate-100 leading-none select-none">404</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg className="w-12 h-12 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-slate-500 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="btn-primary w-full sm:w-auto">
                Go Home
              </Link>
              <Link href="/app/photo-makeover" className="btn-secondary w-full sm:w-auto">
                Start Designing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
