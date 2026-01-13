import { USER_ROLES } from '@/constants';
import { paths } from "@/routes";

// Public routes - accessible without authentication
export const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/terms',
] as const;

// Route protection configuration
// allowedRoles: roles that are allowed to access this route
// redirectTo: where to redirect users with roles not in allowedRoles
export const ROUTE_PROTECTION: Record<
  string,
  { allowedRoles: number[]; redirectTo: string }
> = {
  // Admin-only routes
  '/dashboard': {
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
    redirectTo: paths.DASHBOARD,
  },
  '/users': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/cms': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/documents': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/bulk-import': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/faq': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/support-email': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/plans-management': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/subscriptions-list': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/forms': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/simple-listing': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/fixed-column': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/accordian-list': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  '/accordian-list-v2': {
    allowedRoles: [USER_ROLES.ADMIN],
    redirectTo: paths.DASHBOARD,
  },
  // User-only routes (Admin cannot access)
  '/subscription': {
    allowedRoles: [USER_ROLES.USER],
    redirectTo: paths.DASHBOARD,
  },
  // Routes accessible to both Admin and User
  '/profile': {
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
    redirectTo: paths.LOGIN,
  },
  '/lms': {
    allowedRoles: [USER_ROLES.USER],
    redirectTo: paths.DASHBOARD,
  },
};

// Helper function to check if route matches pattern
export const matchesRoute = (pathname: string, routes: readonly string[]): boolean => {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

// Helper function to check if user role is allowed on route
export const isRoleAllowedOnRoute = (
  pathname: string,
  userRole: number
): { allowed: boolean; redirectTo?: string } => {
  const protectedRoute = Object.keys(ROUTE_PROTECTION).find((route) =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    const config = ROUTE_PROTECTION[protectedRoute];
    // Check if user's role is in the allowedRoles array
    if (!config.allowedRoles.includes(userRole)) {
      return { allowed: false, redirectTo: config.redirectTo };
    }
  }

  return { allowed: true };
};

