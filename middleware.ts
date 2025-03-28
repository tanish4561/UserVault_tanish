import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are considered public (no auth required)
  const isPublicPath = path === "/login"

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value || ""

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on a public path but has a token, redirect to users page
    return NextResponse.redirect(new URL("/users", request.url))
  }

  if (!isPublicPath && !token) {
    // If user is on a protected path but doesn't have a token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue with the request if no redirects are needed
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/", "/login", "/users/:path*"],
}

