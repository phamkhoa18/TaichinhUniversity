// ============================================================
// LIB/AUTH — Permission System
// ============================================================

import { Role, Permission } from '@/types/auth'

// Map từng role sang danh sách permission
export const ROLE_PERMISSIONS: Record<Role, Permission[] | readonly ['*']> = {
  // ✅ ADMIN — Toàn quyền hệ thống (tương đương SUPER_ADMIN cũ)
  ADMIN: ['*'] as const,

  // ✅ EDITOR — Biên tập nội dung (không xóa, không quản lý user)
  EDITOR: [
    'news:read', 'news:create', 'news:edit',
    'program:read', 'program:create', 'program:edit',
    'document:read', 'document:create', 'document:edit',
    'upload:manage',
    'dashboard:read',
  ],

  // ✅ ADMISSION_OFFICER — Tuyển sinh là chính
  ADMISSION_OFFICER: [
    'news:read', 'news:create', 'news:edit',
    'program:read',
    'admission:read', 'admission:edit', 'admission:export',
    'document:read',
    'dashboard:read',
  ],
}

/**
 * Kiểm tra user có permission không
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role]
  if ((perms as readonly string[]).includes('*')) return true
  return (perms as Permission[]).includes(permission)
}

/**
 * Kiểm tra nhiều permission cùng lúc (phải có tất cả)
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Kiểm tra ít nhất 1 trong các permission
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}
