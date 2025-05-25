import React from 'react'

// Role hierarchy definition matching the middleware
export const ROLE_HIERARCHY = {
  'super_admin': 4,
  'admin': 3,
  'manager': 2,
  'dn': 1,
  'user': 0
} as const

export type UserRole = keyof typeof ROLE_HIERARCHY

// Helper function to check if a user has a specific role
export function hasRole(userRole: UserRole | undefined | null, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return userRole === requiredRole
}

// Helper function to check if a user has any of the required roles
export function hasAnyRole(userRole: UserRole | undefined | null, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

// Helper function to check if a user has all of the required roles
export function hasAllRoles(userRole: UserRole | undefined | null, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

// Higher-order component to conditionally render components based on role
export function withRoleCheck<P extends { userRole?: UserRole }>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function RoleCheckedComponent(props: P) {
    const { userRole, ...rest } = props
    if (hasAnyRole(userRole, allowedRoles)) {
      return React.createElement(Component, rest as P)
    }
    return null
  }
}

// Hook to check role permissions
export function useRoleCheck(userRole: UserRole | undefined | null) {
  return {
    hasRole: (requiredRole: UserRole) => hasRole(userRole, requiredRole),
    hasAnyRole: (requiredRoles: UserRole[]) => hasAnyRole(userRole, requiredRoles),
    hasAllRoles: (requiredRoles: UserRole[]) => hasAllRoles(userRole, requiredRoles),
  }
} 