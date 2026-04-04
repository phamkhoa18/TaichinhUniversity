// ============================================================
// TYPES — Upload System
// ============================================================

export type UploadCategory = 'images' | 'documents' | 'banners' | 'avatars' | 'temp' | 'applicants'

export interface UploadedFile {
  url: string          // Đường dẫn lưu trữ (relative hoặc CDN URL)
  originalName: string
  fileName: string     // Tên file đã được đặt unique
  size: number         // bytes
  mimeType: string
  category: UploadCategory
  uploadedAt: Date
  uploadedBy?: string  // userId
}

export interface UploadResponse {
  success: boolean
  url: string
  originalName: string
  size: number
  category: UploadCategory
  error?: string
}

export interface UploadConfig {
  maxFileSizeMB: number
  allowedMimeTypes: string[]
  category: UploadCategory
}
