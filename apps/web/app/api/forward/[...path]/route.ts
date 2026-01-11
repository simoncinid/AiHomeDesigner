import { NextRequest } from 'next/server'

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const NORMALIZED_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '')

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
  const path = params.path.join('/')
  const targetUrl = buildTargetUrl(path, request.nextUrl.search)
  const headers = new Headers(request.headers)

  headers.delete('host')
  headers.delete('connection')
  headers.delete('content-length')

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer()

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  })

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
