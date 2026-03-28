// ============================================================
// LIB/UPLOAD — Upload Config
// ============================================================

import { UploadCategory } from '@/types/upload'

export const UPLOAD_CONFIG: Record<UploadCategory, {
  maxSizeMB: number
  allowedTypes: string[]
  path: string
}> = {
  images: {
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    path: 'uploads/images',
  },
  documents: {
    maxSizeMB: 10,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    path: 'uploads/documents',
  },
  banners: {
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    path: 'uploads/banners',
  },
  avatars: {
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    path: 'uploads/avatars',
  },
  temp: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    path: 'uploads/temp',
  },
}
