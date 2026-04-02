// ============================================================
// CONSTANTS — Navigation Admin Panel
// ============================================================

import { Permission } from '@/types/auth'

export interface NavItem {
  label: string
  href: string
  icon: string        // Tên icon (lucide-react)
  permission?: Permission
  children?: NavItem[]
  badge?: string      // VD: "Mới", số lượng pending
}

export const ADMIN_NAV: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
    permission: 'dashboard:read',
  },
  {
    label: 'Thông báo & Tin tức',
    href: '/admin/thong-bao',
    icon: 'Bell',
    permission: 'news:read',
    children: [
      { label: 'Tất cả bài đăng', href: '/admin/thong-bao', icon: 'List', permission: 'news:read' },
      { label: 'Tạo bài mới', href: '/admin/thong-bao/tao-moi', icon: 'PenSquare', permission: 'news:create' },
      { label: 'Danh mục', href: '/admin/thong-bao/danh-muc', icon: 'FolderOpen', permission: 'news:edit' },
    ],
  },
  {
    label: 'Chương trình Đào tạo',
    href: '/admin/chuong-trinh',
    icon: 'GraduationCap',
    permission: 'program:read',
    children: [
      { label: 'Thạc sĩ', href: '/admin/chuong-trinh/thac-si', icon: 'BookOpen', permission: 'program:read' },
      { label: 'Tiến sĩ', href: '/admin/chuong-trinh/tien-si', icon: 'BookOpen', permission: 'program:read' },
    ],
  },
  {
    label: 'Tuyển sinh',
    href: '/admin/tuyen-sinh',
    icon: 'ClipboardList',
    permission: 'admission:read',
    children: [
      { label: 'Đợt tuyển sinh', href: '/admin/tuyen-sinh/dot', icon: 'Calendar', permission: 'admission:read' },
      { label: 'Hồ sơ ứng viên', href: '/admin/tuyen-sinh/ho-so', icon: 'Users', permission: 'admission:read' },
    ],
  },
  {
    label: 'Đào tạo ngắn hạn',
    href: '/admin/dao-tao-ngan-han',
    icon: 'BookMarked',
    permission: 'program:read',
  },
  {
    label: 'Văn bản - Tài liệu',
    href: '/admin/van-ban',
    icon: 'FileText',
    permission: 'document:read',
  },
  {
    label: 'Thời khóa biểu',
    href: '/admin/thoi-khoa-bieu',
    icon: 'CalendarDays',
    permission: 'program:read',
  },
  {
    label: 'Quản lý Menu',
    href: '/admin/menu',
    icon: 'PanelTop',
    permission: 'settings:manage',
  },
  {
    label: 'Nội dung trang chủ',
    href: '/admin/trang-chu-cms',
    icon: 'Layout',
    permission: 'news:edit',
  },
  {
    label: 'AI Chatbot',
    href: '/admin/ai-chatbot',
    icon: 'Bot',
    permission: 'news:edit',
    badge: 'Mới',
  },
  {
    label: 'Upload Manager',
    href: '/admin/upload-manager',
    icon: 'Upload',
    permission: 'upload:manage',
  },
  {
    label: 'Người dùng',
    href: '/admin/nguoi-dung',
    icon: 'UserCog',
    permission: 'user:read',
  },
  {
    label: 'Cài đặt',
    href: '/admin/cai-dat',
    icon: 'Settings',
    permission: 'settings:manage',
  },
]
