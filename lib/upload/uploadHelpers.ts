// ============================================================
// LIB/UPLOAD — Upload Helpers
// ============================================================

import { UploadCategory } from '@/types/upload'

/**
 * Tạo tên file unique: timestamp + random + tên gốc (đã sanitize)
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const sanitized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
  return `${timestamp}-${random}-${sanitized}`
}

/**
 * Validate file trước khi upload
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Loại file không được phép. Chỉ chấp nhận: ${allowedTypes.join(', ')}`,
    }
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File quá lớn. Tối đa ${maxSizeMB}MB`,
    }
  }
  return { valid: true }
}

/**
 * Format kích thước file hiển thị
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Kiểm tra file có phải ảnh không
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

/**
 * Kiểm tra file có phải PDF không
 */
export function isPdfFile(mimeType: string): boolean {
  return mimeType === 'application/pdf'
}

/**
 * Lấy extension từ tên file
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}
