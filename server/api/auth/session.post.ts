/**
 * Session sync endpoint for Core Gym Club
 * Sets the Zoezi session cookie on .coregym.club domain
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { session, user } = body

  if (!session) {
    throw createError({
      statusCode: 400,
      message: 'Missing session token'
    })
  }

  // Set cookie on .coregym.club domain (server-side for proper domain handling)
  setCookie(event, 'zoeziId', session, {
    domain: '.coregym.club',
    path: '/',
    httpOnly: false, // Allow JS access for Zoezi compatibility
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  return {
    success: true,
    user: user || null
  }
})
