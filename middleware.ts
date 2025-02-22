import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/uploadthing(.*)'  // Add this to exclude uploadthing routes
])

export default clerkMiddleware(async (auth, request) => {
  console.log("middleware running: ", request.url)
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Run for API routes but exclude uploadthing
    '/(api(?!/uploadthing))(.*)',  // Modified to exclude uploadthing
    '/trpc(.*)'
  ],
}