import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
}
