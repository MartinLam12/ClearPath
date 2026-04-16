import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/assessment", "/reports", "/settings"];

// Routes only accessible when NOT authenticated
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Generate a nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Skip auth checks if Supabase is not configured
  if (!url || !key || !url.startsWith("http")) {
    const response = NextResponse.next({ request });
    response.headers.set("x-nonce", nonce);
    setCSPHeaders(response, nonce);
    return response;
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session (important for token rotation)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // If user is NOT logged in and tries to access a protected route → redirect to /login
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("x-nonce", nonce);
    setCSPHeaders(redirectResponse, nonce);
    return redirectResponse;
  }

  // If user IS logged in and tries to access login/signup → redirect to /dashboard
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("x-nonce", nonce);
    setCSPHeaders(redirectResponse, nonce);
    return redirectResponse;
  }

  // Add nonce to response headers
  supabaseResponse.headers.set("x-nonce", nonce);
  setCSPHeaders(supabaseResponse, nonce);
  return supabaseResponse;
}

function setCSPHeaders(response: NextResponse, nonce: string) {
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};