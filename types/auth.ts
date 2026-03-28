// ============================================================
// TYPES — Auth & Phân quyền
// ============================================================

/**
 * 3 Role hệ thống:
 *  - ADMIN            : Quản trị viên — toàn quyền hệ thống
 *  - EDITOR           : Biên tập viên — thêm/sửa nội dung, không xóa
 *  - ADMISSION_OFFICER: Cán bộ tuyển sinh — quản lý hồ sơ & đợt tuyển sinh
 */
export type Role =
  | 'ADMIN'
  | 'EDITOR'
  | 'ADMISSION_OFFICER'

export type Permission =
  // Thông báo / Tin tức
  | 'news:read' | 'news:create' | 'news:edit' | 'news:delete' | 'news:publish'
  // Chương trình đào tạo
  | 'program:read' | 'program:create' | 'program:edit' | 'program:delete'
  // Tuyển sinh
  | 'admission:read' | 'admission:edit' | 'admission:delete' | 'admission:export'
  // Văn bản
  | 'document:read' | 'document:create' | 'document:edit' | 'document:delete'
  // Người dùng
  | 'user:read' | 'user:create' | 'user:edit' | 'user:delete'
  // Hệ thống
  | 'role:manage'
  | 'settings:manage'
  | 'upload:manage' | 'upload:delete'
  | 'log:read'
  | 'dashboard:read'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string
}

export interface AuthToken {
  userId: string
  role: Role
  iat: number
  exp: number
}
