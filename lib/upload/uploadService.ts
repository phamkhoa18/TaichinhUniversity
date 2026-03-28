// ============================================================
// LIB/UPLOAD — Upload Service (Core)
// ✅ Hoạt động đúng cả dev lẫn production build (Next.js)
// ============================================================

import { writeFile, unlink, readdir, mkdir } from 'fs/promises'
import { join } from 'path'
import { UploadCategory, UploadedFile } from '@/types/upload'
import { UPLOAD_CONFIG } from './uploadConfig'
import { generateUniqueFilename, validateFile } from './uploadHelpers'

/**
 * Upload 1 file lên storage local
 * Dùng process.cwd() để đúng đường dẫn cả khi build production
 */
export async function uploadFile(
  file: File,
  category: UploadCategory,
  userId?: string
): Promise<UploadedFile> {
  const config = UPLOAD_CONFIG[category]

  // Validate
  const validation = validateFile(file, config.allowedTypes, config.maxSizeMB)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Tạo thư mục nếu chưa có
  // ✅ process.cwd() = root project, không đổi khi build
  const uploadDir = join(process.cwd(), 'public', config.path)
  await mkdir(uploadDir, { recursive: true })

  // Tạo tên file unique
  const uniqueName = generateUniqueFilename(file.name)
  const filePath = join(uploadDir, uniqueName)

  // Write file
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  return {
    url: `/${config.path}/${uniqueName}`,
    originalName: file.name,
    fileName: uniqueName,
    size: file.size,
    mimeType: file.type,
    category,
    uploadedAt: new Date(),
    uploadedBy: userId,
  }
}

/**
 * Xóa file khỏi storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  // fileUrl: /uploads/images/xxx.jpg  →  public/uploads/images/xxx.jpg
  const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl
  const fullPath = join(process.cwd(), 'public', relativePath)
  await unlink(fullPath)
}

/**
 * Lấy danh sách file trong 1 category
 */
export async function listFiles(category: UploadCategory): Promise<string[]> {
  const config = UPLOAD_CONFIG[category]
  const dirPath = join(process.cwd(), 'public', config.path)
  try {
    const files = await readdir(dirPath)
    return files.map((f) => `/${config.path}/${f}`)
  } catch {
    return []
  }
}

// ============================================================
// TODO: Khi cần migrate sang Cloudinary / S3
// Chỉ cần thay thế hàm uploadFile, deleteFile, listFiles ở đây
// Toàn bộ component và API không cần sửa
// ============================================================
