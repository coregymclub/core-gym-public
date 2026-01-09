/**
 * Zoezi API Proxy for Core Gym Club
 * Proxies requests to z.coregym.club to solve Safari ITP cookie issues
 */

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const query = getQuery(event)

  // Build query string
  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  const targetUrl = `https://z.coregym.club/${path}${queryString ? '?' + queryString : ''}`

  // Forward request
  const method = event.method
  const headers: Record<string, string> = {}

  // Forward relevant headers
  const cookie = getHeader(event, 'cookie')
  if (cookie) headers['cookie'] = cookie

  const contentType = getHeader(event, 'content-type')
  if (contentType) headers['content-type'] = contentType

  // Get body for POST/PUT requests
  let body: any = undefined
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    try {
      body = await readBody(event)
      if (typeof body === 'object') {
        body = JSON.stringify(body)
        headers['content-type'] = 'application/json'
      }
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      credentials: 'include'
    })

    // Forward response headers, especially cookies
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      // Rewrite cookie domain to work with coregym.club
      const rewrittenCookie = setCookie
        .replace(/domain=[^;]+/gi, 'domain=.coregym.club')
        .replace(/samesite=none/gi, 'samesite=lax')

      setHeader(event, 'set-cookie', rewrittenCookie)
    }

    // Forward content type
    const responseContentType = response.headers.get('content-type')
    if (responseContentType) {
      setHeader(event, 'content-type', responseContentType)
    }

    // Return response
    if (responseContentType?.includes('application/json')) {
      return await response.json()
    }

    return await response.text()

  } catch (error: any) {
    console.error('[Zoezi Proxy] Error:', error.message)
    throw createError({
      statusCode: 502,
      message: 'Failed to proxy request to Zoezi'
    })
  }
})
