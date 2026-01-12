import axios from 'axios'

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const NORMALIZED_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '')
const API_PROXY_BASE = '/api/forward'

// Timeout aumentato per operazioni che richiedono tempo (registrazione, invio email, ecc.)
const DEFAULT_TIMEOUT = 35000

const api = axios.create({
  baseURL: API_PROXY_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (typeof window !== 'undefined') {
    const data = config.data
    let safeData: unknown = data
    if (data && typeof data === 'object' && !(data instanceof FormData)) {
      safeData = { ...data }
      if ('password' in (safeData as Record<string, unknown>)) {
        ;(safeData as Record<string, unknown>).password = '***'
      }
    } else if (data instanceof FormData) {
      safeData = '[form-data]'
    }
    // eslint-disable-next-line no-console
    console.log('[api] request', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      apiBaseUrl: NORMALIZED_API_BASE_URL,
      data: safeData,
    })
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[api] response', {
        url: response.config?.url,
        status: response.status,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[api] error', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      })
    }
    return Promise.reject(error)
  }
)

export interface PricingPack {
  id: string
  name: string
  credits: number
  price: number
  price_id: string
}

export interface Job {
  id: string
  share_id: string
  status: 'created' | 'processing' | 'completed' | 'failed'
  kind: 't2i' | 'edit' | 'i2v'
  output_urls?: string[]
  error?: string
  share_url: string
}

export const apiClient = {
  health: () => api.get('/health'),
  
  pricing: () => api.get<{ photo_packs: PricingPack[]; video_packs: PricingPack[] }>('/pricing'),
  
  freeQuota: () => api.get<{ remaining: number; total: number }>('/free-quota'),
  
  requestMagicLink: (email: string) => api.post('/auth/request-magic-link', { email }),
  
  verifyToken: (token: string) => api.get(`/auth/verify?token=${token}`),
  
  createT2IJob: (data: {
    room_type: string
    style_preset: string
    user_prompt?: string
    size?: string
  }) => api.post<Job>('/jobs/t2i', data),
  
  createEditJob: (formData: FormData) => api.post<Job>('/jobs/edit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  createI2VJob: (formData: FormData) => api.post<Job>('/jobs/i2v', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  getJob: (jobId: string) => api.get<Job>(`/jobs/${jobId}`),
  
  getJobByShareId: (shareId: string) => api.get<Job>(`/jobs/share/${shareId}`),
  
  makeJobPublic: (jobId: string) => api.post(`/jobs/${jobId}/make-public`),
  
  createCheckout: (packId: string) => api.post<{ url: string }>('/stripe/create-checkout', { pack_id: packId }),
  
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => 
    api.post('/auth/register', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    }),
  
  login: (data: { email: string; password: string }) => 
    api.post<{ token: string; user: { id: string; email: string } }>('/auth/login', data),
  
  verifyCode: (data: { email: string; code: string }) =>
    api.post<{ token: string; user: { id: string; email: string } }>('/auth/verify-code', data),
  
  getMe: () => api.get<{ id: string; email: string; credits_photo: number; credits_video: number }>('/auth/me'),
}
