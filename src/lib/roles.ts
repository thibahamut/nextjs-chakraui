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

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/app/admin': ['super_admin', 'admin'],
  '/app/management': ['super_admin', 'admin', 'manager'],
  '/app/settings': ['super_admin', 'admin'],
}

// Helper function to check if a user has permission based on required roles
export function hasPermission(userRole: UserRole | undefined | null, requiredRoles: UserRole[]): boolean {
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
    if (hasPermission(userRole, allowedRoles)) {
      return React.createElement(Component, rest as P)
    }
    return null
  }
}

// Hook to check role permissions
export function useRoleCheck(userRole: UserRole | undefined | null) {
  return {
    hasPermission: (requiredRoles: UserRole[]) => hasPermission(userRole, requiredRoles)
  }
} 