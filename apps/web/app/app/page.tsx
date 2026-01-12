import Link from 'next/link'

const tools = [
  {
    title: 'Photo Makeover',
    description: 'Upload a room photo and get 4 AI-generated design variations',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    href: '/app/photo-makeover',
    gradient: 'from-brand-500/20 to-brand-600/10',
    iconColor: 'text-brand-400',
  },
  {
    title: 'Room Generator',
    description: 'Generate room designs from text descriptions',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    href: '/app/room-generator',
    gradient: 'from-accent-emerald/20 to-accent-emerald/10',
    iconColor: 'text-accent-emerald',
  },
  {
    title: 'Photo to Video',
    description: 'Transform your designs into cinematic videos',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    href: '/app/photo-to-video',
    gradient: 'from-accent-cyan/20 to-accent-cyan/10',
    iconColor: 'text-accent-cyan',
  },
]

export default function AppHomePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your Tool
          </h1>
          <p className="text-xl text-dark-400 max-w-2xl mx-auto">
            Select the AI design tool that fits your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="card-interactive p-8 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 ${tool.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {tool.icon}
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-brand-300 transition-colors">
                {tool.title}
              </h2>
              <p className="text-dark-400 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-6 flex items-center text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Get started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/pricing" className="btn-secondary">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
