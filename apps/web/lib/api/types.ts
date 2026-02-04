// Auth types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  creditsPhoto: number
  creditsVideo: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface MagicLinkRequest {
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Credits types
export interface CreditsBalance {
  photoCredits: number
  videoCredits: number
}

export interface FreeQuota {
  remaining: number
  total: number
}

export interface FreeLeadPayload {
  name: string
  email: string
  language: string
}

// Job types
export type JobStatus = 'created' | 'processing' | 'completed' | 'failed'
export type JobKind = 't2i' | 'edit' | 'i2v'

export interface Job {
  id: string
  shareId: string
  status: JobStatus
  kind: JobKind
  inputUrls?: string[]
  outputUrls?: string[]
  error?: string
  shareUrl: string
  createdAt?: string
  roomType?: string
  stylePreset?: string
}

export interface CreateT2IJobRequest {
  roomType: string
  stylePreset: string
  userPrompt?: string
  size?: string
}

export interface CreateEditJobRequest {
  image: File
  styleReference?: File
  roomType: string
  stylePreset: string
  userPrompt?: string
  keepLayout?: boolean
  keepItems?: boolean
  size?: string
}

export interface CreateI2VJobRequest {
  image: File
  motionPreset?: string
  duration?: number
  resolution?: string
}

// Gallery types
export interface GalleryItem {
  id: string
  shareId: string
  kind: JobKind
  inputUrls?: string[]
  outputUrls?: string[]
  roomType?: string
  stylePreset?: string
  shareUrl: string
  createdAt: string
}

export interface GalleryResponse {
  items: GalleryItem[]
  total: number
}

// Pricing types
export interface PricingPack {
  id: string
  name: string
  credits: number
  price: number
  priceId: string
  popular?: boolean
}

export interface PricingResponse {
  photoPacks: PricingPack[]
  videoPacks: PricingPack[]
}

// Stripe types
export interface CheckoutResponse {
  url: string
}

export interface DynamicCheckoutResponse {
  url: string
  totalAmount: number
  photoCredits: number
  videoCredits: number
}
