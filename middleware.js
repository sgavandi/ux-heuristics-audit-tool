/**
 * Vercel Edge Middleware — Basic Auth gate for the deployed site.
 *
 * When `SITE_PASSWORD` is set on the deployment, every request must
 * present matching HTTP Basic credentials. Username is fixed to
 * `review`. When `SITE_PASSWORD` is empty (e.g. preview builds), the
 * middleware is a no-op.
 *
 * The password lives only in the Vercel environment — it is never
 * inlined into the client bundle, unlike `VITE_*` variables.
 */

export const config = {
  // Skip static assets so the browser can cache them once authed and so
  // the middleware doesn't add latency to every image/font request.
  matcher: [
    '/((?!_next/|favicon\\.svg|assets/|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf|css|js|map)).*)',
  ],
}

export default function middleware(request) {
  const password = process.env.SITE_PASSWORD
  if (!password) return

  const header = request.headers.get('authorization') || ''
  const expected = 'Basic ' + btoa(`review:${password}`)
  if (header === expected) return

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="UX Heuristics Audit Tool"',
      'Cache-Control': 'no-store',
    },
  })
}
