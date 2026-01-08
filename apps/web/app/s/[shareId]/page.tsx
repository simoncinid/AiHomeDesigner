import { Metadata } from 'next'
import { SharePageClient } from './SharePageClient'

export async function generateMetadata({ params }: { params: { shareId: string } }): Promise<Metadata> {
  // Fetch job data to determine if it should be indexed
  // For now, default to noindex
  return {
    title: 'Shared Design - AI Home Designer',
    robots: 'noindex',
  }
}

export default function SharePage({ params }: { params: { shareId: string } }) {
  return <SharePageClient shareId={params.shareId} />
}
