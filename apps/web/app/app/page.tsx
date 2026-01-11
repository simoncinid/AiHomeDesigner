import Link from 'next/link'

export default function AppHomePage() {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">
            Choose Your Tool
          </h1>
          <p className="text-xl text-navy-700 max-w-2xl mx-auto">
            Select the AI design tool that fits your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link
            href="/app/photo-makeover"
            className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-3">Photo Makeover</h2>
            <p className="text-navy-700 leading-relaxed">
              Upload a room photo and get 4 AI-powered design variations
            </p>
          </Link>

          <Link
            href="/app/room-generator"
            className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🎨</span>
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-3">Room Generator</h2>
            <p className="text-navy-700 leading-relaxed">
              Generate room designs from text descriptions
            </p>
          </Link>

          <Link
            href="/app/photo-to-video"
            className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🎬</span>
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-3">Photo to Video</h2>
            <p className="text-navy-700 leading-relaxed">
              Transform your designs into cinematic videos
            </p>
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
