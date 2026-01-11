import Link from 'next/link'

interface HeaderProps {
  showAppNav?: boolean
}

export function Header({ showAppNav = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
              AI Home Designer
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {showAppNav ? (
              <>
                <Link
                  href="/app/photo-makeover"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Photo Makeover
                </Link>
                <Link
                  href="/app/room-generator"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Room Generator
                </Link>
                <Link
                  href="/app/photo-to-video"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Photo to Video
                </Link>
                <Link
                  href="/app/account"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/app/photo-makeover"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Photo Makeover
                </Link>
                <Link
                  href="/app/room-generator"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Room Generator
                </Link>
                <Link
                  href="/pricing"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            {!showAppNav && (
              <Link
                href="/app/photo-makeover"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Create Design
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
