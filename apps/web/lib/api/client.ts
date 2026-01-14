import { mockApi } from './mock'
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CreditsBalance,
  FreeQuota,
  Job,
  CreateT2IJobRequest,
  GalleryResponse,
  PricingResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ai-homedesigner-api.onrender.com'
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
const REQUEST_TIMEOUT = 30000

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

/**
 * API Error class
 */
export class ApiError extends Error {
  status: number
  detail: string
  
  constructor(status: number, detail: string) {
    super(detail)
    this.status = status
    this.detail = detail
    this.name = 'ApiError'
  }
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Make API request
 */
async function request<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  options: { isFormData?: boolean } = {}
): Promise<T> {
  const url = `${API_BASE_URL}/v1${endpoint}`
  
  const headers: Record<string, string> = {}
  
  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  }
  
  if (data) {
    if (options.isFormData) {
      fetchOptions.body = data as FormData
    } else {
      fetchOptions.body = JSON.stringify(data)
    }
  }
  
  try {
    const response = await fetchWithTimeout(url, fetchOptions)
    const text = await response.text()
    
    if (!response.ok) {
      let detail = 'Request failed'
      try {
        const errorData = JSON.parse(text)
        detail = errorData.detail || errorData.message || detail
      } catch {
        detail = text || detail
      }
      throw new ApiError(response.status, detail)
    }
    
    if (!text) {
      return {} as T
    }
    
    try {
      return JSON.parse(text) as T
    } catch {
      return text as unknown as T
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout')
      }
      throw new ApiError(0, error.message)
    }
    throw new ApiError(0, 'Unknown error')
  }
}

// API methods
const realApi = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, data?: unknown) => request<T>('POST', endpoint, data),
  put: <T>(endpoint: string, data?: unknown) => request<T>('PUT', endpoint, data),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
  postForm: <T>(endpoint: string, data: FormData) => 
    request<T>('POST', endpoint, data, { isFormData: true }),
}

/**
 * Typed API client
 */
export const apiClient = {
  // Auth
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (MOCK_MODE) return mockApi.login(data.email, data.password)
    return realApi.post('/auth/login', data)
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (MOCK_MODE) return mockApi.register(data.email, data.password)
    return realApi.post('/auth/register', {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    })
  },

  verifyCode: async (email: string, code: string): Promise<AuthResponse> => {
    if (MOCK_MODE) return mockApi.verifyToken('mock-token')
    return realApi.post('/auth/verify-code', { email, code })
  },

  getMe: async (): Promise<User> => {
    if (MOCK_MODE) return mockApi.getMe()
    return realApi.get('/auth/me')
  },

  logout: async (): Promise<void> => {
    setAuthToken(null)
    if (!MOCK_MODE) {
      await realApi.post('/auth/logout')
    }
  },

  // Credits
  getCreditsBalance: async (): Promise<CreditsBalance> => {
    if (MOCK_MODE) return mockApi.getCreditsBalance()
    const data = await realApi.get<any>('/auth/me')
    return {
      photoCredits: data.credits_photo || 0,
      videoCredits: data.credits_video || 0,
    }
  },

  getFreeQuota: async (): Promise<FreeQuota> => {
    if (MOCK_MODE) return mockApi.getFreeQuota()
    return realApi.get('/free-quota')
  },

  // Jobs
  createT2IJob: async (data: CreateT2IJobRequest): Promise<Job> => {
    if (MOCK_MODE) return mockApi.createT2IJob(data)
    return realApi.post('/jobs/t2i', {
      room_type: data.roomType,
      style_preset: data.stylePreset,
      user_prompt: data.userPrompt,
      size: data.size,
    })
  },

  createEditJob: async (formData: FormData): Promise<Job> => {
    if (MOCK_MODE) return mockApi.createEditJob(formData)
    return realApi.postForm('/jobs/edit', formData)
  },

  createI2VJob: async (formData: FormData): Promise<Job> => {
    if (MOCK_MODE) return mockApi.createI2VJob(formData)
    return realApi.postForm('/jobs/i2v', formData)
  },

  getJob: async (jobId: string): Promise<Job> => {
    if (MOCK_MODE) return mockApi.getJob(jobId)
    return realApi.get(`/jobs/${jobId}`)
  },

  getJobByShareId: async (shareId: string): Promise<Job> => {
    if (MOCK_MODE) return mockApi.getJobByShareId(shareId)
    return realApi.get(`/jobs/share/${shareId}`)
  },

  makeJobPublic: async (jobId: string): Promise<{ shareUrl: string }> => {
    if (MOCK_MODE) return { shareUrl: '/s/mock-share-id' }
    return realApi.post(`/jobs/${jobId}/make-public`)
  },

  getJobHistory: async (limit = 50, offset = 0): Promise<{ items: Job[], total: number }> => {
    if (MOCK_MODE) return { items: [], total: 0 }
    const data = await realApi.get<any>(`/jobs/history?limit=${limit}&offset=${offset}`)
    return {
      items: (data.items || []).map((job: any) => ({
        id: job.id,
        shareId: job.share_id,
        status: job.status,
        kind: job.kind,
        inputUrls: job.input_urls,
        outputUrls: job.output_urls,
        error: job.error,
        createdAt: job.created_at,
        roomType: job.room_type,
        stylePreset: job.style_preset,
      })),
      total: data.total || 0,
    }
  },

  // Gallery
  getGallery: async (limit = 12, offset = 0): Promise<GalleryResponse> => {
    if (MOCK_MODE) return mockApi.getGallery(limit, offset)
    return realApi.get(`/gallery?limit=${limit}&offset=${offset}`)
  },

  // Pricing
  getPricing: async (): Promise<PricingResponse> => {
    if (MOCK_MODE) return mockApi.getPricing()
    const data = await realApi.get<any>('/pricing')
    return {
      photoPacks: data.photo_packs || [],
      videoPacks: data.video_packs || [],
    }
  },

  // Stripe
  createCheckout: async (packId: string): Promise<{ url: string }> => {
    if (MOCK_MODE) return mockApi.createCheckout(packId)
    return realApi.post('/stripe/create-checkout', { pack_id: packId })
  },

  createDynamicCheckout: async (
    photoCredits: number, 
    videoCredits: number
  ): Promise<{ url: string }> => {
    if (MOCK_MODE) return mockApi.createDynamicCheckout(photoCredits, videoCredits)
    return realApi.post('/stripe/create-dynamic-checkout', { 
      photo_credits: photoCredits, 
      video_credits: videoCredits 
    })
  },

  // Transactions
  getTransactions: async (limit = 50, offset = 0): Promise<{ items: any[], total: number }> => {
    if (MOCK_MODE) return { items: [], total: 0 }
    return realApi.get(`/transactions?limit=${limit}&offset=${offset}`)
  },
}

export default apiClient
