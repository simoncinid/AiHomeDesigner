import Link from 'next/link'

export default function AppHomePage() {
  return (
    <div className="min-h-screen py-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">AI Home Designer</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/app/photo-makeover"
          className="border rounded-lg p-8 hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-4">📸</div>
          <h2 className="text-2xl font-semibold mb-2">Photo Makeover</h2>
          <p className="text-gray-600">
            Upload a room photo and get 4 AI-powered design variations
          </p>
        </Link>

        <Link
          href="/app/room-generator"
          className="border rounded-lg p-8 hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-4">🎨</div>
          <h2 className="text-2xl font-semibold mb-2">Room Generator</h2>
          <p className="text-gray-600">
            Generate room designs from text descriptions
          </p>
        </Link>

        <Link
          href="/app/photo-to-video"
          className="border rounded-lg p-8 hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-4">🎬</div>
          <h2 className="text-2xl font-semibold mb-2">Photo to Video</h2>
          <p className="text-gray-600">
            Transform your designs into cinematic videos
          </p>
        </Link>
      </div>

      <div className="text-center">
        <Link
          href="/pricing"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
        >
          View Pricing
        </Link>
      </div>
    </div>
  )
}
