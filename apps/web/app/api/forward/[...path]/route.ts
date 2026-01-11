import { NextRequest } from 'next/server'

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''
const DEFAULT_PROD_API_BASE_URL = 'https://ai-homedesigner-api.onrender.com'
const NORMALIZED_API_BASE_URL = (RAW_API_BASE_URL || DEFAULT_PROD_API_BASE_URL).replace(/\/+$/, '')

function buildTargetUrl(path: string, search: string) {
  const baseHasV1 = NORMALIZED_API_BASE_URL.endsWith('/v1')
  const prefix = baseHasV1 ? '' : '/v1'
  const url = new URL(`${NORMALIZED_API_BASE_URL}${prefix}/${path}`)
  if (search) {
    url.search = search.startsWith('?') ? search.slice(1) : search
  }
  return url.toString()
}

async function forward(request: NextRequest, params: { path: string[] }) {
  if (!RAW_API_BASE_URL) {
    console.error('[api/forward] Missing API base URL env; using default', {
      defaultBaseUrl: DEFAULT_PROD_API_BASE_URL,
    })
  }

  const path = params.path.join('/')
  const targetUrl = buildTargetUrl(path, request.nextUrl.search)
  console.log('[api/forward] proxy', {
    method: request.method,
    targetUrl,
  })

  const headers = new Headers(request.headers)

  headers.delete('host')
  headers.delete('connection')
  headers.delete('content-length')
  headers.delete('accept-encoding')

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  let response: Response
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy fetch failed'
    console.error('[api/forward] fetch error', { targetUrl, message })
    return Response.json(
      { detail: 'Upstream request failed', message },
      { status: 504 }
    )
  } finally {
    clearTimeout(timeout)
  }

  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('content-encoding')

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params)
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params)
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params)
}

export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params)
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params)
}
