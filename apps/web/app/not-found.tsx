import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-foreground/10">404</h1>
        </div>
        <h2 className="heading-2 text-foreground mb-4">Page not found</h2>
        <p className="text-foreground-muted mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/app">
              <ArrowLeft className="h-4 w-4" />
              Back to app
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
