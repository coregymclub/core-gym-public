export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || ''
  const url = getRequestURL(event)

  // Handle zeydance.coregym.club subdomain
  if (host.startsWith('zeydance.')) {
    // Don't redirect if already on /zeydance path
    if (!url.pathname.startsWith('/zeydance')) {
      const newPath = url.pathname === '/' ? '/zeydance' : `/zeydance${url.pathname}`
      return sendRedirect(event, newPath, 302)
    }
  }
})
