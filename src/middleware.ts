import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const protectedRoutes = ['/products/manage', '/profiles/customer', '/dashboard'];
const artisanOnlyRoutes = ['/products/manage'];
const customerOnlyRoutes = ['/profiles/customer'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedProtectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route),
  );

  if (!matchedProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url),
    );
  }

  const session = await verifyToken(token);

  if (!session) {
    const response = NextResponse.redirect(
      new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url),
    );
    response.cookies.delete('token');
    return response;
  }

  if (
    artisanOnlyRoutes.some((route) => pathname.startsWith(route)) &&
    session.role !== 'artisan'
  ) {
    return NextResponse.redirect(new URL('/profiles/customer', request.url));
  }

  if (
    customerOnlyRoutes.some((route) => pathname.startsWith(route)) &&
    session.role !== 'customer'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/manage/:path*', '/profiles/customer/:path*', '/dashboard/:path*'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Protected routes that require authentication
const protectedRoutes = [
  '/products/manage',
  '/profiles/customer',
  '/dashboard',
];

// Routes that require artisan role
const artisanRoutes = [
  '/products/manage',
];

// Routes that require customer role
const customerRoutes: string[] = []; // Add customer-only routes here if needed

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check artisan-only routes
    const isArtisanRoute = artisanRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isArtisanRoute && payload.role !== 'artisan') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check customer-only routes
    const isCustomerRoute = customerRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isCustomerRoute && payload.role !== 'customer') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

