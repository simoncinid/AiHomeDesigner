import { NextRequest } from 'next/server'

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''
const DEFAULT_PROD_API_BASE_URL = 'https://ai-homedesigner-api.onrender.com'
const NORMALIZED_API_BASE_URL = (RAW_API_BASE_URL || DEFAULT_PROD_API_BASE_URL).replace(/\/+$/, '')

// Timeout più lungo per operazioni che richiedono tempo (es. registrazione con invio email)
const PROXY_TIMEOUT_MS = 30000

function buildTargetUrl(path: string, search: string) {
  const baseHasV1 = NORMALIZED_API_BASE_URL.endsWith('/v1')
  const prefix = baseHasV1 ? '' : '/v1'
  const url = new URL(`${NORMALIZED_API_BASE_URL}${prefix}/${path}`)
  if (search) {
    url.search = search.startsWith('?') ? search.slice(1) : search
  }
  return url.toString()
}

async function forward(request: NextRequest, pathSegments: string[]) {
  if (!RAW_API_BASE_URL) {
    console.warn('[api/forward] Missing API base URL env; using default', {
      defaultBaseUrl: DEFAULT_PROD_API_BASE_URL,
    })
  }

  const path = pathSegments.join('/')
  const targetUrl = buildTargetUrl(path, request.nextUrl.search)
  
  // Log header Authorization che arriva
  const authHeader = request.headers.get('authorization')
  console.log('[api/forward] proxy request', {
    method: request.method,
    path,
    targetUrl,
    hasAuthHeader: !!authHeader,
    authHeaderPreview: authHeader ? `${authHeader.substring(0, 40)}...` : 'null',
    timestamp: new Date().toISOString(),
  })

  const headers = new Headers(request.headers)
  
  // Verifica che l'header Authorization sia stato copiato
  console.log('[api/forward] forwarding auth header:', !!headers.get('authorization'))

  // Rimuovi header che non devono essere proxati
  headers.delete('host')
  headers.delete('connection')
  headers.delete('content-length')
  headers.delete('accept-encoding')

  let body: ArrayBuffer | undefined
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.arrayBuffer()
      console.log('[api/forward] request body size:', body.byteLength, 'bytes')
    } catch (e) {
      console.error('[api/forward] failed to read request body', e)
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => {
    console.error('[api/forward] timeout reached for', targetUrl)
    controller.abort()
  }, PROXY_TIMEOUT_MS)

  let response: Response
  try {
    const startTime = Date.now()
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
      signal: controller.signal,
    })
    const duration = Date.now() - startTime
    console.log('[api/forward] upstream response', {
      targetUrl,
      status: response.status,
      duration: `${duration}ms`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy fetch failed'
    const isAbort = error instanceof Error && error.name === 'AbortError'
    console.error('[api/forward] fetch error', { 
      targetUrl, 
      message,
      isTimeout: isAbort,
    })
    return Response.json(
      { 
        detail: isAbort ? 'Request timeout' : 'Upstream request failed', 
        message,
        targetUrl,
      },
      { status: isAbort ? 504 : 502 }
    )
  } finally {
    clearTimeout(timeout)
  }

  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('content-encoding')
  responseHeaders.delete('transfer-encoding')
  
  // IMPORTANTE: assicurati che Content-Type sia preservato per il parsing JSON
  const contentType = response.headers.get('content-type')
  console.log('[api/forward] response content-type:', contentType)
  
  // Se il backend risponde con JSON, assicurati che il Content-Type sia impostato
  if (contentType && contentType.includes('application/json')) {
    responseHeaders.set('Content-Type', 'application/json')
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

// Next.js 14+ richiede che params sia awaited (è una Promise)
type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return forward(request, path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return forward(request, path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return forward(request, path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return forward(request, path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return forward(request, path)
}
