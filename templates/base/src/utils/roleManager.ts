/**
 * Role Management Utility
 * Maps role IDs to role names for consistent display
 * Role ID 1 = Admin
 * Role ID 2 = User
 */

/**
 * Role mapping configuration
 */
export const ROLE_MAPPING = {
  ADMIN: 1,
  USER: 2,
} as const;

/**
 * Role names for display
 */
export const ROLE_NAMES = {
  [ROLE_MAPPING.ADMIN]: "Admin",
  [ROLE_MAPPING.USER]: "User",
} as const;

/**
 * Maps role ID to role name for display purposes
 * @param role - Role ID (number) or role name (string)
 * @returns Role name for display
 */
export const getRoleDisplayName = (role: number): string => {
  // If role is a number, map to role name
  if (ROLE_NAMES[role as keyof typeof ROLE_NAMES]) {
    return ROLE_NAMES[role as keyof typeof ROLE_NAMES];
  }
  
  // Default fallback for unknown roles
  return "Unknown Role";
};