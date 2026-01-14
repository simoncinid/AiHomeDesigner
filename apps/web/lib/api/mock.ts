import { delay, generateId } from '@/lib/utils'
import type {
  User,
  AuthResponse,
  CreditsBalance,
  FreeQuota,
  Job,
  GalleryItem,
  GalleryResponse,
  PricingResponse,
} from './types'

// Mock delay to simulate network latency
const MOCK_DELAY = 500

// Mock user
const mockUser: User = {
  id: 'mock-user-1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  creditsPhoto: 5,
  creditsVideo: 2,
}

// Mock placeholder images
const mockImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
]

// Mock gallery items
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    shareId: 'share-1',
    kind: 'edit',
    inputUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'],
    outputUrls: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    roomType: 'living_room',
    stylePreset: 'modern',
    shareUrl: '/s/share-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    shareId: 'share-2',
    kind: 't2i',
    outputUrls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    roomType: 'bedroom',
    stylePreset: 'scandinavian',
    shareUrl: '/s/share-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    shareId: 'share-3',
    kind: 'edit',
    inputUrls: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400'],
    outputUrls: ['https://images.unsplash.com/photo-1600210492486-275a8ee65a7c?w=800'],
    roomType: 'kitchen',
    stylePreset: 'minimalist',
    shareUrl: '/s/share-3',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    shareId: 'share-4',
    kind: 'i2v',
    inputUrls: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'],
    outputUrls: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
    roomType: 'living_room',
    stylePreset: 'modern',
    shareUrl: '/s/share-4',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    shareId: 'share-5',
    kind: 't2i',
    outputUrls: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'],
    roomType: 'bathroom',
    stylePreset: 'luxury',
    shareUrl: '/s/share-5',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '6',
    shareId: 'share-6',
    kind: 'edit',
    inputUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'],
    outputUrls: ['https://images.unsplash.com/photo-1600573472591-ee6c4e3d5e5a?w=800'],
    roomType: 'living_room',
    stylePreset: 'industrial',
    shareUrl: '/s/share-6',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

// Mock pricing
const mockPricing: PricingResponse = {
  photoPacks: [
    { id: 'photo-10', name: 'Starter', credits: 10, price: 9.99, priceId: 'price_photo_10' },
    { id: 'photo-30', name: 'Popular', credits: 30, price: 24.99, priceId: 'price_photo_30', popular: true },
    { id: 'photo-100', name: 'Pro', credits: 100, price: 69.99, priceId: 'price_photo_100' },
  ],
  videoPacks: [
    { id: 'video-5', name: 'Starter', credits: 5, price: 14.99, priceId: 'price_video_5' },
    { id: 'video-15', name: 'Popular', credits: 15, price: 39.99, priceId: 'price_video_15', popular: true },
    { id: 'video-50', name: 'Pro', credits: 50, price: 99.99, priceId: 'price_video_50' },
  ],
}

// Track mock jobs for status updates
const mockJobsInProgress: Map<string, { status: string; progress: number }> = new Map()

export const mockApi = {
  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(MOCK_DELAY)
    return {
      token: 'mock-token-' + generateId(),
      user: { ...mockUser, email },
    }
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    await delay(MOCK_DELAY)
    return {
      token: 'mock-token-' + generateId(),
      user: { ...mockUser, email },
    }
  },

  async requestMagicLink(email: string): Promise<{ message: string }> {
    await delay(MOCK_DELAY)
    return { message: 'Magic link sent to ' + email }
  },

  async verifyToken(token: string): Promise<AuthResponse> {
    await delay(MOCK_DELAY)
    return {
      token: 'mock-token-' + generateId(),
      user: mockUser,
    }
  },

  async getMe(): Promise<User> {
    await delay(MOCK_DELAY)
    return mockUser
  },

  // Credits
  async getCreditsBalance(): Promise<CreditsBalance> {
    await delay(MOCK_DELAY)
    return {
      photoCredits: mockUser.creditsPhoto,
      videoCredits: mockUser.creditsVideo,
    }
  },

  async getFreeQuota(): Promise<FreeQuota> {
    await delay(MOCK_DELAY)
    return { remaining: 1, total: 1 }
  },

  // Jobs
  async createT2IJob(data: any): Promise<Job> {
    await delay(MOCK_DELAY)
    const jobId = 'job-' + generateId()
    mockJobsInProgress.set(jobId, { status: 'processing', progress: 0 })
    
    // Simulate job completion after a delay
    setTimeout(() => {
      mockJobsInProgress.set(jobId, { status: 'completed', progress: 100 })
    }, 3000)

    return {
      id: jobId,
      shareId: 'share-' + generateId(),
      status: 'processing',
      kind: 't2i',
      shareUrl: '/s/share-' + generateId(),
    }
  },

  async createEditJob(formData: FormData): Promise<Job> {
    await delay(MOCK_DELAY)
    const jobId = 'job-' + generateId()
    mockJobsInProgress.set(jobId, { status: 'processing', progress: 0 })
    
    setTimeout(() => {
      mockJobsInProgress.set(jobId, { status: 'completed', progress: 100 })
    }, 4000)

    return {
      id: jobId,
      shareId: 'share-' + generateId(),
      status: 'processing',
      kind: 'edit',
      shareUrl: '/s/share-' + generateId(),
    }
  },

  async createI2VJob(formData: FormData): Promise<Job> {
    await delay(MOCK_DELAY)
    const jobId = 'job-' + generateId()
    mockJobsInProgress.set(jobId, { status: 'processing', progress: 0 })
    
    setTimeout(() => {
      mockJobsInProgress.set(jobId, { status: 'completed', progress: 100 })
    }, 6000)

    return {
      id: jobId,
      shareId: 'share-' + generateId(),
      status: 'processing',
      kind: 'i2v',
      shareUrl: '/s/share-' + generateId(),
    }
  },

  async getJob(jobId: string): Promise<Job> {
    await delay(300)
    const jobState = mockJobsInProgress.get(jobId)
    
    if (jobState?.status === 'completed') {
      return {
        id: jobId,
        shareId: 'share-' + generateId(),
        status: 'completed',
        kind: 'edit',
        outputUrls: mockImages.slice(0, 2),
        shareUrl: '/s/share-' + generateId(),
      }
    }

    return {
      id: jobId,
      shareId: 'share-' + generateId(),
      status: 'processing',
      kind: 'edit',
      shareUrl: '/s/share-' + generateId(),
    }
  },

  async getJobByShareId(shareId: string): Promise<Job> {
    await delay(MOCK_DELAY)
    const item = mockGalleryItems.find(i => i.shareId === shareId)
    if (item) {
      return {
        id: item.id,
        shareId: item.shareId,
        status: 'completed',
        kind: item.kind,
        inputUrls: item.inputUrls,
        outputUrls: item.outputUrls,
        shareUrl: item.shareUrl,
      }
    }
    throw new Error('Not found')
  },

  // Gallery
  async getGallery(limit = 12, offset = 0): Promise<GalleryResponse> {
    await delay(MOCK_DELAY)
    return {
      items: mockGalleryItems.slice(offset, offset + limit),
      total: mockGalleryItems.length,
    }
  },

  // Pricing
  async getPricing(): Promise<PricingResponse> {
    await delay(MOCK_DELAY)
    return mockPricing
  },

  // Stripe
  async createCheckout(packId: string): Promise<{ url: string }> {
    await delay(MOCK_DELAY)
    return { url: '/pricing?success=true&mock=true' }
  },

  async createDynamicCheckout(photoCredits: number, videoCredits: number): Promise<{ url: string }> {
    await delay(MOCK_DELAY)
    return { url: '/pricing?success=true&mock=true' }
  },
}
