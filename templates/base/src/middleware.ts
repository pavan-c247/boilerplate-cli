import { NextRequest, NextResponse } from 'next/server';

import {
  isRoleAllowedOnRoute,
  matchesRoute,
  PUBLIC_ROUTES,
} from '@/config/routes';
import { USER_ROLES } from '@/constants';

// Helper function to get user role from plain cookie
const getUserRole = (request: NextRequest): number | null => {
  const roleCookie = request.cookies.get('user_role_id');
  if (!roleCookie?.value) return null;

  try {
    const roleId = Number(roleCookie.value);
    return isNaN(roleId) ? null : roleId;
  } catch {
    return null;
  }
};

// Helper function to check if user is authenticated
const isAuthenticated = (request: NextRequest): boolean => {
  // Check for role cookie (indicates user is logged in)
  const roleCookie = request.cookies.get('user_role_id');
  if (roleCookie) return true;
  
  // Also check if any cookies exist (encrypted cookies might be present)
  // Encrypted cookie keys are long hex strings
  const cookies = request.cookies.getAll();
  return cookies.some(cookie => cookie.name.length > 20);
};

// Helper function to get default home path based on role
const getHomePath = (userRole: number | null): string => {
  if (
    userRole === USER_ROLES.ADMIN ||
    userRole === USER_ROLES.USER
  ) {
    return '/dashboard';
  }

  return '/dashboard'; // fallback
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ============================================================================
  // ROOT PATH HANDLING
  // ============================================================================
  if (pathname === '/') {
    const authenticated = isAuthenticated(request);
    const userRole = getUserRole(request);
    
    if (authenticated && userRole) {
      const homePath = getHomePath(userRole);
      return NextResponse.redirect(new URL(homePath, request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ============================================================================
  // PUBLIC ROUTES (No authentication required)
  // ============================================================================
  // Routes: /login, /signup, /forgot-password, /reset-password, /terms
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);

  if (isPublicRoute) {
    const authenticated = isAuthenticated(request);
    const userRole = getUserRole(request);
    
    // If user is authenticated and tries to access auth pages, redirect to home
    if (authenticated && userRole) {
      const homePath = getHomePath(userRole);
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    // Allow access to public routes without authentication
    return NextResponse.next();
  }

  // ============================================================================
  // PROTECTED ROUTES (Authentication required)
  // ============================================================================
  // Check if user is authenticated
  if (!isAuthenticated(request)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role
  const userRole = getUserRole(request);

  if (!userRole) {
    // User is authenticated but role is missing - redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ============================================================================
  // ROLE-BASED ROUTE PROTECTION
  // ============================================================================
  // Check if user's role is allowed to access this route
  // Each route in ROUTE_PROTECTION defines which roles are allowed
  // - Admin-only routes: /dashboard, /users, /cms, /documents, etc.
  // - User-only routes: /subscription
  // - Both roles: /profile
  // 
  // If user's role is not in allowedRoles, redirect to specified path
  const routeCheck = isRoleAllowedOnRoute(pathname, userRole);
  
  if (!routeCheck.allowed) {
    // User's role is not allowed on this route - redirect them
    const redirectPath = routeCheck.redirectTo || '/login';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ============================================================================
  // DEFAULT: Allow access if authenticated and role is allowed
  // ============================================================================
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

