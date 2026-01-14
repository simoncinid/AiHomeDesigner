/**
 * API Client - Snello e veloce con fetch nativa
 * Niente proxy, niente axios, solo chiamate dirette al backend
 */

// In produzione, chiama direttamente il backend
// In sviluppo, usa la variabile d'ambiente o fallback a localhost
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  'https://ai-homedesigner-api.onrender.com'

// Normalizza l'URL base (rimuovi trailing slashes)
const BASE_URL = API_BASE_URL.replace(/\/+$/, '')

// Timeout per le richieste (30 secondi)
const REQUEST_TIMEOUT = 30000

/**
 * Ottiene il token di autenticazione da localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

/**
 * Classe di errore API personalizzata
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
 * Funzione fetch con timeout e gestione errori
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
 * Esegue una richiesta API
 */
async function request<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  options: { isFormData?: boolean } = {}
): Promise<T> {
  const url = `${BASE_URL}/v1${endpoint}`
  
  const headers: Record<string, string> = {}
  
  // Aggiungi Content-Type solo se non è FormData
  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  
  // Aggiungi token di autenticazione se presente
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  }
  
  // Aggiungi body se presente
  if (data) {
    if (options.isFormData) {
      fetchOptions.body = data as FormData
    } else {
      fetchOptions.body = JSON.stringify(data)
    }
  }
  
  try {
    const response = await fetchWithTimeout(url, fetchOptions)
    
    // Leggi il body come testo
    const text = await response.text()
    
    // Se la risposta non è ok, lancia un errore
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
    
    // Parsa la risposta JSON
    if (!text) {
      return {} as T
    }
    
    try {
      return JSON.parse(text) as T
    } catch {
      // Se non è JSON valido, ritorna il testo come stringa
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

// Shorthand methods
const api = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, data?: unknown) => request<T>('POST', endpoint, data),
  put: <T>(endpoint: string, data?: unknown) => request<T>('PUT', endpoint, data),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
  postForm: <T>(endpoint: string, data: FormData) => 
    request<T>('POST', endpoint, data, { isFormData: true }),
}

// Tipi
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
  input_urls?: string[]
  output_urls?: string[]
  error?: string
  share_url: string
}

export interface GalleryItem {
  id: string
  share_id: string
  kind: 't2i' | 'edit' | 'i2v'
  input_urls?: string[]
  output_urls?: string[]
  room_type?: string
  style_preset?: string
  share_url: string
  created_at: string
}

export interface GalleryResponse {
  items: GalleryItem[]
  total: number
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  credits_photo: number
  credits_video: number
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    first_name?: string
    last_name?: string
  }
}

// API Client exports
export const apiClient = {
  // Health
  health: () => api.get<{ status: string }>('/health'),
  
  // Pricing
  pricing: () => api.get<{ photo_packs: PricingPack[]; video_packs: PricingPack[] }>('/pricing'),
  
  // Free quota
  freeQuota: () => api.get<{ remaining: number; total: number }>('/free-quota'),
  
  // Auth - Magic Link (legacy)
  requestMagicLink: (email: string) => 
    api.post<{ message: string }>('/auth/request-magic-link', { email }),
  
  verifyToken: (token: string) => 
    api.get<LoginResponse>(`/auth/verify?token=${token}`),
  
  // Auth - Email/Password
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => 
    api.post<{ message: string }>('/auth/register', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    }),
  
  login: (data: { email: string; password: string }) => 
    api.post<LoginResponse>('/auth/login', data),
  
  verifyCode: (data: { email: string; code: string }) =>
    api.post<LoginResponse>('/auth/verify-code', data),
  
  // User
  getMe: () => api.get<User>('/auth/me'),
  
  logout: () => api.post<{ message: string }>('/auth/logout'),
  
  // Jobs
  createT2IJob: (data: {
    room_type: string
    style_preset: string
    user_prompt?: string
    size?: string
  }) => api.post<Job>('/jobs/t2i', data),
  
  createEditJob: (formData: FormData) => 
    api.postForm<Job>('/jobs/edit', formData),
  
  createI2VJob: (formData: FormData) => 
    api.postForm<Job>('/jobs/i2v', formData),
  
  getJob: (jobId: string) => api.get<Job>(`/jobs/${jobId}`),
  
  getJobByShareId: (shareId: string) => api.get<Job>(`/jobs/share/${shareId}`),
  
  makeJobPublic: (jobId: string) => 
    api.post<{ share_url: string; message: string }>(`/jobs/${jobId}/make-public`),
  
  // Gallery
  getGallery: (limit?: number, offset?: number) => 
    api.get<GalleryResponse>(`/gallery?limit=${limit || 12}&offset=${offset || 0}`),
  
  // Stripe
  createCheckout: (packId: string) => 
    api.post<{ url: string }>('/stripe/create-checkout', { pack_id: packId }),
  
  createDynamicCheckout: (photoCredits: number, videoCredits: number) =>
    api.post<{ 
      url: string
      total_amount: number
      photo_credits: number
      video_credits: number 
    }>('/stripe/create-dynamic-checkout', { 
      photo_credits: photoCredits, 
      video_credits: videoCredits 
    }),
}

// Export default
export default apiClient
